const {
  applySchema,
  listBrews,
  createBrew,
  updateBrew,
  removeBrew,
  resetBrews,
} = require("../services/brewService");
const { validateBrewPayload } = require("../validators/brewValidator");

const setupDb = async (_req, res) => {
  await applySchema();
  res.json({ ok: true, message: "Database schema applied successfully." });
};

const getBrews = async (_req, res) => {
  const brews = await listBrews();
  res.json(brews);
};

const postBrew = async (req, res) => {
  const errors = validateBrewPayload(req.body);
  if (errors.length > 0) {
    const error = new Error("Validation failed.");
    error.status = 400;
    error.errors = errors;
    throw error;
  }

  const brew = await createBrew(req.body);
  res.status(201).json(brew);
};

const putBrew = async (req, res) => {
  const errors = validateBrewPayload(req.body);
  if (errors.length > 0) {
    const error = new Error("Validation failed.");
    error.status = 400;
    error.errors = errors;
    throw error;
  }

  const brew = await updateBrew(req.params.id, req.body);
  res.json(brew);
};

const deleteBrew = async (req, res) => {
  const result = await removeBrew(req.params.id);
  res.json(result);
};

const postResetBrews = async (_req, res) => {
  const result = await resetBrews();
  res.json(result);
};

module.exports = {
  setupDb,
  getBrews,
  postBrew,
  putBrew,
  deleteBrew,
  postResetBrews,
};
