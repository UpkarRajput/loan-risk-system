# Automated Loan Approval & Risk Assessment System

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![Database](https://img.shields.io/badge/Database-MySQL_Heavy-orange)

**Live Demo:** https://upkar-loan-risk-api.onrender.com

## 📌 Overview
The **Automated Loan Approval & Risk Assessment System** is a full-stack fintech web application designed to instantly evaluate loan applications. It processes user financial data, calculates a dynamic risk score using a custom rule-based engine, and automates the approval or rejection decision. 

This project demonstrates strong backend architecture, specifically focusing on "MySQL-heavy" logic utilizing Stored Procedures, Triggers, and relational database design.

## 🚀 Key Features
* **Instant Decision Engine:** Calculates risk scores (0-100) instantly based on income, credit score, existing loans, and past credit history.
* **Automated SQL Triggers:** The `INSERT` of a new loan automatically fires a MySQL Trigger to calculate the risk and update the approval status before the record is saved.
* **Cloud Database Integration:** fully hosted and managed MySQL database on Railway for production-ready data persistence.
* **Responsive Modern UI:** A clean, intuitive frontend built with Tailwind CSS for seamless user data entry.
* **RESTful API:** Node.js/Express backend bridging the frontend interface with the database logic securely.

## 🛠️ Tech Stack
* **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS (CDN)
* **Backend:** Node.js, Express.js
* **Database:** MySQL (Hosted on Railway Cloud)
* **Tools:** REST APIs, dotenv, CORS

## 🗄️ Database Architecture
This system relies heavily on database-level logic rather than application-level logic to ensure data integrity and speed:
* **`calculate_risk` (Stored Procedure):** A complex scoring algorithm that penalizes late payments and defaults while rewarding high income and excellent credit scores.
* **`loan_auto_decision` (Trigger):** Intercepts incoming loan requests, calls the stored procedure, and assigns an `APPROVED` (score >= 65) or `REJECTED` status automatically.
* **Relational Schema:** Normalized tables (`customers`, `loans`, `credit_history`, `transactions`) linked with `ON DELETE CASCADE` constraints.

## 📂 Project Structure
```text
LOAN-RISK-SYSTEM/
├── backend/
│   ├── database/
│   │   ├── schema.sql          # Table creations
│   │   ├── procedures.sql      # Risk calculation logic
│   │   ├── triggers.sql        # Automated decision trigger
│   │   └── extras.sql          # Views and Indexes
│   ├── public/
│   │   └── index.html          # Frontend UI
│   ├── .env                    # Environment variables (Hidden)
│   ├── db.js                   # MySQL connection pool
│   ├── package.json            # Dependencies
│   └── server.js               # Express API routing
