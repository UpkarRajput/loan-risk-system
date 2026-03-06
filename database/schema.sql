CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    age INT NOT NULL CHECK (age BETWEEN 18 AND 65),
    employment_status VARCHAR(50) NOT NULL,
    monthly_income DECIMAL(12,2) NOT NULL CHECK (monthly_income > 0),
    credit_score INT NOT NULL CHECK (credit_score BETWEEN 300 AND 900),
    existing_loans INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Credit History Table
CREATE TABLE credit_history (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    late_payments INT DEFAULT 0,
    defaults INT DEFAULT 0,
    credit_utilization DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 3. Loans Table
CREATE TABLE loans (
    loan_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    loan_amount DECIMAL(12,2) NOT NULL,
    tenure_months INT NOT NULL,
    interest_rate DECIMAL(5,2) DEFAULT 8.50,
    status VARCHAR(20) DEFAULT 'PENDING',
    risk_score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    type ENUM('DEBIT','CREDIT') NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);
