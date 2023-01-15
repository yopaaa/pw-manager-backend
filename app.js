// -----------------------------THIRD PARTY MODULE-----------------------------
import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import "dotenv/config"

// -----------------------------EXPORT IMPORT MODULE-----------------------------
import authentication from "./routes/authentication/authentication.js"
// import Actions from "./routes/Actions/data-actions.js"
import pw_v1 from "./routes/Api/pw_v1.js"
import sign from "./routes/authentication/sign.js"
import LogASCIIText from "./js/ASCIIArt.js"
import ResponseApi from "./js/api-response.js"
import log from "./js/log.js"

// -----------------------------VARIABLE-----------------------------
const app = express()
const { MAIN_PORT, WHITE_LIST_CORS, FRONT_END_PATH } = process.env
const origin = function (origin, callback) {
  if (WHITE_LIST_CORS.includes(origin)) {
    callback(null, true)
  } else {
    callback(new Error("Not allowed by CORS"), false)
  }
}
// const origin = '*'

// -----------------------------MIDDLEWARE-----------------------------
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({ origin, credentials: true }))

// -----------------------------ROUTE-----------------------------
// app.use("/actions", authentication, Actions)
app.use("/pw_v1", authentication, pw_v1)
app.use("/sign", sign)

app.all("/", async (req, res) => {
  ResponseApi(req, res, 200)
})

app.all("/ping", authentication, async (req, res) => {
  res.send("pong")
})

// The default error handler
app.use((err, req, res, next) => {
  const { message } = err
  log(`${req.ip} access ${req.originalUrl} ${message}`, 503, req.method)
  res.redirect(FRONT_END_PATH)
})
// 404
app.use("/", (req, res) => {
  ResponseApi(req, res, 404)
})

// -----------------------------START SERVER-----------------------------
app.listen(MAIN_PORT, "0.0.0.0", () => {
  LogASCIIText("RILL CUY")
})
