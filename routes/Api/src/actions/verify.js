import { sendVerifyEmail } from "../../../Sign/src/verify-email.js"
import user from "../../../../db/user-db.js"
import ResponseApi from "../../../../js/api-response.js"

export default async function (req, res) {
  try {
    const searchUser = await user.Db.findOne({ _id: req.body.authentication._id })
    if (searchUser) {
      const verifyemail = await sendVerifyEmail({
        email: searchUser.email
      })
      ResponseApi(req, res, 200, verifyemail)
    } else {
      throw new Error("user incorrect")
    }
  } catch (error) {
    ResponseApi(req, res, 400, {}, error.message)
  }
}
