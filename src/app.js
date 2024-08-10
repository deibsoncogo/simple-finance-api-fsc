import express from "express"
import fs from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import swagger from "swagger-ui-express"
import { transactionsRouter, usersRouter } from "./routes/index.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(express.json())

app.use("/api/users", usersRouter)
app.use("/api/transactions", transactionsRouter)

const swaggerDocument = JSON.parse(
  fs.readFileSync(join(__dirname, "../docs/swagger.json"), "utf8"),
)

app.use("/docs", swagger.serve, swagger.setup(swaggerDocument))

export { app }
