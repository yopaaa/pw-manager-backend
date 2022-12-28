import figlet from "figlet"
import chalk from "chalk"
import moment from "moment"
import { internalIpV4 } from "internal-ip"

const localIp = await internalIpV4()
const port = process.env.MAIN_PORT
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
    console.log(`    Running on :  ${moment().format("llll")}
    You can now connect in on end point.

    Local           : http://localhost:${port}
    On Your Network : http://${localIp}:${port}
    `)
  })
}

export default LogASCIIText
