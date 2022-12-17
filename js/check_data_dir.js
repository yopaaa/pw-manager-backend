import fs from "fs"

// check if directory exists
if (!fs.existsSync("./data")) {
  fs.mkdir("./data", () => 0)
}
if (!fs.existsSync("./data/log.txt")) {
  fs.writeFile("./data/log.txt", "", (err) => {
    if (err) throw err
  })
}

export default 0
