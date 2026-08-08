const { getHealthNow } = require("../services/brewService");

const getHealth = async (_req, res) => {
  const now = await getHealthNow();
  res.json({ ok: true, now });
};

module.exports = { getHealth };
