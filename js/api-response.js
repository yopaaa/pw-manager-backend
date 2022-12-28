import log from './log.js'
import status from './statusCode.js'

function ResponseApi(req, res, code = 200, data = {}, error = []) {
  const userName = req.body.authentication ? req.body.authentication.name : undefined
  const { originalUrl, ip } = req

  const result = {
    code,
    message: status[code],
    payload: data,
    error,
    ip: req.ip
  }

  log(`user ${userName || ip} access "${originalUrl}", ${error || ''}`, code, req.method)
  res.type("application/json").status(code).send(result)
}

export default ResponseApi
