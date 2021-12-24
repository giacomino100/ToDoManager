'use strict';

const db = require('../components/db');
const bcrypt = require('bcrypt');



  /**
 * Retrieve a user by her email
 * 
 * Input:
 * - email: email of the user
 * Output:
 * - the user having the specified email
 * 
 */
exports.getUserByEmail = function (email) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.all(sql, [email], (err, rows) => {
            if (err) 
                reject(err);
            else if (rows.length === 0)
                resolve(undefined);
            else{
                const user = {id: rows[0].id, email: rows[0].email, name: rows[0].name, hash: rows[0].hash}
                resolve(user);
            }
        });
    });
  };

/**
 * Retrieve all the users
 * 
 * Input:
 * - none
 * Output:
 * - the list of all the users
 * 
 */
 exports.getUsers = function() {
  return new Promise((resolve, reject) => {
      const sql = "SELECT id, name, email FROM users";
      db.all(sql, [], (err, rows) => {
          if (err) {
              reject(err);
          }else if (rows.length === 0){
                resolve(404);
          } else {
                let users = rows.map((row) => ({id: row.id, email: row.email, name: row.name, hash: row.hash}));
                resolve(users);
              }
        });
    });
}



/**
 * Retrieve a user by her ID
 * 
 * Input:
 * - id: ID of the user
 * Output:
 * - the user having the specified ID
 * 
 */
 exports.getSingleUser = function (id) {
  return new Promise((resolve, reject) => {
      const sql = "SELECT id, name, email FROM users WHERE id = ?"
      db.all(sql, [id], (err, rows) => {
          if (err) 
              reject(err);
          else if (rows.length === 0)
              reject(404);
          else{
              const user = createUser(rows[0]);
              resolve(user);
          }
      });
  });
};


/**
 * Utility functions
 */

  exports.checkPassword = function(user, password){
    let hash = bcrypt.hashSync(password, 10);
    return bcrypt.compareSync(password, user.hash);
  }

