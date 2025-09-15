const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// ----- PostgreSQL connection -----
const pool = new Pool({
  user: "postgres",           // e.g., postgres
  host: "db.gptefzdjmzfvmajznshv.supabase.co",           // e.g., db.jcczduubtsmujzrdhfbn.supabase.co
  database: "postgres",       // e.g., postgres
  password: "Jires2345##F",   // your password
  port: 5432,
  ssl: { rejectUnauthorized: false } // required for Supabase
});
pool.connect()
  .then(() => console.log("Connected to database!"))
  .catch((err) => console.error("Database connection error:", err));

// ----- Routes -----
// Test route
app.get("/", (req, res) => res.send("Backend is working!"));

// Get all students
app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Add a student
app.post("/students", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ error: "Database insert failed" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
