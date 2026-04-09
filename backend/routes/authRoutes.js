import express from "express"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  let existingUser = await User.findOne({ email })
  if (existingUser) return res.status(400).json({ msg: "User already exists" })

  const hashed = await bcrypt.hash(password, 10)

  const user = new User({ name, email, password: hashed })
  await user.save()

  res.json({ msg: "User Registered" })
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body

  let user = await User.findOne({ email })

  if (!user) {
    const hashed = await bcrypt.hash(password, 10)
    user = new User({ email, password: hashed })
    await user.save()
  } else {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" })
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1d" }
  )

  res.json({ token })
})

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ msg: "Welcome to dashboard", user: req.user })
})

export default router