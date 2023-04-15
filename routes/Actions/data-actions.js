import express from "express"
import fileUpload from "express-fileupload"
import chalk from "chalk"
import readFileData from "../../js/readFileData.js"
import { myFunction } from "../../js/myFunction.js"
import fs from "fs"
import "dotenv/config"

const __dirname = process.env.PWD
const Actions = express.Router()

Actions.use(fileUpload())

// RESTORE ROUTE
Actions.post("/restore", function (req, res) {
  if (req.files === undefined || req.files.restore === undefined) {
    res.redirect("/")
    console.log("no file restore")
  } else {
    const File = req.files.restore
    const fileName = `${Date.now()}${File.name}`
    const uploadPath = __dirname + "/data/" + fileName

    // CHECK APAKAH FILE TERSEBUT JSON ATAU BUKAN
    if (File.mimetype !== "application/json") {
      console.log("file type incorrect : " + File.mimetype)
      res.redirect("/file_incorect") // JIKA BUKAN MAKA TIDAK AKAN DI PROSES
    } else {
      //  JIKA FILE YANG DI MASUKAN BENAR MAKA
      File.mv(uploadPath, (err) => {
        if (err) res.status(500).send(err)

        readFileData((data) => {
          try {
            const DataRestore = JSON.parse(fs.readFileSync(`./data/${fileName}`))

            DataRestore.forEach((element) => {
              const checkData = data.find(element.id)

              if (checkData.code) {
                const keys = `${element.user_name} ${element.email} ${element.site} ${element.notes}`
                element.key = keys.toLowerCase()

                data.create(element)
                console.log(chalk.green("RESTORE ONE DATA"))
              }
            })
          } catch (error) {
            console.log("Someting wrong with this file")
            if (fs.existsSync(`./data/${fileName}`)) {
              myFunction.delFile(`./data/${fileName}`)
            }
          } finally {
            if (fs.existsSync(`./data/${fileName}`)) {
              myFunction.delFile(`./data/${fileName}`)
            }
            myFunction.echoFile("./data/password.json", data.read)
          }
        })

        res.redirect("/")
      })
    }
  }
})

// BACKUP ROUTE
Actions.post("/backup", (req, res) => {
  const fileName = req.body.fileName
  console.log(fileName)
  res.download(`./data/password.json`, `${fileName}.json`, (err) => {
    if (err) {
      throw err
      res.redirect("/404")
    }
  })
})

export default Actions
