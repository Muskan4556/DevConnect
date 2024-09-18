import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// route
app.get("/test", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(4000, () => {
  console.log(`Server is running at PORT_NO: 4000: http://localhost:4000/`);
});
