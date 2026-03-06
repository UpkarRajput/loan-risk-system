-- 5. The Core Logic: Stored Procedure
-- Now dynamically pulls from credit_history and penalizes for bad records.
DROP PROCEDURE IF EXISTS calculate_risk;
DELIMITER $$
CREATE PROCEDURE calculate_risk(IN cust_id INT, OUT final_score INT)
BEGIN
    DECLARE v_monthly_income DECIMAL(12,2);
    DECLARE v_credit_score INT;
    DECLARE v_existing_loans INT;
    DECLARE v_age INT;
    
    DECLARE v_late_payments INT DEFAULT 0;
    DECLARE v_defaults INT DEFAULT 0;

    DECLARE income_score INT DEFAULT 0;
    DECLARE credit_score_points INT DEFAULT 0;
    DECLARE loan_score INT DEFAULT 0;
    DECLARE age_score INT DEFAULT 0;
    DECLARE history_penalty INT DEFAULT 0;

    -- Fetch basic customer data
    SELECT monthly_income, credit_score, existing_loans, age
    INTO v_monthly_income, v_credit_score, v_existing_loans, v_age
    FROM customers
    WHERE customer_id = cust_id;

    -- Fetch credit history data (Defaults to 0 if no history exists)
    SELECT IFNULL(SUM(late_payments), 0), IFNULL(SUM(defaults), 0)
    INTO v_late_payments, v_defaults
    FROM credit_history
    WHERE customer_id = cust_id;

    -- Scoring Logic (Max 100 points before penalties)
    
    -- Income (Max 25 points)
    IF v_monthly_income >= 100000 THEN SET income_score = 25;
    ELSEIF v_monthly_income >= 50000 THEN SET income_score = 15;
    ELSE SET income_score = 5;
    END IF;

    -- Credit Score (Max 35 points)
    IF v_credit_score >= 750 THEN SET credit_score_points = 35;
    ELSEIF v_credit_score >= 650 THEN SET credit_score_points = 20;
    ELSE SET credit_score_points = 5;
    END IF;

    -- Existing Loans (Max 20 points)
    IF v_existing_loans = 0 THEN SET loan_score = 20;
    ELSEIF v_existing_loans <= 2 THEN SET loan_score = 10;
    ELSE SET loan_score = 0;
    END IF;

    -- Age (Max 20 points)
    IF v_age BETWEEN 25 AND 50 THEN SET age_score = 20;
    ELSEIF v_age BETWEEN 21 AND 60 THEN SET age_score = 10;
    ELSE SET age_score = 0;
    END IF;

    -- Strict Penalties for Bad History (Late payments hurt, defaults kill the score)
    SET history_penalty = (v_late_payments * 15) + (v_defaults * 50);

    -- Calculate Final Score and ensure it stays within 0-100 bounds
    SET final_score = (income_score + credit_score_points + loan_score + age_score) - history_penalty;
    
    IF final_score > 100 THEN SET final_score = 100; END IF;
    IF final_score < 0 THEN SET final_score = 0; END IF;
END$$
DELIMITER ;
