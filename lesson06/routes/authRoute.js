import express from "express"
import { login } from "../controller/authenController.js"

const Router = express.Router()

Router.route("/").post(login)

export default Router