import express from "express"
import { v1Router } from "../Routes/v1Router.js";


export const apiRouter =express.Router();

apiRouter.use("/v1",v1Router)