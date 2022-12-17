// MODULE IMPORT
import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import LogASCIIText from "./js/ASCIIArt.js"
import checkFilwDir from "./js/check_data_dir.js"
import ResponseApi from "./js/api-response.js"
import cors from "cors"

// ROUTE IMPORT
import authentication from "./routes/authentication/authentication.js"
// import Actions from "./routes/Actions/data-actions.js"
import pw_v1 from "./routes/Api/pw_v1.js"
import sign from "./routes/authentication/sign.js"

const app = express()
const __dirname = process.env.PWD
const port = process.env.MAIN_PORT

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.use(bodyParser.json())

// app.use("/actions", authentication, Actions)
app.use(
  "/pw_v1",
  cors({
    origin: process.env.CORS,
    optionsSuccessStatus: 200
  }),
  authentication,
  pw_v1
)
app.use("/sign", sign)

app.all("/", async (req, res) => {
  ResponseApi(req, res, 200)
})

// 404
app.use("/", (req, res) => {
  ResponseApi(req, res, 404)
})

app.listen(port, "0.0.0.0", () => {
  LogASCIIText("RILL CUY")
})
