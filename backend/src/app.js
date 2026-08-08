require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { healthRouter } = require("./routes/healthRoutes");
const { brewRouter } = require("./routes/brewRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", brewRouter);
app.use(errorHandler);

module.exports = { app };
