import cors from "cors";
import "dotenv/config"; // MUST be first — loads .env before any other module runs
import express from "express";
import helmet from "helmet";
import errorHandler from "./src/middlewares/error.middleware";
import authRouter from "./src/routes/auth.routes";
import categoriesRouter from "./src/routes/category.routes";
const app = express();
const PORT = process.env.PORT || 8086;
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(helmet());

app.use(express.json());
app.set("trust proxy", 1);

//user routes
app.use("/api/user", authRouter);
//categories routes
app.use("/api/categories", categoriesRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
