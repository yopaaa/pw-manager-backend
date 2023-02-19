import ResponseApi from "../../../js/api-response.js"
import pw from "../../db/pw-db.js"
import { nanoid } from "nanoid"

export default async function (req, res) {
  try {
    const { name, email, site, pwd, notes, tag, category } = req.body

    const newPw = {
      _id: nanoid(),
      data: { name, email, site, pwd, notes, category },
      tag: [name, email, site],
      tag2: tag && tag.includes("#") ? tag.split("#").filter((x) => x !== "") : undefined,
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
}
