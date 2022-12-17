import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { nanoid } from "nanoid"
import "dotenv/config"
import ResponseApi from "../../js/api-response.js"
import Database from "../../js/dbMethod.js"
import log from "../../js/log.js"

const sign = express.Router()
const user = new Database("account", {
  _id: String,
  name: String,
  email: String,
  pwd: String,
  token: String,
  createAt: Number,
  updateAt: Number
})
user.DbSchema.index({ name: 1 }, { unique: true })
user.DbSchema.index({ email: 1 }, { unique: true })
user.DbSchema.index({ token: 1 }, { unique: true })

const jwtSecretKey = process.env.JWT_SECRET_TOKEN
const maxAge = 60 * 60 * 1000
const expiresIn = "1h"

// SIGN IN INTO EXISTS ACCOUNT
sign.post("/in", async (req, res) => {
  try {
    const { email, pwd } = req.body

    if (!email) throw new Error("please insert correct emails")
    if (!pwd) throw new Error("please insert correct password")

    if (email && pwd) {
      const searchUser = await user.findOne({ email })

      if (searchUser) {
        const comparePwd = await bcrypt.compare(pwd, searchUser.pwd)

        if (comparePwd) {
          const payload = {
            name: searchUser.name,
            email: searchUser.email
          }
          const accessToken = jwt.sign(payload, jwtSecretKey, { expiresIn })
          await user.updateOne(searchUser._id, { token: accessToken })

          res.cookie("accessToken", accessToken, { httpOnly: true, maxAge })
          ResponseApi(req, res, 202, payload) // RESPONSE ALL OK
        } else {
          throw new Error("passwword incorrect")
        }
      } else {
        throw new Error("email incorrect")
      }
    }
  } catch (error) {
    ResponseApi(req, res, 400, {}, [error.message]) // RESPONSE IF BAD REQUEST
  }
})

// CREATE NEW ACCOUNT
sign.post("/up", async (req, res) => {
  try {
    const { name, email, pwd, confirmpwd } = req.body

    if (!name) throw new Error("please insert correct name")
    if (!email) throw new Error("please insert correct emails")
    if (!pwd) throw new Error("please insert correct password")
    if (pwd !== confirmpwd) {
      throw new Error("password or confirm password incorrect")
    }

    if (name && email && pwd && confirmpwd === pwd) {
      const salt = await bcrypt.genSalt(10)
      const hashPw = await bcrypt.hash(pwd, salt)
      const payload = { name, email }

      const accessToken = jwt.sign(payload, jwtSecretKey, { expiresIn })

      await user.insertOne({
        _id: nanoid(),
        name,
        email,
        pwd: hashPw,
        token: accessToken,
        createAt: Date.now(),
        updateAt: Date.now()
      })
      log("new users created", "blue")
      res.cookie("accessToken", accessToken, { httpOnly: true, maxAge })
      ResponseApi(req, res, 201, payload) // RESPONSE ALL OK
    }
  } catch (error) {
    let msg = [error.message]
    if (error.code === 11000) {
      log(error.message, "red")
      msg = `${JSON.stringify(error.keyValue)} already exists`
    }
    ResponseApi(req, res, 400, {}, msg) // RESPONSE
  }
})

sign.delete("/out", async (req, res) => {
  const accessToken = req.cookies.accessToken

  if (accessToken) {
    res.clearCookie("accessToken")
    ResponseApi(req, res, 200) // RESPONSE OK
  } else {
    ResponseApi(req, res, 204)
  }
})

sign.post("/token", async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken

    if (accessToken) {
      const searchUser = await user.findOne({ token: accessToken })

      if (searchUser) {
        jwt.verify(accessToken, jwtSecretKey, async (err, decode) => {
          if (err) throw new Error(err.message)
          const payload = {
            name: searchUser.name,
            email: searchUser.email
          }
          const accessToken = jwt.sign(payload, jwtSecretKey, { expiresIn })
          await user.updateOne(searchUser._id, { token: accessToken })

          res.cookie("accessToken", accessToken, { httpOnly: true, maxAge })
          ResponseApi(req, res, 202, payload) // RESPONSE ALL OK
        })
      } else {
        throw new Error("not found please login")
      }
    } else {
      throw new Error("please re login")
    }
  } catch (error) {
    ResponseApi(req, res, 403, {}, [error.message]) // RESPONSE IF ERROR
  }
})

export default sign
