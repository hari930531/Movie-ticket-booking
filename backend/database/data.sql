CREATE DATABASE IF NOT EXISTS ticket_booking;
USE ticket_booking;

CREATE TABLE IF NOT EXISTS movies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    duration INT,
    price DOUBLE
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    movie_id BIGINT,
    customer_name VARCHAR(255),
    seat_number VARCHAR(10),
    theater VARCHAR(255),
    show_date VARCHAR(50),
    show_time VARCHAR(50),
    total_amount DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- Populate 9 Movies
INSERT INTO movies (id, title, genre, duration, price) VALUES
(1, 'Jailer 2', 'Action / Crime', 165, 250.0),
(2, 'Leo', 'Action / Thriller', 164, 250.0),
(3, 'Vishwanath & Sons', 'Family Drama', 148, 220.0),
(4, 'The Dark Knight', 'Action / Crime', 152, 220.0),
(5, 'Spider-Man Remastered', 'Action / Sci-Fi', 135, 240.0),
(6, 'Bramayugam', 'Mystery / Horror', 139, 200.0),
(7, 'Kudumbasthan', 'Comedy / Drama', 140, 180.0),
(8, 'Kalamkaval', 'Crime / Investigation', 145, 200.0),
(9, 'Ekō', 'Adventure / Drama', 125, 180.0);