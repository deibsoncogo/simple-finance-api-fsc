import "dotenv/config.js"
import pg from "pg"

const { Pool } = pg

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  host: process.env.POSTGRES_HOST,
})

export const postgresHelper = {
  query: async (query, params) => {
    const client = await pool.connect()
    const { rows } = await client.query(query, params)

    await client.release()

    return rows
  },
}
