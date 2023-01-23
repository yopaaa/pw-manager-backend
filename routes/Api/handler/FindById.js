import ResponseApi from "../../../js/api-response.js"
import pw from "../../db/pw-db.js"

export default async function (req, res) {
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
}
