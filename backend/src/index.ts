import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import myUserRoute from "./routes/MyUserRoute";
import authRoute from "./routes/AuthRoute";
import connectionRoute from "./routes/ConnectionRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTIONS_STRING as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Server is running at PORT_NO: 3000: http://localhost:3000/`);
    });
  })
  .catch((err) => console.log("MongoDB error: ", err));

const app = express();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// route
app.get("/health", (req: Request, res: Response) => {
  res.send({ message: "Health Ok" });
});

app.use("/api/auth", authRoute);
app.use("/api/my/user", myUserRoute);
app.use("/api/connection/request", connectionRoute);
