const express = require("express");
const { asyncHandler } = require("../middleware/asyncHandler");
const {
  setupDb,
  getBrews,
  postBrew,
  putBrew,
  deleteBrew,
  postResetBrews,
} = require("../controllers/brewController");

const brewRouter = express.Router();

brewRouter.post("/setup-db", asyncHandler(setupDb));
brewRouter.get("/brews", asyncHandler(getBrews));
brewRouter.post("/brews", asyncHandler(postBrew));
brewRouter.put("/brews/:id", asyncHandler(putBrew));
brewRouter.delete("/brews/:id", asyncHandler(deleteBrew));
brewRouter.post("/brews/reset", asyncHandler(postResetBrews));

module.exports = { brewRouter };
