import "dotenv/config";
import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";

const app = e();

app.use(e.json());
app.use(e.urlencoded());
app.use(cors());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.json({ message: "we good!!" });
});
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log("server is running"));
