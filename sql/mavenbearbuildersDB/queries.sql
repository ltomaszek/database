/* Create schema */
CREATE SCHEMA 'mavenbearbuilders' DEFAULT CHARACTER SET utf8 ;

/* Create table */
CREATE TABLE table1 (
	id BIGINT NOT NULL PRIMARY KEY,
    char_field VARCHAR(50),
    my_text_field TEXT, 
    my_created_at TIMESTAMP
);

/* Insert records */


CREATE SCHEMA survey;

USE survey;

/* Create table salary_survey */
CREATE TABLE salary_survey (
    country VARCHAR(120),
    years_experience TINYINT,
    employment_status VARCHAR(120),
    job_title VARCHAR(120),
    is_manager VARCHAR(3),
    education VARCHAR(120)
);

CREATE SCHEMA mavenbearbuilders;

/* Compare min and max date */
SELECT 
    min(created_at), 
    max(created_at) 
FROM order_items;

CREATE TABLE order1 (
    id BIGINT
);

/* Add primary key */
ALTER TABLE order_items
ADD CONSTRAINT PRIMARY (order_id);

/* Create table */
CREATE TABLE order_item_refunds (
    order_item_refund_id BIGINT,
    created_at DATETIME,
    order_item_id BIGINT,
    order_id BIGINT,
    refund_amount_usd DECIMAL(6,2),
    PRIMARY KEY (order_item_refund_id),
    FOREIGN KEY (order_item_id) REFERENCES order_items (order_item_id)
);

SHOW FULL COLUMNS FROM  order_items;

/* All orders with refund, order ASC with refunds at the beginning */
SELECT 
			o.order_id,
			o.created_at AS purchase_date,
            r.created_at AS refund_date,
            website_session_id,
            order_item_refund_id,
            price_usd,
            refund_amount_usd
FROM 		order_items o
LEFT JOIN 	order_item_refunds r
	ON 		o.order_item_id = r.order_id
ORDER BY 	-order_item_refund_id DESC

/* Delete incorrect data from table */
DELETE FROM order_item_refunds
WHERE order_item_refund_id BETWEEN 6 AND 10;

/* New table */
CREATE TABLE products (
    product_id BIGINT PRIMARY KEY,
    created_at DATETIME,
    product_name VARCHAR(50)
);

/* Add primary key */
ALTER TABLE products
ADD CONSTRAINT PRIMARY KEY (product_id)

/* Insert values */
INSERT INTO products VALUES  
(1, '2021-02-19 09:00:00', 'The Original Mr. Fuzzy'),
(2, '2013-01-06 13:00:00', 'The Forever Love Bear')

/* Add column */
ALTER TABLE order_items
ADD column product_id BIGINT;

/* Country group information view */
CREATE VIEW country_summary AS
	SELECT 
		country,
		COUNT(*) AS respondents,
		ROUND(AVG(years_experience), 2) AS avg_years_experience,
		ROUND(AVG(CASE WHEN is_manager = 'Yes' THEN 1 ELSE 0 END) * 100, 2) AS pct_managers,
		AVG(CASE education WHEN 'Masters' THEN 1 ELSE 0 END) * 100 AS pct_masters
	FROM salary_survey
	GROUP BY country
	ORDER BY respondents DESC;

/* Sessions performance */
CREATE VIEW sessions_performance AS
	SELECT 
		year(created_at) AS year, 
		month(created_at) AS month,
		utm_source,
		utm_campaign,
		count(*) AS num_sessions
	FROM website_sessions
	group by year, month, utm_source, utm_campaign
	ORDER BY 1, 2, 3, 4;

/* Back-populating the orders table */
CREATE TABLE orders AS
    SELECT
        order_id,
        MIN(created_at) AS created_at,
        MIN(website_session_id) AS website_session_id,
        SUM(CASE is_primary_item
            WHEN 1 THEN product_id
            ELSE NULL
            END) AS primary_product_id,
        COUNT(order_item_id) AS items_purchased,
        SUM(price_usd) AS price_usd,
        SUM(cogs_usd) AS cogs_usd
    FROM order_items
    GROUP BY 1
    ORDER BY 1;

/* Or - when table is already created */
INSERT INTO orders
    SELECT ...

/* Update orders table when an item is inserted to order_items table */
CREATE TRIGGER insertUpdateOrders
AFTER INSERT ON order_items
FOR EACH ROW
    REPLACE INTO orders
        SELECT
            order_id,
            MIN(created_at) AS created_at,
            MIN(website_session_id) AS website_session_id,
            SUM(CASE is_primary_item
                WHEN 1 THEN product_id
                ELSE NULL
                END) AS primary_product_id,
            COUNT(order_item_id) AS items_purchased,
            SUM(price_usd) AS price_usd,
            SUM(cogs_usd) AS cogs_usd
        FROM order_items
        WHERE order_id = NEW.order_id
        GROUP BY 1;