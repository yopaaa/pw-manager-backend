import express from "express"
import "dotenv/config"
import ResponseApi from "../../js/api-response.js"

import FindAll from "./handler/FindAll.js"
import Search from "./handler/Search.js"
import FindById from "./handler/FindById.js"
import InsertOne from "./handler/InsertOne.js"
import UpdateOne from "./handler/UpdateOne.js"
import Delete from "./handler/Delete.js"
import backup from './handler/actions/backup.js'
import verify from './handler/actions/verify.js'

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
