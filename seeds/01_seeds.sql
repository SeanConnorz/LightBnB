ALTER SEQUENCE properties_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1; 
ALTER SEQUENCE reservations_id_seq RESTART WITH 1;
ALTER SEQUENCE property_reviews_id_seq RESTART WITH 1;
DELETE FROM users;
DELETE FROM properties;
DELETE FROM reservations;
DELETE FROM property_reviews;

INSERT INTO users (name, email, password)
VALUES ('Jim', 'jim@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bob', 'Bob@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('kyle', 'kyle@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, 
thumbnail_photo_url, cover_photo_url, country, 
street, city, province, post_code
) 
VALUES (1, 'Mansion', 'description', 'url', 'url', 'Canada', 'Magnolia', 'Montreal', 'Quebec', 'SAW 98W'),
(2, 'Medium house', 'description', 'url', 'url', 'United states', 'Elm', 'New York City', 'New York', 'AW9 S87'),
(3, 'Small house', 'description', 'url', 'url', 'Canada', 'Luther', 'Toronoto', 'Ontario', 'QDS AYY');

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 8, 'message'),
(2, 2, 2, 6, 'message'),
(3, 3, 3, 10, 'message');