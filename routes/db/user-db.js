import Database from "../../js/dbMethod.js"

const user = new Database("account", {
  _id: String,
  name: {
    type: String,
    maxLength: 100,
    index: true,
    unique: true
  },
  email: {
    type: String,
    maxLength: 100,
    index: true,
    unique: true
  },
  pwd: String,
  device: {}
})

export default user
