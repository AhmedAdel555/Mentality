import { Pool } from 'pg'
import config from "./envConfig";

const pool = new Pool({
  host: config.PGHOST,
  database: config.PGDATABASE,
  port: parseInt(config.PGPORT as string, 10), 
  user: config.PGUSER,
  password: config.PGPASSWORD,
  max: 20,
})

export default pool;