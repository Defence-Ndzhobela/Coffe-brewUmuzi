require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { neon } = require("@neondatabase/serverless");

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is missing. Add it to backend/.env");
}

const sql = neon(process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());

const ALLOWED_METHODS = [
	"Aeropress",
	"Drip coffee",
	"V60",
	"French Press",
	"Chemex",
];

const toBrewDto = (row) => ({
	id: row.id,
	beans: row.beans,
	method: row.method,
	coffeeGrams: Number(row.coffee_grams),
	waterGrams: Number(row.water_grams),
	rating: Number(row.rating),
	tastingNotes: row.tasting_notes ?? undefined,
	createdAt:
		typeof row.created_at === "string"
			? row.created_at
			: new Date(row.created_at).toISOString(),
});

const validateBrewPayload = (payload) => {
	const errors = [];

	if (!payload || typeof payload !== "object") {
		return ["Invalid request body."];
	}

	if (!payload.beans || !String(payload.beans).trim()) {
		errors.push("beans is required.");
	}

	if (!ALLOWED_METHODS.includes(payload.method)) {
		errors.push("method must be one of the allowed brew methods.");
	}

	const coffee = Number(payload.coffeeGrams);
	const water = Number(payload.waterGrams);
	const rating = Number(payload.rating);

	if (!Number.isFinite(coffee) || coffee <= 0) {
		errors.push("coffeeGrams must be a positive number.");
	}

	if (!Number.isFinite(water) || water <= 0) {
		errors.push("waterGrams must be a positive number.");
	}

	if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
		errors.push("rating must be between 0 and 5.");
	}

	return errors;
};

const getMethodIdByName = async (methodName) => {
	const result = await sql`
		SELECT id FROM brew_methods WHERE name = ${methodName}
	`;

	if (!result[0]) {
		throw new Error(`Brew method not found: ${methodName}`);
	}

	return result[0].id;
};

