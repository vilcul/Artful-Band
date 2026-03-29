import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "public"), {
  index: false,
  etag: true,
  maxAge: "1y",
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache");
      return;
    }
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
}));

app.get("/", (req, res) => {
  res.redirect(302, "/acasa");
});

app.get("/acasa", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/echipa", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "echipa.html"));
});

app.get("/oferta", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "oferte.html"));
});

// Redirect legacy .html routes to clean URLs
app.get("/index.html", (req, res) => res.redirect(301, "/acasa"));
app.get("/echipa.html", (req, res) => res.redirect(301, "/echipa"));
app.get("/oferte.html", (req, res) => res.redirect(301, "/oferta"));
app.get("/oferte", (req, res) => res.redirect(301, "/oferta"));

app.post("/api/users/request", async (req, res) => {
  console.log("Date primite: ", req.body);

  const {email, telefon, nume, prenume, localitate, data_eveniment, tip_eveniment, mesaje} = req.body;

  if (!email || !telefon || !nume || !prenume || !localitate || !data_eveniment || !tip_eveniment) {
    return res.status(400).json({error: "Toate câmpurile obligatorii trebuie completate"});
  }
  
  try {

    const result = await pool.query("INSERT INTO Users (email, telefon, nume, prenume, localitate, data_eveniment, tip_eveniment, mesaje) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *", [email, telefon, nume, prenume, localitate, data_eveniment, tip_eveniment, mesaje]);

    console.log("Succes: ", result.rows[0]);

    // Trimite email notificare prin Resend
    const tipEvenimentLabel = {
      nunta: "Nuntă",
      botez: "Botez",
      corporate: "Eveniment Corporate",
      petrecere: "Petrecere Privată",
      altele: "Altele"
    };

    try {
      await resend.emails.send({
        from: "Artful Band <onboarding@resend.dev>",
        to: "artful.band2025@gmail.com",
        subject: `Cerere nouă de la ${nume} ${prenume} - ${tipEvenimentLabel[tip_eveniment] || tip_eveniment}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #ffffff; border-radius: 12px; overflow: hidden;">
            <div style="background: #000000; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; color: #ffffff;">Cerere Nouă de Ofertă</h1>
            </div>
            <div style="padding: 30px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #888; width: 40%;">Nume</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #fff;">${nume} ${prenume}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #888;">Email</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333;"><a href="mailto:${email}" style="color: #4da6ff; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #888;">Telefon</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333;"><a href="tel:${telefon}" style="color: #4da6ff; text-decoration: none;">${telefon}</a></td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #888;">Localitate</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #fff;">${localitate}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #888;">Data Eveniment</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #fff;">${data_eveniment}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #888;">Tip Eveniment</td>
                  <td style="padding: 12px 15px; border-bottom: 1px solid #333; color: #fff;">${tipEvenimentLabel[tip_eveniment] || tip_eveniment}</td>
                </tr>
                ${mesaje ? `
                <tr>
                  <td style="padding: 12px 15px; color: #888; vertical-align: top;">Mesaj</td>
                  <td style="padding: 12px 15px; color: #fff;">${mesaje}</td>
                </tr>
                ` : ''}
              </table>
            </div>
          </div>
        `
      });
      console.log("Email trimis cu succes");
    } catch (emailErr) {
      console.error("Eroare la trimiterea emailului:", emailErr);
    }

    res.status(201).json({success: true, data: result.rows[0]});
  } catch (err) {
    console.error("Eroare: ", err);
    res.status(500).json({error: "Eroare la inserare", details: err.message} );
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server pornit pe portul ${PORT}`);
});
