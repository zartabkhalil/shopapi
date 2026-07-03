import cors from "cors";
import "dotenv/config"; // MUST be first — loads .env before any other module runs
import express from "express";
import helmet from "helmet";
import PaymentController from "./src/controllers/payment.controller";
import errorHandler from "./src/middlewares/error.middleware";
import authRouter from "./src/routes/auth.routes";
import cartRouter from "./src/routes/cart.routes";
import categoriesRouter from "./src/routes/category.routes";
import ordersRouter from "./src/routes/order.routes";
import paymentsRouter from "./src/routes/payment.routes";
import productRouter from "./src/routes/product.routes";
const app = express();
const PORT = process.env.PORT || 8086;
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet());

//strpe webhook registration
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    // strip the raw buffer so the controller can read req.body
    const controller = new PaymentController(); // or extract to a dedicated webhook router
    controller.webhook(req, res, next);
  },
);

app.use(express.json());
app.set("trust proxy", 1);

//user routes
app.use("/api/user", authRouter);
//categories routes
app.use("/api/categories", categoriesRouter);
//product routes
app.use("/api/product", productRouter);

//ADD TO CART routes
app.use("/api/cart", cartRouter);

//ORDER routes
app.use("/api/order", ordersRouter);

//PAYMENT routes
app.use("/api/payment", paymentsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
