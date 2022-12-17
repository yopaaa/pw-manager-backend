import figlet from "figlet"
import chalk from "chalk"
import moment from 'moment'

const LogASCIIText = (text) => {
  const config = {
    font: "Big Money-ne",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true
  }

  console.clear()
  console.log()
  console.log()
  figlet.text(text, config, (err, data) => {
    if (err) console.log(err)
    console.log(chalk.green(data))
    console.log(chalk.yellow('Running on : ' + moment().format('llll')))
    console.log(`server is running on http://0.0.0.0:${process.env.MAIN_PORT}`)
  })
}

export default LogASCIIText
