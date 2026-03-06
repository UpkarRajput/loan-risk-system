-- 6. The Trigger (Automating the Decision)
DROP TRIGGER IF EXISTS loan_auto_decision;
DELIMITER $$
CREATE TRIGGER loan_auto_decision
BEFORE INSERT ON loans
FOR EACH ROW
BEGIN
    DECLARE score INT;
    CALL calculate_risk(NEW.customer_id, score);
    
    SET NEW.risk_score = score;

    -- Raised approval threshold to 65 for tighter risk management
    IF score >= 65 THEN
        SET NEW.status = 'APPROVED';
    ELSE
        SET NEW.status = 'REJECTED';
    END IF;
END$$
DELIMITER ;