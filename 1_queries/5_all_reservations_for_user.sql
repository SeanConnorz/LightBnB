SELECT reservations.*, properties.*, avg(property_reviews.rating)
FROM users 
JOIN reservations ON reservations.guest_id = users.id
JOIN properties ON owner_id = users.id
JOIN property_reviews ON property_reviews.guest_id = users.id
WHERE users.id = 1
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10;