require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is missing. Add it to backend/.env");
}

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
	try {
		const result = await sql`SELECT version()`;
		const { version } = result[0];

		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end(version);
	} catch (error) {
		res.writeHead(500, { "Content-Type": "text/plain" });
		res.end(`Database connection failed: ${error.message}`);
	}
};

http.createServer(requestHandler).listen(3000, () => {
	console.log("Server running at http://localhost:3000");
});
