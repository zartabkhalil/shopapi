import cors from "cors";
import "dotenv/config"; // MUST be first — loads .env before any other module runs
import express from "express";
import helmet from "helmet";
import prisma from "./src/config/db";
const app = express();
const PORT = process.env.PORT || 8086;
app.use(cors());
app.use(helmet());

app.use(express.json());
app.set("trust proxy", 1);

//for testing connection
async function main() {
  await prisma.$connect();
  console.log("PostgreSQL connected");
}

main();
app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}`);
});
