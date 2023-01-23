import ResponseApi from "../../../js/api-response.js"
import pw from "../../db/pw-db.js"

export default async function (req, res) {
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
}
