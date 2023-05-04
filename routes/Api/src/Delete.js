import ResponseApi from "../../../js/api-response.js"
import pw from "../../../db/pw-db.js"
import log from "../../../js/log.js"

export default async function (req, res) {
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
}
