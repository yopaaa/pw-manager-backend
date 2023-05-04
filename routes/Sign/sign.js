import express from "express"
import SignHandler from "./src/sign-handler.js"

const sign = express.Router()

// SIGN IN INTO EXISTS ACCOUNT
sign.post("/in", SignHandler.signin)

// CREATE NEW ACCOUNT
sign.post("/up", SignHandler.signup)

sign.delete("/out", SignHandler.signout)

sign.post("/verify", SignHandler.verify)

export default sign
