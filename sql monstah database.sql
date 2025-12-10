/** Store items: 
Hoodies (4)
Workout Gloves (5)
Gym Belts (2)
Wrist Wraps(3)
Sweat Pants(7)
**/
CREATE TABLE store_items (id INTEGER PRIMARY KEY, name TEXT, amount INTEGER, price INTEGER );

INSERT INTO store_items VALUES (1, "Hoodies", 4, 45.99);
INSERT INTO store_items VALUES (2, "Workout Gloves", 5,10.99);
INSERT INTO store_items VALUES (3, "Gym Belts", 45,5.99);
INSERT INTO store_items VALUES (4, "Wrist Wraps", 50,7.99);
INSERT INTO store_items VALUES (5, "Sweat Pants", 7,13.99);
INSERT INTO store_items VALUES (6, "Shorts", 16, 12.99);
INSERT INTO store_items VALUES (7, "Workout Mats", 5,25.99);
INSERT INTO store_items VALUES (8, "AB Roller", 15,9.99);
INSERT INTO store_items VALUES (9, "Workout Bench ", 8,240.99);
INSERT INTO store_items VALUES (10, "Trademill", 22,499.99);
INSERT INTO store_items VALUES (11, "Lifting Straps", 30, 8.99);
INSERT INTO store_items VALUES (12, "Water bottles", 18,9.95);
INSERT INTO store_items VALUES (13, "Pre-worlout", 15,39.99);
INSERT INTO store_items VALUES (14, "Workout Bench ", 8,355.99);
INSERT INTO store_items VALUES (15, "Training Manual", 40,13.99);

SELECT * FROM store_items;
SELECT * FROM monstah_database.sports_store;