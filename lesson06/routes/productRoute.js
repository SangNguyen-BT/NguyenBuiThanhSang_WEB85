import express from "express"
import { createProduct, getProduct } from "../controller/productController.js"

const Router = express.Router()

Router.route("/").post(createProduct).get(getProduct)

export default Router