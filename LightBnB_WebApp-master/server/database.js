const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool ({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // console.log(user);
  // return Promise.resolve(user);
  const querryString = `
  SELECT * 
  FROM users
  WHERE email = $1;
  `
  return pool
  .query(querryString, [email])
  .then((result) => {
    return result.rows[0];
  })
  .catch(err => console.log(err.message));
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const querryString = `
  SELECT * 
  FROM users
  WHERE id = $1;
  `;
  return pool
  .query(querryString, [id])
  .then((result) => {
    return result.rows[0];
  })
  .catch(err => console.log(err.message));
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const querryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  const values = [user.name, user.email, user.password]
  return pool
  .query(querryString, values)
  .then((result) => {
    return result.rows;
  })
  .catch()
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const querryString = `
    SELECT properties.* 
    FROM properties
    JOIN reservations ON property_id = properties.id
    WHERE guest_id = $1
    LIMIT $2;
  `;
  const values = [guest_id, limit];
  return pool
  .query(querryString, values)
  .then(result => result.rows)
  .catch(err => console.log(err.message));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    if (queryParams.length <= 1) {
      queryString += `WHERE city LIKE $${queryParams.length}`;
    } else {
      queryString += `AND city LIKE $${queryParams.length}`;
    }
  }

  if (options.owner_id) {
    queryParams.push(`%${options.owner_id}%`);
    if (queryParams.length <= 1) {
      queryString += `WHERE owner_id = $${queryParams.length}`;
    } else {
      queryString += `AND owner_id = $${queryParams.length}`;
    }
  } 

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    if (queryParams.length <= 1) {
      queryString += `WHERE cost_per_night > $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night > $${queryParams.length}`;
    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    if (queryParams.length <= 1) {
      queryString += `WHERE cost_per_night < $${queryParams.length} `;
    } else {
      queryString += `AND cost_per_night < $${queryParams.length}`;
    }
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    if (queryParams.length <= 1) {
      queryString += `WHERE rating > $${queryParams.length} `;
    } else {
      queryString += `AND rating > $${queryParams.length}`;
    }
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  HAVING avg(property_reviews.rating) >= 4
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  
  return pool
    .query(queryString, queryParams)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
