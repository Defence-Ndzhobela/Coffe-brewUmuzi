const { sql } = require("./db");

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

const getMethodIdByName = async (methodName) => {
  const result = await sql`
    SELECT id FROM brew_methods WHERE name = ${methodName}
  `;

  if (!result[0]) {
    const error = new Error(`Brew method not found: ${methodName}`);
    error.status = 400;
    throw error;
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

const getHealthNow = async () => {
  const result = await sql`SELECT NOW() AS now`;
  return result[0].now;
};

const listBrews = async () => {
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

  return rows.map(toBrewDto);
};

const getBrewById = async (id) => {
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
    WHERE b.id = ${id}
  `;

  if (!rows[0]) {
    return null;
  }

  return toBrewDto(rows[0]);
};

const createBrew = async (payload) => {
  const methodId = await getMethodIdByName(payload.method);
  const tastingNotes = payload.tastingNotes?.trim() || null;

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
      ${String(payload.beans).trim()},
      ${methodId},
      ${Number(payload.coffeeGrams)},
      ${Number(payload.waterGrams)},
      ${Number(payload.rating)},
      ${tastingNotes}
    )
    RETURNING id
  `;

  return getBrewById(inserted[0].id);
};

const updateBrew = async (id, payload) => {
  const methodId = await getMethodIdByName(payload.method);
  const tastingNotes = payload.tastingNotes?.trim() || null;

  const updated = await sql`
    UPDATE brews
    SET
      beans = ${String(payload.beans).trim()},
      method_id = ${methodId},
      coffee_grams = ${Number(payload.coffeeGrams)},
      water_grams = ${Number(payload.waterGrams)},
      rating = ${Number(payload.rating)},
      tasting_notes = ${tastingNotes}
    WHERE id = ${id}
    RETURNING id
  `;

  if (!updated[0]) {
    const error = new Error("Brew not found.");
    error.status = 404;
    throw error;
  }

  return getBrewById(id);
};

const removeBrew = async (id) => {
  const deleted = await sql`
    DELETE FROM brews WHERE id = ${id} RETURNING id
  `;

  if (!deleted[0]) {
    const error = new Error("Brew not found.");
    error.status = 404;
    error.success = false;
    throw error;
  }

  return { success: true };
};

const resetBrews = async () => {
  await sql`DELETE FROM brews`;
  return [];
};

module.exports = {
  applySchema,
  getHealthNow,
  listBrews,
  createBrew,
  updateBrew,
  removeBrew,
  resetBrews,
};
