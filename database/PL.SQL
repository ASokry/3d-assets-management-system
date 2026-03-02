/*
Team 124 PL SQL
By Ethan Hong and Anthony Sokry
PL/SQL stored procedures to be used on the database.
*/

--
-- CREATE Stored Procedures
--
-- #############################
-- CREATE 3D_Models_Has_Artists
-- #############################
DROP PROCEDURE IF EXISTS sp_CreateModelAndArtist;

DELIMITER //
CREATE PROCEDURE sp_CreateModelAndArtist(
    IN p_id_model INT, 
    IN p_id_artist INT, 
    OUT p_id INT)
BEGIN
    INSERT INTO `3D_Models_Has_Artists` (id_model, id_artist) 
    VALUES (p_id_model, p_id_artist);

    -- Store the ID of the last inserted row
    SELECT LAST_INSERT_ID() into p_id;
    -- Display the ID of the last inserted model and artist record.
    SELECT LAST_INSERT_ID() AS 'new_id';

END //
DELIMITER ;

-- #############################
-- CREATE 3D_Models
-- #############################
DROP PROCEDURE IF EXISTS sp_CreateModel;

DELIMITER //
CREATE PROCEDURE sp_CreateModel(
    IN p_name VARCHAR(45), 
    IN p_description VARCHAR(255), 
    IN p_created_date DATE, 
    IN p_modified_date DATE, 
    IN p_file_path VARCHAR(128),
    IN p_is_active BOOLEAN,
    IN p_id_material INT,
    IN p_id_texture INT,
    OUT p_id INT)
BEGIN
    INSERT INTO `3D_Models` (name, description, created_date, modified_date, file_path, is_active, id_material, id_texture) 
    VALUES (p_name, p_description, p_created_date, p_modified_date, p_file_path, p_is_active, p_id_material, p_id_texture);

    -- Store the ID of the last inserted row
    SELECT LAST_INSERT_ID() into p_id;
    -- Display the ID of the last inserted 3D model.
    SELECT LAST_INSERT_ID() AS 'new_id';

END //
DELIMITER ;

-- #############################
-- CREATE Materials
-- #############################
DROP PROCEDURE IF EXISTS sp_CreateMaterial;

DELIMITER //
CREATE PROCEDURE sp_CreateMaterial(
    IN p_name VARCHAR(45), 
    IN p_description VARCHAR(255), 
    IN p_created_date DATE, 
    IN p_modified_date DATE,
    IN p_base_color VARCHAR(45),
    IN p_roughness DECIMAL(6, 2),
    IN p_metallic DECIMAL(6, 2),
    IN p_transparency DECIMAL(6, 2),
    IN p_file_path VARCHAR(128),
    IN p_id_artist INT,
    IN p_is_active BOOLEAN,
    OUT p_id INT)
BEGIN
    INSERT INTO Materials (name, description, created_date, modified_date, base_color, roughness, metallic, transparency, file_path, id_artist, is_active) 
    VALUES (p_name, p_description, p_created_date, p_modified_date, p_base_color, p_roughness, p_metallic, p_transparency, p_file_path, p_id_artist, p_is_active);

    -- Store the ID of the last inserted row
    SELECT LAST_INSERT_ID() into p_id;
    -- Display the ID of the last inserted material.
    SELECT LAST_INSERT_ID() AS 'new_id';

END //
DELIMITER ;

-- #############################
-- CREATE Textures
-- #############################
DROP PROCEDURE IF EXISTS sp_CreateTexture;

DELIMITER //
CREATE PROCEDURE sp_CreateTexture(
    IN p_name VARCHAR(45), 
    IN p_description VARCHAR(255), 
    IN p_created_date DATE, 
    IN p_modified_date DATE,
    IN p_resolution VARCHAR(45),
    IN p_file_path VARCHAR(128),
    IN p_id_artist INT,
    IN p_is_active BOOLEAN,
    OUT p_id INT)
BEGIN
    INSERT INTO Textures (name, description, created_date, modified_date, resolution, file_path, id_artist, is_active) 
    VALUES (p_name, p_description, p_created_date, p_modified_date, p_resolution, p_file_path, p_id_artist, p_is_active);

    -- Store the ID of the last inserted row
    SELECT LAST_INSERT_ID() into p_id;
    -- Display the ID of the last inserted texture.
    SELECT LAST_INSERT_ID() AS 'new_id';

