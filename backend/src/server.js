// src/server.js
require("dotenv").config();
require("./config/passport");

const express = require("express");
const passport = require("passport");
const connectDB = require("./config/db");

const app = express();

// 1. KONEKSI DB
connectDB();

// 2. CORS GLOBAL (BOLEH DARI MANA SAJA)
app.use((req, res, next) => {
  // izinkan SEMUA origin
  res.setHeader("Access-Control-Allow-Origin", "*");

  // method yang boleh dipakai
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  // header yang boleh dikirim browser
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // kalau ini preflight (OPTIONS), balas di sini
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // penting: header di atas sudah kepasang
  }

  next();
});

// 3. BODY PARSER & LAINNYA
app.set("trust proxy", true);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// 4. ROUTES
app.use("/api/auth",         require("./routes/auth"));
app.use("/api/student",      require("./routes/student"));
app.use("/api/teacher",      require("./routes/teacher"));
app.use("/api/payment",      require("./routes/payment"));
app.use("/api/activities",   require("./routes/activities"));
app.use("/api/attendance",   require("./routes/attendance"));
app.use("/api/message",      require("./routes/messages"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/weather",      require("./routes/weather"));
app.use("/api/feedback",     require("./routes/feedback"));
app.use("/api/admin",        require("./routes/admin"));

app.get("/api/healthz", (req, res) => res.send("OK"));

// 5. ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("ERROR MIDDLEWARE:", err);
  // header CORS tetap ada di error
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// 404
app.use((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(404).json({ message: "Not Found" });
});

// 6. LOCAL DEV
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// 7. EXPORT UNTUK VERCEL
module.exports = app;
