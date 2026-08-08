const { prisma } = require("./prisma");

const toBrewDto = (row) => ({
  id: row.id,
  beans: row.beans,
  method: row.method.name,
  coffeeGrams: Number(row.coffeeGrams),
  waterGrams: Number(row.waterGrams),
  rating: Number(row.rating),
  tastingNotes: row.tastingNotes ?? undefined,
  createdAt:
    typeof row.createdAt === "string"
      ? row.createdAt
      : new Date(row.createdAt).toISOString(),
});

const getMethodIdByName = async (methodName) => {
  const method = await prisma.brewMethod.findUnique({
    where: { name: methodName },
    select: { id: true },
  });

  if (!method) {
    const error = new Error(`Brew method not found: ${methodName}`);
    error.status = 400;
    throw error;
  }

  return method.id;
};

const applySchema = async () => {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS brew_methods (
      id SMALLSERIAL PRIMARY KEY,
      name VARCHAR(40) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await prisma.$executeRawUnsafe(`
    INSERT INTO brew_methods (name)
    VALUES
      ('Aeropress'),
      ('Drip coffee'),
      ('V60'),
      ('French Press'),
      ('Chemex')
    ON CONFLICT (name) DO NOTHING
  `);

  await prisma.$executeRawUnsafe(`
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
  `);

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql
  `);

  await prisma.$executeRawUnsafe(`
    DROP TRIGGER IF EXISTS tr_brews_updated_at ON brews
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER tr_brews_updated_at
    BEFORE UPDATE ON brews
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at()
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_brews_created_at_desc
    ON brews (created_at DESC)
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_brews_method_created_at
    ON brews (method_id, created_at DESC)
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS idx_brews_beans_lower
    ON brews (LOWER(beans))
  `);
};

const getHealthNow = async () => {
  const result = await prisma.$queryRawUnsafe(`SELECT NOW() AS now`);
  return result[0].now;
};

const listBrews = async () => {
  const rows = await prisma.brew.findMany({
    orderBy: { createdAt: "desc" },
    include: { method: true },
  });

  return rows.map(toBrewDto);
};

const getBrewById = async (id) => {
  const row = await prisma.brew.findUnique({
    where: { id },
    include: { method: true },
  });

  if (!row) {
    return null;
  }

  return toBrewDto(row);
};

const createBrew = async (payload) => {
  const methodId = await getMethodIdByName(payload.method);
  const tastingNotes = payload.tastingNotes?.trim() || null;

  const created = await prisma.brew.create({
    data: {
      beans: String(payload.beans).trim(),
      methodId,
      coffeeGrams: Number(payload.coffeeGrams),
      waterGrams: Number(payload.waterGrams),
      rating: Number(payload.rating),
      tastingNotes,
    },
    select: { id: true },
  });

  return getBrewById(created.id);
};

const updateBrew = async (id, payload) => {
  const methodId = await getMethodIdByName(payload.method);
  const tastingNotes = payload.tastingNotes?.trim() || null;

  const updated = await prisma.brew.updateMany({
    where: { id },
    data: {
      beans: String(payload.beans).trim(),
      methodId,
      coffeeGrams: Number(payload.coffeeGrams),
      waterGrams: Number(payload.waterGrams),
      rating: Number(payload.rating),
      tastingNotes,
    },
  });

  if (updated.count === 0) {
    const error = new Error("Brew not found.");
    error.status = 404;
    throw error;
  }

  return getBrewById(id);
};

const removeBrew = async (id) => {
  const deleted = await prisma.brew.deleteMany({
    where: { id },
  });

  if (deleted.count === 0) {
    const error = new Error("Brew not found.");
    error.status = 404;
    error.success = false;
    throw error;
  }

  return { success: true };
};

const resetBrews = async () => {
  await prisma.brew.deleteMany();
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
