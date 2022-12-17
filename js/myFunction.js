// import moment from "moment"
import fs from "fs"
// import readFileData from "./readFileData.js"

const myFunction = {
  delFile: function (path) {
    fs.unlink(path, (err) => {
      if (err) console.log(err)
    })
  }
}

export { myFunction }