const applySchema = async () => {
	await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

	await sql`
		CREATE TABLE IF NOT EXISTS brew_methods (
			id SMALLSERIAL PRIMARY KEY,
			name VARCHAR(40) NOT NULL UNIQUE,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	await sql`
		INSERT INTO brew_methods (name)
		VALUES
			('Aeropress'),
			('Drip coffee'),
			('V60'),
			('French Press'),
			('Chemex')
		ON CONFLICT (name) DO NOTHING
	`;

	await sql`
		CREATE TABLE IF NOT EXISTS brews (
			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
			legacy_id TEXT UNIQUE,
			beans VARCHAR(160) NOT NULL CHECK (LENGTH(TRIM(beans)) > 0),
			method_id SMALLINT NOT NULL REFERENCES brew_methods(id),
			coffee_grams NUMERIC(7,2) NOT NULL CHECK (coffee_grams > 0),
			water_grams NUMERIC(7,2) NOT NULL CHECK (water_grams > 0),
			rating SMALLINT NOT NULL CHECK (rating BETWEEN 0 AND 5),
			tasting_notes TEXT,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;

	await sql`
		CREATE OR REPLACE FUNCTION set_updated_at()
		RETURNS TRIGGER AS $$
		BEGIN
			NEW.updated_at = NOW();
			RETURN NEW;
		END;
		$$ LANGUAGE plpgsql
	`;

	await sql`DROP TRIGGER IF EXISTS tr_brews_updated_at ON brews`;

	await sql`
		CREATE TRIGGER tr_brews_updated_at
		BEFORE UPDATE ON brews
		FOR EACH ROW
		EXECUTE FUNCTION set_updated_at()
	`;

	await sql`
		CREATE INDEX IF NOT EXISTS idx_brews_created_at_desc
		ON brews (created_at DESC)
	`;

	await sql`
		CREATE INDEX IF NOT EXISTS idx_brews_method_created_at
		ON brews (method_id, created_at DESC)
	`;

	await sql`
		CREATE INDEX IF NOT EXISTS idx_brews_beans_lower
		ON brews (LOWER(beans))
	`;
};

app.get("/api/health", async (_req, res) => {
	try {
		const result = await sql`SELECT NOW() AS now`;
		res.json({ ok: true, now: result[0].now });
	} catch (error) {
		res.status(500).json({ ok: false, error: error.message });
	}
});

app.post("/api/setup-db", async (_req, res) => {
	try {
		await applySchema();
		res.json({ ok: true, message: "Database schema applied successfully." });
	} catch (error) {
		res.status(500).json({ ok: false, error: error.message });
	}
});

app.get("/api/brews", async (_req, res) => {
	try {
		const rows = await sql`
			SELECT
				b.id,
				b.beans,
				m.name AS method,
				b.coffee_grams,
				b.water_grams,
				b.rating,
				b.tasting_notes,
				b.created_at
			FROM brews b
			INNER JOIN brew_methods m ON m.id = b.method_id
			ORDER BY b.created_at DESC
		`;

		res.json(rows.map(toBrewDto));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.post("/api/brews", async (req, res) => {
	try {
		const errors = validateBrewPayload(req.body);
		if (errors.length > 0) {
			return res.status(400).json({ errors });
		}

		const methodId = await getMethodIdByName(req.body.method);
		const tastingNotes = req.body.tastingNotes?.trim() || null;

		const inserted = await sql`
			INSERT INTO brews (
				beans,
				method_id,
				coffee_grams,
				water_grams,
				rating,
				tasting_notes
			)
			VALUES (
				${String(req.body.beans).trim()},
				${methodId},
				${Number(req.body.coffeeGrams)},
				${Number(req.body.waterGrams)},
				${Number(req.body.rating)},
				${tastingNotes}
			)
			RETURNING id
		`;

		const rows = await sql`
			SELECT
				b.id,
				b.beans,
				m.name AS method,
				b.coffee_grams,
				b.water_grams,
				b.rating,
				b.tasting_notes,
				b.created_at
			FROM brews b
			INNER JOIN brew_methods m ON m.id = b.method_id
			WHERE b.id = ${inserted[0].id}
		`;

		res.status(201).json(toBrewDto(rows[0]));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.put("/api/brews/:id", async (req, res) => {
	try {
		const errors = validateBrewPayload(req.body);
		if (errors.length > 0) {
			return res.status(400).json({ errors });
		}

		const methodId = await getMethodIdByName(req.body.method);
		const tastingNotes = req.body.tastingNotes?.trim() || null;

		const updated = await sql`
			UPDATE brews
			SET
				beans = ${String(req.body.beans).trim()},
				method_id = ${methodId},
				coffee_grams = ${Number(req.body.coffeeGrams)},
				water_grams = ${Number(req.body.waterGrams)},
				rating = ${Number(req.body.rating)},
				tasting_notes = ${tastingNotes}
			WHERE id = ${req.params.id}
			RETURNING id
		`;

		if (!updated[0]) {
			return res.status(404).json({ error: "Brew not found." });
		}

		const rows = await sql`
			SELECT
				b.id,
				b.beans,
				m.name AS method,
				b.coffee_grams,
				b.water_grams,
				b.rating,
				b.tasting_notes,
				b.created_at
			FROM brews b
			INNER JOIN brew_methods m ON m.id = b.method_id
			WHERE b.id = ${req.params.id}
		`;

		res.json(toBrewDto(rows[0]));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.delete("/api/brews/:id", async (req, res) => {
	try {
		const deleted = await sql`
			DELETE FROM brews WHERE id = ${req.params.id} RETURNING id
		`;

		if (!deleted[0]) {
			return res.status(404).json({ success: false, error: "Brew not found." });
		}

		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post("/api/brews/reset", async (_req, res) => {
	try {
		await sql`DELETE FROM brews`;
		res.json([]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = { app };
