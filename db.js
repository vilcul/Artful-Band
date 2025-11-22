import env from "dotenv";
import { Pool } from "pg";

env.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect().then(() => console.log("Connected")).catch(err => console.error("Eroare ", err));

export default pool;