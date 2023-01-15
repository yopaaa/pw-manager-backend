import fs from "fs"
import chalk from "chalk"
import "dotenv/config"
import moment from "moment"

const logFilePath = process.env.LOG_FILE_PATH

function log(text, code = 200, method = "NULL") {
  const time = moment().format()
  let color, bgColor
  if (code >= 400 && code < 500 || method == 'DELETE') {
    color = "yellow"
    bgColor = "bgYellow"
  } else if (code >= 500 && code < 600) {
    color = "red"
    bgColor = "bgRed"
  } else {
    color = "green"
    bgColor = "bgGreen"
  }
  const background = (text) => chalk[bgColor](chalk.black(text))

  const msglog = `${background(code)} | ${time} | ${background(
    method
  )} | ${chalk[color](text)}`
  const msgSave = `${code} | ${time} | ${method} | ${text} \n`

  if (logFilePath) {
    fs.appendFile(
      `${logFilePath}/${moment().format("LL").replaceAll(" ", "-")}.txt`,
      msgSave,
      (err) => {
        if (err != null) console.log(err)
      }
    )
  }

  console.log(msglog)
  return code
}

export default log
