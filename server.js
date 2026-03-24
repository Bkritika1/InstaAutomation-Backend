require("dotenv").config()

const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")
const scheduleRoutes = require("./routes/scheduleRoutes")
const accountRoutes = require("./routes/accountRoutes")
const webhookRoutes = require("./routes/webhookRoutes")
const startCron = require("./jobs/cronPublisher")

const app = express()

app.use(cors())
app.use(express.json())

app.use(authRoutes)
app.use(postRoutes)
app.use(scheduleRoutes)
app.use(accountRoutes)
app.use(webhookRoutes)

startCron()

app.listen(5000, () => {
    console.log("Server running on port 5000 🚀")
})