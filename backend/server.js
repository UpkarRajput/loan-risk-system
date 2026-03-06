// require('dotenv').config();
// const express = require('express');
// const db = require('./db');
// const path = require('path');

// const app = express();
// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));

// /* ===============================
//    PROFESSIONAL RISK ENGINE
// ================================= */
// function calculateRisk(data) {
//     let score = 0;

//     // Age Rule
//     if (data.age >= 21 && data.age <= 60) {
//         score += 10;
//     }

//     // Credit Score Rule
//     if (data.credit_score >= 750) {
//         score += 30;
//     } else if (data.credit_score >= 650) {
//         score += 20;
//     } else {
//         score += 5;
//     }

//     // Employment Type
//     if (data.employment_type === "Salaried") {
//         score += 20;
//     } else if (data.employment_type === "Business") {
//         score += 15;
//     } else {
//         score += 10;
//     }

//     // Existing Loans
//     if (data.existing_loans === 0) {
//         score += 15;
//     } else if (data.existing_loans <= 2) {
//         score += 10;
//     }

//     // Income vs Loan Ratio
//     const yearlyIncome = data.monthly_income * 12;
//     const ratio = data.loan_amount / yearlyIncome;

//     if (ratio < 0.5) {
//         score += 25;
//     } else if (ratio < 1) {
//         score += 15;
//     } else {
//         score += 5;
//     }

//     let status = "REJECTED";
//     if (score >= 70) status = "APPROVED";
//     else if (score >= 50) status = "REVIEW";

//     return { score, status };
// }

// /* ===============================
//    APPLY LOAN
// ================================= */
// app.post('/apply-loan', async (req, res) => {
//     try {
//         const data = req.body;

//         const { score, status } = calculateRisk(data);

//         const [result] = await db.query(
//             `INSERT INTO loan_applications 
//             (full_name, age, employment_type, monthly_income, credit_score,
//              existing_loans, loan_amount, tenure_months, status, risk_score)
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 data.full_name,
//                 data.age,
//                 data.employment_type,
//                 data.monthly_income,
//                 data.credit_score,
//                 data.existing_loans,
//                 data.loan_amount,
//                 data.tenure_months,
//                 status,
//                 score
//             ]
//         );

//         res.status(201).json({
//             message: "Loan Evaluation Complete",
//             application_id: result.insertId,
//             status,
//             risk_score: score
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// /* ===============================
//    ROOT ROUTE
// ================================= */
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// /* ===============================
//    START SERVER
// ================================= */
// app.listen(process.env.PORT || 3000, () => {
//     console.log("🚀 Professional Loan Risk API Running");
// });
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
      loan_amount == null || tenure_months == null
    ) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // 1️⃣ Insert Customer
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

    // 2️⃣ Insert Loan (Trigger will calculate risk automatically)
    const [loanResult] = await db.query(
      `INSERT INTO loans 
       (customer_id, loan_amount, tenure_months)
       VALUES (?, ?, ?)`,
      [customer_id, loan_amount, tenure_months]
    );

    const loan_id = loanResult.insertId;

    // 3️⃣ Fetch Decision
    const [loanData] = await db.query(
      `SELECT status, risk_score 
       FROM loans 
       WHERE loan_id = ?`,
      [loan_id]
    );

    res.status(201).json({
      message: "Loan Application Submitted",
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