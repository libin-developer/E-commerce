import express from "express";
import { connect } from "./Config/dbconfig.js";
import serverconfig from "./Config/serverconfig.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import { apiRouter } from "./Routes/apiRouter.js";



const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors(
  {
    origin:"http://localhost:5173", //frontend prot
    credentials:true,
  }
))

connect();
app.get("/", (req, res) => {
  res.send("Hello this e commerce site interface!");
});
app.use("/api",apiRouter)

app.listen(serverconfig.port, () => {
  console.log(`Example app listening on port ${serverconfig.port}`);
});