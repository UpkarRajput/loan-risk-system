CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    annual_income DECIMAL(12,2),
    employment_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loans (
    loan_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    loan_amount DECIMAL(12,2),
    tenure_months INT,
    interest_rate DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'PENDING',
    risk_score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    amount DECIMAL(12,2),
    type ENUM('DEBIT','CREDIT'),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE credit_history (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    late_payments INT,
    defaults INT,
    credit_utilization DECIMAL(5,2),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);