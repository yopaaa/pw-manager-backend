import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import "dotenv/config"

import authentication from "./middleware/authentication.js"
import pw_v1 from "./routes/Api/pw_v1.js"
import sign from "./routes/Sign/sign.js"
import LogASCIIText from "./js/ASCIIArt.js"
import ResponseApi from "./js/api-response.js"

const app = express()
const { MAIN_PORT, WHITE_LIST_CORS = null, NODE_ENV } = process.env
// const origin = function (origin, callback) {
//   if (NODE_ENV === "production") {
//     callback(null, true)
//     return
//   }

//   if (WHITE_LIST_CORS.includes(origin)) {
//     callback(null, true)
//   } else {
//     callback(new Error(`${origin} Not allowed by CORS`), false)
//   }
// }
const origin = '*'

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({ origin, credentials: true }))
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
  ResponseApi(req, res, 403, null, [message])
})

// 404
app.use("/", (req, res) => {
  ResponseApi(req, res, 404)
})

app.listen(MAIN_PORT, "0.0.0.0", () => {
  LogASCIIText("RILL CUY")
})
