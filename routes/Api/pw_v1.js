import express from "express"
import "dotenv/config"
import handler from "./handler/pw_handler.js"

const Api = express.Router()

// GET
Api.get("/", handler.FindAll)
Api.get("/search", handler.Search)
Api.get("/:_id", handler.FindById)

// CREATE
Api.post("/", handler.InsertOne)

// UPDATE
Api.patch("/:_id", handler.updateOne)

// DELETE
Api.delete("/:_id", handler.Delete)

Api.use(handler.Error)

export default Api
