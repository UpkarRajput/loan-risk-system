require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

// Apply Loan API
app.post('/apply-loan', async (req, res) => {
  try {
    const { customer_id, loan_amount, tenure_months } = req.body;

    const [result] = await db.query(
      'INSERT INTO loans (customer_id, loan_amount, tenure_months) VALUES (?, ?, ?)',
      [customer_id, loan_amount, tenure_months]
    );

    res.status(201).json({
      message: 'Loan Application Submitted',
      loan_id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Loan Status
app.get('/loan/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM loans WHERE loan_id = ?',
      [req.params.id]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});