import ResponseApi from "../../../../js/api-response.js"
// import { verifyCode } from "../../../authentication/controller/verify-email.js"
import pw from "../../../db/pw-db.js"

export default async function (req, res) {
  const { code } = req.body
  try {
    if (code) {
      // const result = await verifyCode(_id, Number(code))
      // if (result.status === true) {
      const datas = await pw.Db.find(
        {
          author: {
            _id: req.body.authentication._id
          }
        },
        {
          author: 0,
          tag: 0,
          _id: 0
        }
      )
      ResponseApi(req, res, 200, datas)
      // } else {
      // throw new Error(result.err)
      // }
    } else {
      throw new Error("bad request bro")
    }
  } catch (error) {
    ResponseApi(req, res, 401, {}, error.message)
  }
}
