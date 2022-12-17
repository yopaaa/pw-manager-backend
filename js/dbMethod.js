import log from "./log.js"
import mongoose from "mongoose"
import "dotenv/config"

const { MONGODB_USER_NAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DATABASE } = process.env
const mongoPath = `mongodb://${MONGODB_USER_NAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}`

mongoose
  .connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    log("Connected to MongoDB")
  })
  .catch((err) => {
    log(err)
  })
mongoose.set("autoIndex", true)

class Database {
  constructor(collections = "", schema = { _id: String }, index = null) {
    const dbSchema = new mongoose.Schema(schema)
    const database = mongoose.model(collections, dbSchema)
    database.createCollection()
    database.listIndexes((err, result) => {
      if (err)log(err, 'red')
      log(`${collections} list indexes ${result.length}`)
    })

    this.Db = database
    this.DbSchema = dbSchema
    this.Schema = schema
  }

  // CREATE
  async insertOne(object = this.Schema) {
    const insert = new this.Db(object)
    await insert.save()
    return insert
  }

  async insertMany(arr = [{}, {}]) {
    return arr.map(async (value) => {
      const insert = new this.Db(value)
      await insert.save()
      return insert
    })
  }
}

export default Database
