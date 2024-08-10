const fs = require("node:fs")
const path = require("node:path")
const express = require("express")
const swagger = require("swagger-ui-express")
const { usersRouter, transactionsRouter } = require("./routes/index.js")

const app = express()

app.use(express.json())

app.use("/api/users", usersRouter)
app.use("/api/transactions", transactionsRouter)

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../docs/swagger.json"), "utf8"),
)

app.use("/docs", swagger.serve, swagger.setup(swaggerDocument))

module.exports = { app }
