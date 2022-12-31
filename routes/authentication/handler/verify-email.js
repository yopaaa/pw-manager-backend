import { nanoid } from "nanoid"
import DB from "../../../js/dbMethod.js"
import nodemailer from "nodemailer"
import "dotenv/config"
import log from "../../../js/log.js"
import emailTemplate from './emailTemplate.js'

const mailTransporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  },
  {
    from: "password manager"
  }
)

const Database = new DB("verify_code", {
  _id: String,
  code: Number,
  data: {
    name: String,
    email: String,
    pwd: String
  }
})
const expireAfterSeconds = 300
Database.DbSchema.index({ createdAt: 1 }, { expireAfterSeconds })
Database.DbSchema.index({ code: 1 }, { unique: true })

const mailMessage = (to, code) => {
  return {
    from: "password manager",
    to,
    subject: "welcome to password manager",
    html: emailTemplate(code)
  }
}

async function sendVerifyEmail(data) {
  const { email } = data
  const _id = nanoid()
  const code = Math.floor(Math.random() * (999999 - 100000) + 100000)

  await Database.insertOne({ _id, code, data })
  mailTransporter.sendMail(mailMessage(email, code), (error, info) => {
    if (error) log(error.message)
  })

  return { _id, expireIn: expireAfterSeconds }
}

async function verifyCode(_id, code) {
  try {
    const data = await Database.Db.findById(_id)
    if (data) {
      if (data.code === code) {
        return { status: true, data: data.data, err: [] }
      } else {
        return { status: false, data: {}, err: "verify code is incorrect" }
      }
    } else {
      return { status: false, data: {}, err: "_id not exist" }
    }
  } catch (error) {
    log(error.message, 500)
  }
}

export { sendVerifyEmail, verifyCode }
