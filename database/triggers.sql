DELIMITER $$

CREATE TRIGGER loan_auto_decision
BEFORE INSERT ON loans
FOR EACH ROW
BEGIN
    DECLARE score INT;

    CALL calculate_risk(NEW.customer_id, score);

    SET NEW.risk_score = score;

    IF score >= 60 THEN
        SET NEW.status = 'APPROVED';
    ELSE
        SET NEW.status = 'REJECTED';
    END IF;
END$$

DELIMITER ;