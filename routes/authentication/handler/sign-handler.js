import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import "dotenv/config"
import ResponseApi from "../../../js/api-response.js"
import { sendVerifyEmail, verifyCode } from "../controller/verify-email.js"
import { nanoid } from "nanoid"
import NodeDeviceDecector from "node-device-detector"

import user from '../../db/user-db.js'

const jwtSecretKey = process.env.JWT_SECRET_TOKEN
const jwtSignToken = process.env.JWT_SIGN_TOKEN
const maxAge = Number(process.env.JWT_EXPIRE_AGE) * 60 * 1000
const expiresIn = Date.now() + maxAge / 1000
const DeviceDetector = new NodeDeviceDecector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false
})

const SignHandler = {
  signin: async (req, res) => {
    try {
      const { email, pwd } = req.body
      const device = DeviceDetector.detect(req.get("user-agent"))
      if (!email) throw new Error("please insert correct emails")
      if (!pwd) throw new Error("please insert correct password")

      if (email && pwd) {
        const searchUser = await user.Db.findOne({ email })

        if (searchUser) {
          const comparePwd = await bcrypt.compare(pwd, searchUser.pwd)

          if (comparePwd) {
            const payload = {
              _id: searchUser._id
            }
            const accessToken = jwt.sign(payload, jwtSecretKey, { expiresIn })
            await user.Db.updateOne({ _id: payload._id }, { device })

            res.cookie("accessToken", accessToken, { httpOnly: true, maxAge })
            ResponseApi(req, res, 202)
          } else {
            throw new Error("passwword incorrect")
          }
        } else {
          throw new Error("email incorrect")
        }
      }
    } catch (error) {
      ResponseApi(req, res, 400, {}, [error.message])
    }
  },

  signup: async (req, res) => {
    try {
      const { name, email, pwd } = req.body

      if (!name) throw new Error("please insert correct name")
      if (!email) throw new Error("please insert correct emails")
      if (!pwd) throw new Error("please insert correct password")

      if (name && email && pwd) {
        const existName = await user.Db.findOne({ name })
        const existEmail = await user.Db.findOne({ email })

        if (existName) throw new Error(`${name} already exists`)
        if (existEmail) throw new Error(`${email} already exists`)

        if (!existName && !existEmail) {
          const { _id, expiresIn } = await sendVerifyEmail({ name, email, pwd })
          const accessToken = jwt.sign({ _id }, jwtSignToken, {
            expiresIn: `${expiresIn}s`
          })

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: expiresIn * 1000
          })
          ResponseApi(req, res, 201, {
            expiresIn: `${expiresIn}s`
          }) // RESPONSE ALL OK
        }
      }
    } catch (error) {
      const msg = [error.message]
      ResponseApi(req, res, 400, {}, msg) // RESPONSE
    }
  },

  signout: async (req, res) => {
    const accessToken = req.cookies.accessToken
    if (accessToken) {
      jwt.verify(accessToken, jwtSecretKey, async (err, decode) => {
        if (err) ResponseApi(req, res, 204)
        await user.Db.updateOne(
          {
            _id: decode._id
          },
          {
            device: {}
          }
        )
        res.clearCookie("accessToken")
        res.clearCookie("session")
        ResponseApi(req, res, 200)
      })
    } else {
      ResponseApi(req, res, 204)
    }
  },

  verify: async (req, res) => {
    const accessToken = req.cookies.accessToken
    const { code } = req.body

    if (!accessToken) {
      ResponseApi(req, res, 403, {}, ["token not found"])
    } else {
      if (!code) throw new Error("code is undefined")

      jwt.verify(accessToken, jwtSignToken, async (err, decode) => {
        try {
          if (err) throw new Error(err.message)
          const { _id } = decode
          const isVerify = await verifyCode(_id, Number(code))

          if (isVerify.status) {
            const salt = await bcrypt.genSalt(10)
            const hashPw = await bcrypt.hash(isVerify.data.pwd, salt)
            await user.insertOne({
              _id: nanoid(),
              name: isVerify.data.name,
              email: isVerify.data.email,
              pwd: hashPw,
              device: {}
            })

            ResponseApi(req, res, 200) // RESPONSE ALL OK
          } else {
            throw new Error(isVerify.err)
          }
        } catch (error) {
          ResponseApi(req, res, 401, {}, error.message)
        }
      })
    }
  }
}

export default SignHandler
