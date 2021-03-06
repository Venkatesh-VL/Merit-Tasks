use venkatesh_db

-------------------------------------- CATEGORIES STORED PROCEDURE --------------------------------------------------------------

--- INSERT CATEGORIES -----

CREATE PROCEDURE SP_INSERT_CATEGORIES
@ID INT, 
@CNAME VARCHAR(25), 
@CTYPE VARCHAR(30), 
@ISACTIVE BIT
WITH ENCRYPTION
AS
BEGIN
INSERT INTO CATEGORIES(CATEGORY_ID,CATEGORY_NAME,CATEGORY_TYPE,ISACTIVE,CREATED_DATE,MODIFIED_DATE)
     VALUES (@ID,@CNAME,@CTYPE,@ISACTIVE,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
END


EXECUTE SP_INSERT_CATEGORIES 101,'Salary','Income',true
EXECUTE SP_INSERT_CATEGORIES C7,'SALARY','INCOME',1

SELECT * FROM CATEGORIES

sp_helptext SP_INSERT_CATEGORIES

-------- LIST CATEGORIES ---------------


CREATE PROCEDURE SP_LIST_CATEGORIES
WITH ENCRYPTION
AS
BEGIN
	SELECT * FROM CATEGORIES;
END

EXECUTE SP_LIST_CATEGORIES

--------READ CATEGORIES --------------

CREATE PROCEDURE SP_READ_CATEGORIES
@ID INT
WITH ENCRYPTION
AS
BEGIN
SELECT * FROM CATEGORIES WHERE CATEGORY_ID = @ID
END

EXEC SP_READ_CATEGORIES 15

--UPDATE PROCEDURE FOR CATEGORY
CREATE PROCEDURE SP_UPDATE_CATEGORIES
@CTYPE VARCHAR(20),
@ID INT,
@CNAME VARCHAR(25),
@ISACTIVE BIT
WITH ENCRYPTION
AS
BEGIN
UPDATE CATEGORIES SET CATEGORY_TYPE = @CTYPE, CATEGORY_NAME = @CNAME ,ISACTIVE = @ISACTIVE, MODIFIED_DATE = CURRENT_TIMESTAMP WHERE CATEGORY_ID = @ID
END

--DELETE PROCEDURE FOR CATEGORY
 CREATE PROCEDURE SP_DELETE_CATEGORIES
 @ID INT
 WITH ENCRYPTION
 AS
 BEGIN
 DELETE FROM CATEGORIES WHERE CATEGORY_ID = @ID
 END
