import "dotenv/config";
import express from "express";
import Database from "./utils/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import passwordRouter from "./routes/passwordRoutes.js";

const app = express();
const PORT = process.env.PORT ?? 8080;

app.disable("x-powered-by");
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/passwords", passwordRouter);

Database.connect().then(() => {
  app.listen(PORT, () =>
    console.log(`INFO: API running on http://localhost:${PORT}`)
  );
});
