const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
require('dotenv').config();
const express = require('express');
const db = require('./db');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ===============================
   ROOT ROUTE (Fixes Cannot GET /)
================================= */
app.get("/", (req, res) => {
  res.send("🚀 Upkar Loan Risk API is Live");
});

/* ===============================
   APPLY LOAN
================================= */
app.post('/apply-loan', async (req, res) => {
  try {
    const { customer_id, loan_amount, tenure_months } = req.body;

    if (!customer_id || !loan_amount || !tenure_months) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    const [result] = await db.query(
      'INSERT INTO loans (customer_id, loan_amount, tenure_months) VALUES (?, ?, ?)',
      [customer_id, loan_amount, tenure_months]
    );

    // Fetch loan status after trigger executed
    const [loanData] = await db.query(
      'SELECT status, risk_score FROM loans WHERE loan_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Loan Application Submitted',
      loan_id: result.insertId,
      status: loanData[0].status,
      risk_score: loanData[0].risk_score
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* ===============================
   GET LOAN BY ID
================================= */
app.get('/loan/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM loans WHERE loan_id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Loan not found"
      });
    }

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/* ===============================
   START SERVER
================================= */
app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server running...");
});