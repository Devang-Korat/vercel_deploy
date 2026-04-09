const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/authDB")
    console.log("DB Connected")
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

module.exports = connectDB