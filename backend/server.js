require('dotenv').config();

const express = require('express');
const db = require('./db');
const path = require('path');

const app = express();   // ✅ VERY IMPORTANT

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ===============================
   ROOT ROUTE
================================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===============================
   APPLY LOAN (PROFESSIONAL)
================================= */
app.post('/apply-loan', async (req, res) => {
  try {

    const {
      full_name,
      age,
      monthly_income,
      employment_type,
      credit_score,
      existing_loans,
      loan_amount,
      tenure_months
    } = req.body;

    if (
      !full_name || !age || !monthly_income ||
      !employment_type || !credit_score ||
      !loan_amount || !tenure_months
    ) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // Insert Customer
    const [customerResult] = await db.query(
      `INSERT INTO customers 
       (full_name, email, phone, age, employment_status, 
        monthly_income, annual_income, credit_score, existing_loans)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        `${full_name.replace(/\s+/g, '').toLowerCase()}@demo.com`,
        "9999999999",
        age,
        employment_type,
        monthly_income,
        monthly_income * 12,
        credit_score,
        existing_loans || 0
      ]
    );

    const customer_id = customerResult.insertId;

    // Insert Loan
    const [loanResult] = await db.query(
      `INSERT INTO loans 
       (customer_id, loan_amount, tenure_months)
       VALUES (?, ?, ?)`,
      [customer_id, loan_amount, tenure_months]
    );

    const loan_id = loanResult.insertId;

    // Fetch Status
    const [loanData] = await db.query(
      `SELECT status, risk_score 
       FROM loans 
       WHERE loan_id = ?`,
      [loan_id]
    );

    res.status(201).json({
      status: loanData[0].status,
      risk_score: loanData[0].risk_score
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

/* ===============================
   START SERVER
================================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});