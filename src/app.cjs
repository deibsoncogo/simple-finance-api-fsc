import fs from "node:fs"
import path from "node:path"
import swagger from "swagger-ui-express"
import { transactionsRouter, usersRouter } from "./routes/index.js"

const express = require("express")

const app = express()

app.use(express.json())

app.use("/api/users", usersRouter)
app.use("/api/transactions", transactionsRouter)

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../docs/swagger.json"), "utf8"),
)

app.use("/docs", swagger.serve, swagger.setup(swaggerDocument))

module.exports = { app }
