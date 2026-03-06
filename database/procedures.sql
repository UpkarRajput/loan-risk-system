DELIMITER $$

CREATE PROCEDURE calculate_risk(IN cust_id INT, OUT final_score INT)
BEGIN
    DECLARE income_score INT DEFAULT 0;
    DECLARE payment_score INT DEFAULT 0;
    DECLARE default_score INT DEFAULT 0;
    DECLARE total_score INT DEFAULT 0;

    SELECT 
        CASE 
            WHEN annual_income > 1000000 THEN 20
            WHEN annual_income > 500000 THEN 15
            ELSE 5
        END
    INTO income_score
    FROM customers
    WHERE customer_id = cust_id;

    SELECT 
        CASE 
            WHEN late_payments = 0 THEN 30
            WHEN late_payments <= 2 THEN 20
            ELSE 5
        END,
        CASE
            WHEN defaults = 0 THEN 30
            ELSE 0
        END
    INTO payment_score, default_score
    FROM credit_history
    WHERE customer_id = cust_id;

    SET total_score = income_score + payment_score + default_score;

    SET final_score = total_score;
END$$