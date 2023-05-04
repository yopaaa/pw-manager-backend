import express from "express"
import "dotenv/config"
import ResponseApi from "../../js/api-response.js"

import FindAll from "./src/FindAll.js"
import Search from "./src/Search.js"
import FindById from "./src/FindById.js"
import InsertOne from "./src/InsertOne.js"
import UpdateOne from "./src/UpdateOne.js"
import Delete from "./src/Delete.js"
import backup from './src/actions/backup.js'
import verify from './src/actions/verify.js'

const Api = express.Router()

// GET
Api.get("/", FindAll)
Api.get("/search", Search)
Api.get("/:_id", FindById)

// BACKUP
Api.post("/actions/backup", backup)
Api.post("/actions/verify", verify)

// CREATE
Api.post("/", InsertOne)

// UPDATE
Api.patch("/:_id", UpdateOne)

// DELETE
Api.delete("/:_id", Delete)

Api.use((req, res) => {
  ResponseApi(req, res, 400)
})

export default Api
