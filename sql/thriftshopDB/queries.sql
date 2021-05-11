/* Drop column */
ALTER TABLE customer_purchases
DROP COLUMN customer_id;

/* Add column */
ALTER TABLE customer_purchases
ADD COLUMN purchase_amount DECIMAL(10,2) AFTER customer_purchase_id;

/* Add column */
ALTER TABLE customer_purchases
ADD COLUMN purchased_at DATETIME;

/* Update record */
UPDATE inventory
SET number_in_stock = 0 -- sold out
WHERE inventory_id in (2, 6);

/* Update trigger for updating inventory */
CREATE TRIGGER purchaseUpdateInventory
AFTER INSERT ON customer_purchases
FOR EACH ROW 
    UPDATE inventory
        -- subtracting an item for each purchase
        SET number_in_stock = number_in_stock - 1
    WHERE inventory_id = NEW.inventory_id;

/* Drop trigger */
DROP TRIGGER purchaseUpdateInventory;

/* Update trigger for updating inventory */
CREATE TRIGGER purchaseUpdateInventory
AFTER INSERT ON customer_purchases
FOR EACH ROW 
    UPDATE inventory
        -- subtracting purchase's amount
        SET number_in_stock = number_in_stock - NEW.purchase_amount
    WHERE inventory_id = NEW.inventory_id;

/* Show all triggers */
SHOW TRIGGERS;

/* Create new table for inventory shortage information */
create TABLE inventoryShortage (
	inventory_id BIGINT NOT NULL
)

/* Trigger when stock amount for a product is smaller than 0 */
CREATE TRIGGER purchaseUpdateInventoryShortage
AFTER UPDATE ON inventory
FOR EACH ROW
	INSERT INTO inventoryShortage
        SELECT NEW.inventory_id
        WHERE NEW.number_in_stock < 0;

/* Delete products in inventoryShortage when they were deleted in inventory */
CREATE TRIGGER deleteFromInventoryUpdateInventoryShortage
AFTER DELETE ON inventory
FOR EACH ROW
    DELETE FROM inventoryShortage
    WHERE inventory_id = OLD.inventory_id;