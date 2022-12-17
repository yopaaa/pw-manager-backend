import status from './statusCode.js'

function ResponseApi(req, res, code = 200, data = {}, error = []) {
  const result = {
    code,
    message: status[code],
    payload: data,
    error,
    ip: req.ip
  }

  res.type("application/json").status(result.code).send(result)
}

export default ResponseApi
