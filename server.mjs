import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "public")));

app.post("/api/users/request", async (req, res) => {
  console.log("Date primite: ", req.body);

  const {email, telefon, nume, prenume, localitate, data_eveniment, tip_eveniment, mesaje} = req.body;

  if (!email || !telefon || !nume || !prenume || !localitate || !data_eveniment || !tip_eveniment) {
    return res.status(400).json({error: "Toate câmpurile obligatorii trebuie completate"});
  }
  
  try {

    const result = await pool.query("INSERT INTO Users (email, telefon, nume, prenume, localitate, data_eveniment, tip_eveniment, mesaje) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [email, telefon, nume, prenume, localitate, data_eveniment, tip_eveniment, mesaje]);

    console.log("Succes: ", result.rows[0]);
    res.status(201).json({success: true, data: result.rows[0]});
  } catch (err) {
    console.error("Eroare: ", err);
    res.status(500).json({error: "Eroare la inserare", details: err.message} );
  }
});

app.listen(PORT, () => {
  console.log(`Server pornit pe http://localhost:${PORT}`);
});
