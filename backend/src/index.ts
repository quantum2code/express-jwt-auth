import "dotenv/config";
import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import { router } from "./api/v1/routes/routes";

const app = e();

app.use(e.json());
app.use(e.urlencoded());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

//default / endpoint
app.get("/", async (req, res) => {
  res.json({ message: "we good!!" });
});

//api boilerplate route
app.use("/api/v1/", router);

//use custom errormiddleware
app.use(errorHandler);

app.listen(process.env.PORT, () => console.log("server is running"));
