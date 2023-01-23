import ResponseApi from "../../../js/api-response.js"
import pw from "../../db/pw-db.js"

export default async function (req, res) {
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
}
