import fs from 'fs'
import moment from 'moment'
import chalk from "chalk"

function log (text, color = 'green') {
  const time = `${moment().format()} = `

  fs.appendFile('./data/log.txt', time + text + '\n', (err) => {
    if (err != null) console.log(err)
  })
  console.log(chalk.green(time) + chalk[color](text))
}

export default log
