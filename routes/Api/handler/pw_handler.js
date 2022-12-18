import Database from "../../../js/dbMethod.js"
import ResponseApi from "../../../js/api-response.js"
import { nanoid } from "nanoid"
import log from "../../../js/log.js"

const pw = new Database("passwords", {
  _id: String,
  data: {
    name: String,
    email: String,
    site: String,
    pwd: String,
    notes: String
  },
  tag: Array,
  tag2: Array,
  author: {
    name: String,
    email: String
  },
  createAt: Number,
  updateAt: Number
})
pw.DbSchema.index({ author: 1 })
pw.DbSchema.index({ tag: "text", tag2: "text" })

const handler = {
  // READ ALL
  FindAll: async (req, res) => {
    try {
      const dataa = await pw.Db.find(
        {
          author: {
            name: req.body.authentication.name,
            email: req.body.authentication.email
          }
        },
        {
          createAt: 1,
          "data.name": 1,
          "data.email": 1,
          "data.site": 1
        }
      )
      ResponseApi(req, res, 200, dataa)
    } catch (error) {
      ResponseApi(req, res, 500, {}, [error.message])
    }
  },

  // FIND BY ID
  FindById: async (req, res) => {
    const { _id } = req.params
    const data = await pw.Db.findOne(
      {
        author: {
          name: req.body.authentication.name,
          email: req.body.authentication.email
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

  Search: async (req, res) => {
    try {
      const { q } = req.query
      const data = await pw.Db.findOne(
        {
          author: {
            name: req.body.authentication.name,
            email: req.body.authentication.email
          },
          $text: { $search: q }
        },
        {
          createAt: 1,
          "data.name": 1,
          "data.email": 1,
          "data.site": 1
        }
      )

      if (data) {
        ResponseApi(req, res, 200, data)
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
      const { name, email, site, pwd, notes, tag } = req.body

      const newPw = {
        _id: nanoid(),
        data: {
          name,
          email,
          site: site || null,
          pwd,
          notes: notes || null
        },
        tag: [name, email, site],
        tag2: tag.split("#").filter((x) => x !== ""),
        author: {
          name: req.body.authentication.name,
          email: req.body.authentication.email
        },
        createAt: Date.now(),
        updateAt: Date.now()
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
    const exists = await pw.Db.findById(
      {
        author: {
          name: req.body.authentication.name,
          email: req.body.authentication.email
        },
        _id
      },
      { data: 1, _id: 0 }
    )

    if (exists) {
      const deleted = await pw.Db.deleteOne({ _id })
      log(JSON.stringify(exists.data), "red")

      ResponseApi(req, res, 202, deleted)
    } else {
      ResponseApi(req, res, 404)
    }
  },

  updateOne: async (req, res) => {
    const { _id } = req.params
    const { name, email, site, pwd, notes, tag } = req.body
    const exists = await pw.Db.findOne(
      {
        author: {
          name: req.body.authentication.name,
          email: req.body.authentication.email
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
      tag2: tag ? tag.split("#").filter((x) => x !== "") : undefined,
      updateAt: Date.now()
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