END //
DELIMITER ;

-- #############################
-- CREATE Artists
-- #############################
DROP PROCEDURE IF EXISTS sp_CreateArtist;

DELIMITER //
CREATE PROCEDURE sp_CreateArtist(
    IN p_first_name VARCHAR(45), 
    IN p_last_name VARCHAR(45), 
    IN p_email varchar(45), 
    IN p_phone varchar(25), 
    OUT p_id INT)
BEGIN
    INSERT INTO Artists (first_name, last_name, email, phone) 
    VALUES (p_first_name, p_last_name, p_email, p_phone);

    -- Store the ID of the last inserted row
    SELECT LAST_INSERT_ID() into p_id;
    -- Display the ID of the last inserted artist.
    SELECT LAST_INSERT_ID() AS 'new_id';

END //
DELIMITER ;

--
-- UPDATE Stored Procedures
--
-- #############################
-- UPDATE 3D_Models_Has_Artists
-- #############################
DROP PROCEDURE IF EXISTS sp_UpdateModelAndArtist;

DELIMITER //
CREATE PROCEDURE sp_UpdateModelAndArtist(
    IN p_id INT,
    IN p_id_model INT, 
    IN p_id_artist INT
)
BEGIN
    UPDATE `3D_Models_Has_Artists` SET  
        id_model = p_id_model,
        id_artist = p_id_artist
    WHERE id_model_artist = p_id; 

END //
DELIMITER ;

-- #############################
-- UPDATE 3D_Models
-- #############################
DROP PROCEDURE IF EXISTS sp_UpdateModel;

DELIMITER //
CREATE PROCEDURE sp_UpdateModel(
    IN p_id INT, 
    IN p_description VARCHAR(255),
    IN p_modified_date DATE,
    IN p_file_path VARCHAR(128),
    IN p_is_active BOOLEAN,
    IN p_material INT,
    IN p_texture INT
)

BEGIN
    UPDATE `3D_Models` SET  
        description = p_description,
        modified_date = p_modified_date,
        file_path = p_file_path,
        is_active = p_is_active,
        id_material = p_material,
        id_texture = p_texture
    WHERE id_model = p_id; 
END //
DELIMITER ;

-- #############################
-- UPDATE Materials
-- #############################
DROP PROCEDURE IF EXISTS sp_UpdateMaterial;

DELIMITER //
CREATE PROCEDURE sp_UpdateMaterial(
    IN p_id INT, 
    IN p_description VARCHAR(255),
    IN p_modified_date DATE,
    IN p_base_color VARCHAR(45),
    IN p_roughness DECIMAL(6, 2),
    IN p_metallic DECIMAL(6, 2),
    IN p_transparency DECIMAL(6, 2),
    IN p_file_path VARCHAR(128),
    IN p_id_artist INT,
    IN p_is_active BOOLEAN
)

BEGIN
    UPDATE Materials SET  
        description = p_description,
        modified_date = p_modified_date,
        base_color = p_base_color,
        roughness = p_roughness,
        metallic = p_metallic,
        transparency = p_transparency,
        file_path = p_file_path,
        id_artist = p_id_artist,
        is_active = p_is_active
    WHERE id_material = p_id; 
END //
DELIMITER ;

-- #############################
-- UPDATE Textures
-- #############################
DROP PROCEDURE IF EXISTS sp_UpdateTexture;

DELIMITER //
CREATE PROCEDURE sp_UpdateTexture(
    IN p_id INT, 
    IN p_description VARCHAR(255),
    IN p_modified_date DATE,
    IN p_resolution VARCHAR(45),
    IN p_file_path VARCHAR(128),
    IN p_id_artist INT,
    IN p_is_active BOOLEAN
)

BEGIN
    UPDATE Textures SET  
        description = p_description,
        modified_date = p_modified_date,
        resolution = p_resolution,
        file_path = p_file_path,
        id_artist = p_id_artist,
        is_active = p_is_active
    WHERE id_texture = p_id; 
