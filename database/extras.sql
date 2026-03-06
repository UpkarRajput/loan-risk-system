-- 7. Views and Indexes
CREATE OR REPLACE VIEW loan_analytics AS
SELECT status, COUNT(*) AS total_loans, AVG(risk_score) AS avg_risk
FROM loans
GROUP BY status;

CREATE INDEX idx_customer_income ON customers(monthly_income);
CREATE INDEX idx_transaction_date ON transactions(transaction_date);
