import "dotenv/config.js"
import express from "express"
import { postgresHelper } from "./src/db/postgres/helper.js"

const app = express()

app.use(express.json())

app.get("/", async (request, response) => {
  const results = await postgresHelper.query("SELECT * FROM users;")
  response.send(JSON.stringify(results))
})

app.post("/api/users", async (request, response) => {
  console.log("request.body =>", request.body)
  response.status(201).send("User created")
})

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`),
)