END //
DELIMITER ;

-- #############################
-- UPDATE Artists
-- #############################
DROP PROCEDURE IF EXISTS sp_UpdateArtist;

DELIMITER //
CREATE PROCEDURE sp_UpdateArtist(
    IN p_id INT, 
    IN p_email VARCHAR(45),
    IN p_phone VARCHAR(25)
)

BEGIN
    UPDATE Artists SET  
        email = p_email,
        phone = p_phone
    WHERE id_artist = p_id; 
END //
DELIMITER ;

--
-- DELETE Stored Procedures
--
-- #############################
-- DELETE 3D_Models_Has_Artists
-- #############################
DROP PROCEDURE IF EXISTS sp_DeleteModelAndArtist;
DELIMITER //
CREATE PROCEDURE sp_DeleteModelAndArtist(IN p_id INT)
BEGIN
    DECLARE error_message VARCHAR(255); 

    -- error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction on any error
        ROLLBACK;
        -- Propogate the custom error message to the caller
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Deleting corresponding rows from 3D_Models_Has_Artists table
        DELETE FROM `3D_Models_Has_Artists` WHERE id_model_artist = p_id;

        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in 3D_Models_Has_Artists for id: ', p_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END //
DELIMITER ;

-- #############################
-- DELETE 3D_Models
-- #############################
DROP PROCEDURE IF EXISTS sp_DeleteModel;
DELIMITER //
CREATE PROCEDURE sp_DeleteModel(IN p_id INT)
BEGIN
    DECLARE error_message VARCHAR(255); 

    -- error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction on any error
        ROLLBACK;
        -- Propogate the custom error message to the caller
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Deleting corresponding rows from both 3D_Models table and 
        --      intersection table to prevent a data anamoly
        DELETE FROM `3D_Models_Has_Artists` WHERE id_model = p_id;
        DELETE FROM `3D_Models` WHERE id_model = p_id;

        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in 3D_Models for id: ', p_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END //
DELIMITER ;

-- #############################
-- DELETE Materials
-- #############################
DROP PROCEDURE IF EXISTS sp_DeleteMaterial;
DELIMITER //
CREATE PROCEDURE sp_DeleteMaterial(IN p_id INT)
BEGIN
    DECLARE error_message VARCHAR(255); 

    -- error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction on any error
        ROLLBACK;
        -- Propogate the custom error message to the caller
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Deleting corresponding rows from Materials table and 
        DELETE FROM Materials WHERE id_material = p_id;

        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in Materials for id: ', p_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END //
DELIMITER ;

-- #############################
-- DELETE Textures
-- #############################
DROP PROCEDURE IF EXISTS sp_DeleteTexture;
DELIMITER //
CREATE PROCEDURE sp_DeleteTexture(IN p_id INT)
BEGIN
    DECLARE error_message VARCHAR(255); 

    -- error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction on any error
        ROLLBACK;
        -- Propogate the custom error message to the caller
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Deleting corresponding rows from Textures table and 
        DELETE FROM Textures WHERE id_texture = p_id;

        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in Textures for id: ', p_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END //
DELIMITER ;

-- #############################
-- DELETE Artists
-- #############################
DROP PROCEDURE IF EXISTS sp_DeleteArtist;
DELIMITER //
CREATE PROCEDURE sp_DeleteArtist(IN p_id INT)
BEGIN
    DECLARE error_message VARCHAR(255); 

    -- error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Roll back the transaction on any error
        ROLLBACK;
        -- Propogate the custom error message to the caller
        RESIGNAL;
    END;

    START TRANSACTION;
        -- Deleting corresponding rows from both Artists table and 
        --      intersection table to prevent a data anamoly
        DELETE FROM `3D_Models_Has_Artists` WHERE id_artist = p_id;
        DELETE FROM Artists WHERE id_artist = p_id;

        -- ROW_COUNT() returns the number of rows affected by the preceding statement.
        IF ROW_COUNT() = 0 THEN
            set error_message = CONCAT('No matching record found in Artists for id: ', p_id);
            -- Trigger custom error, invoke EXIT HANDLER
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_message;
        END IF;

    COMMIT;

END //
DELIMITER ;