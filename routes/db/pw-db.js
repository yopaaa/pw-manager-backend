import Database from "../../js/dbMethod.js"

const pw = new Database("passwords", {
  _id: String,
  data: {
    name: String,
    email: String,
    site: { type: String, default: null },
    pwd: String,
    notes: { type: String, default: null },
    category: { type: String, default: null }
  },
  tag: Array,
  tag2: Array,
  author: {
    _id: String
  }
})
pw.DbSchema.index({ author: 1 })
pw.DbSchema.index({ "data.category": 1 })
pw.DbSchema.index({ tag: "text", tag2: "text" })

export default pw
