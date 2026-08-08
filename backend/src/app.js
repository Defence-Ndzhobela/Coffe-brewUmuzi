require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { healthRouter } = require("./routes/healthRoutes");
const { brewRouter } = require("./routes/brewRoutes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).json({
		ok: true,
		message: "Brew Log backend is running.",
		docs: {
			health: "/api/health",
			setupDb: "POST /api/setup-db",
			brews: "GET/POST /api/brews",
		},
	});
});

app.use("/api", healthRouter);
app.use("/api", brewRouter);
app.use(errorHandler);

module.exports = { app };
