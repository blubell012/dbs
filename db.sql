CREATE DATABASE rental_system;
USE rental_system;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(50)
);

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  age INT,
  phone VARCHAR(15),
  address TEXT,
  license_number VARCHAR(50) UNIQUE
);

CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_name VARCHAR(100),
  model VARCHAR(50),
  registration_number VARCHAR(50) UNIQUE,
  price_per_hour DECIMAL(10,2),
  status VARCHAR(20),
  image_url TEXT
);

CREATE TABLE rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  vehicle_id INT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  age INT,
  customer_phone VARCHAR(15),
  address TEXT,
  license_number VARCHAR(50),
  pickup_datetime DATETIME,
  drop_datetime DATETIME,
  total_hours FLOAT,
  total_cost FLOAT,
  payment_status VARCHAR(20),
  rental_status VARCHAR(20),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT,
  amount FLOAT,
  status VARCHAR(20),
  FOREIGN KEY (rental_id) REFERENCES rentals(id)
);


CREATE TABLE damages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rental_id INT,
  description TEXT,
  penalty_amount FLOAT,
  reported_date DATETIME,
  FOREIGN KEY (rental_id) REFERENCES rentals(id)
);

INSERT INTO vehicles (vehicle_name, model, registration_number, price_per_hour, status, image_url) VALUES
('TVS Jupiter', '110cc', 'KA01JUP1', 24, 'Available', 'images/jupiter.png'),
('TVS Jupiter', '110cc', 'KA01JUP2', 24, 'Available', 'images/jupiter.png'),

('Honda Activa', '5G', 'KA01ACT1', 22, 'Available', 'images/activa.png'),
('Honda Activa', '5G', 'KA01ACT2', 22, 'Available', 'images/activa.png'),

('Suzuki Access', '125cc', 'KA01ACC1', 23, 'Available', 'images/access.png'),
('Suzuki Access', '125cc', 'KA01ACC2', 23, 'Available', 'images/access.png'),

('TVS Ntorq', '125cc', 'KA01NTQ1', 28, 'Available', 'images/ntorq.png'),
('TVS Ntorq', '125cc', 'KA01NTQ2', 28, 'Available', 'images/ntorq.png'),

('Honda Dio', 'BS6', 'KA01HDI1', 21, 'Available', 'images/dio.png'),
('Honda Dio', 'BS6', 'KA01HDI2', 21, 'Available', 'images/dio.png'),

('Yamaha Fascino', '125cc', 'KA01FAS1', 22, 'Available', 'images/fascino.png'),
('Yamaha Fascino', '125cc', 'KA01FAS2', 22, 'Available', 'images/fascino.png');

INSERT INTO users (username, password) VALUES ('admin', 'admin123');