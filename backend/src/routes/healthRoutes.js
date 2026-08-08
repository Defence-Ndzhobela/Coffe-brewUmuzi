const express = require("express");
const { asyncHandler } = require("../middleware/asyncHandler");
const { getHealth } = require("../controllers/healthController");

const healthRouter = express.Router();

healthRouter.get("/health", asyncHandler(getHealth));

module.exports = { healthRouter };
