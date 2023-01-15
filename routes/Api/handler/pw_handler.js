import Database from "../../../js/dbMethod.js"
import ResponseApi from "../../../js/api-response.js"
import { nanoid } from "nanoid"
import log from "../../../js/log.js"

const pw = new Database("passwords", {
  _id: String,
  data: {
    name: String,
    email: String,
    site: { type: String, default: null },
    pwd: String,
    notes: { type: String, default: null },
    category: { type: String, default: null }
  },
  tag: Array,
  tag2: Array,
  author: {
    _id: String
  }
})
pw.DbSchema.index({ author: 1 })
pw.DbSchema.index({ "data.category": 1 })
pw.DbSchema.index({ tag: "text", tag2: "text" })

const handler = {
  // READ ALL
  FindAll: async (req, res) => {
    const page = req.query.page || 0
    const pageSize = 10
    const skip = page * pageSize // 0
    const { category } = req.query

    try {
      if (page < 0) throw new Error("page requests cannot be less than 0")
      const queryDb = {
        author: { _id: req.body.authentication._id }
      }
      if (category) queryDb["data.category"] = category
      const data = await pw.Db.find(queryDb, {
        updatedAt: 1,
        "data.name": 1,
        "data.email": 1,
        "data.site": 1,
        "data.category": 1
      })
        .limit(100)
        .sort({
          updatedAt: -1
        })
      const result = {
        data: data.slice(skip, skip + pageSize),
        page,
        pageSize,
        total: data.length
      }

      ResponseApi(req, res, 200, result)
    } catch (error) {
      ResponseApi(req, res, 400, {}, [error.message])
    }
  },

  // FIND BY ID
  FindById: async (req, res) => {
    const { _id } = req.params
    const data = await pw.Db.findOne(
      {
        author: {
          _id: req.body.authentication._id
        },
        _id
      },
      {
        author: 0,
        tag: 0
      }
    )

    if (data) {
      ResponseApi(req, res, 200, data)
    } else {
      ResponseApi(req, res, 404)
    }
  },

  // SEARCH
  Search: async (req, res) => {
    const page = req.query.page || 0
    const pageSize = 10
    const skip = page * pageSize // 0

    try {
      const { q, category } = req.query
      const queryDb = {
        author: { _id: req.body.authentication._id }
      }
      if (category) queryDb["data.category"] = category
      if (q) queryDb.$text = { $search: q }
      const data = await pw.Db.find(queryDb, {
        updatedAt: 1,
        "data.name": 1,
        "data.email": 1,
        "data.site": 1,
        "data.category": 1
      })
        .limit(100)
        .sort({
          updatedAt: -1
        })
      const result = {
        data: data.slice(skip, skip + pageSize),
        page,
        pageSize,
        total: data.length
      }

      if (data) {
        ResponseApi(req, res, 200, result)
      } else {
        ResponseApi(req, res, 404)
      }
    } catch (error) {
      ResponseApi(req, res, 500, {}, [error.message])
    }
  },

  // CREATE ONE
  InsertOne: async (req, res) => {
    try {
      const { name, email, site, pwd, notes, tag, category } = req.body

      const newPw = {
        _id: nanoid(),
        data: { name, email, site, pwd, notes, category },
        tag: [name, email, site],
        tag2: tag.split("#").filter((x) => x !== ""),
        author: {
          _id: req.body.authentication._id
        }
      }

      if (name && email && pwd) {
        const x = await pw.insertOne(newPw)
        ResponseApi(req, res, 201, { _id: x._id })
      } else {
        throw new Error("please insert correct data")
      }
    } catch (error) {
      ResponseApi(req, res, 400, {}, error.message)
    }
  },

  // DELETE
  Delete: async function (req, res) {
    const { _id } = req.params
    const exists = await pw.Db.findOne(
      {
        author: {
          _id: req.body.authentication._id
        },
        _id
      },
      { "data.email": 1, "data.site": 1, "data.pwd": 1, _id: 0 }
    )

    if (exists) {
      const deleted = await pw.Db.deleteOne({ _id })
      log(JSON.stringify(exists.data), 200, "DELETE")

      ResponseApi(req, res, 202, deleted)
    } else {
      ResponseApi(req, res, 404)
    }
  },

  updateOne: async (req, res) => {
    const { _id } = req.params
    const { name, email, site, pwd, notes, tag, category } = req.body
    const exists = await pw.Db.findOne(
      {
        author: {
          _id: req.body.authentication._id
        },
        _id
      },
      { data: 1, _id: 0 }
    )

    const updated = {
      "data.name": name,
      "data.email": email,
      "data.site": site,
      "data.pwd": pwd,
      "data.notes": notes,
      "data.category": category,
      tag2: tag ? tag.split("#").filter((x) => x !== "") : undefined
    }

    if (exists) {
      const data = await pw.Db.updateOne({ _id }, updated)

      ResponseApi(req, res, 202, data)
    } else {
      ResponseApi(req, res, 404)
    }
  },

  // ERROR RESPONSE
  Error: (req, res) => {
    ResponseApi(req, res, 400)
  }
}

export default handler
