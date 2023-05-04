import ResponseApi from "../js/api-response.js"
import "dotenv/config"
import jwt from "jsonwebtoken"

// const jwtAcessKey = process.env.JWT_ACCESS_SECRET_TOKEN
const jwtSecretKey = process.env.JWT_SECRET_TOKEN

const authentication = (req, res, next) => {
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    ResponseApi(req, res, 401, {}, ['token not found'])
  } else {
    try {
      jwt.verify(accessToken, jwtSecretKey, (err, decode) => {
        if (err) throw new Error(err.message)

        req.body.authentication = {
          _id: decode._id || 'anonymous'
        }
        next()
      })
    } catch (error) {
      ResponseApi(req, res, 401, {}, error.message)
    }
  }
}

export default authentication
