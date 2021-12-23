'use strict';
const db = require('../components/db');


/**
 * Remove a user from the assigned task
 *
 * Input: 
 * - taskId: ID of the task
 * - userId: ID of the assignee
 * - owner : ID of user who wants to remove the assignee
 * Output:
 * - no response expected for this operation
 * 
 **/
 exports.removeUser = function(taskId,userId,owner) {
     console.log(taskId + ' ' + userId + ' ' + owner)
  return new Promise((resolve, reject) => {
      const sql1 = "SELECT owner FROM tasks t WHERE t.id = ?";
      db.all(sql1, [taskId], (err, rows) => {
          if (err)
              reject(err);
          else if (rows.length === 0)
              reject(404);
          else if(owner != rows[0].owner) {
              reject(403);
          }
          else {
              const sql2 = 'DELETE FROM assignments WHERE task = ? AND user = ?';
              db.run(sql2, [taskId, userId], (err) => {
                  if (err)
                      reject(err);
                  else
                      resolve(null);
              })
          }
      });
  });

}


/**
 * Retreve the users assignted to the task
 *
 * Input: 
 * - taskId: ID of the task
 * - owner: ID of the user who wants to retrieve the list of assignees
 * Output:
 * - list of assignees
 * 
 **/
 exports.getUsersAssigned = function(taskId,owner) {
  return new Promise((resolve, reject) => {
      const sql1 = "SELECT owner FROM tasks WHERE id = ?";
      db.all(sql1, [taskId], (err, rows) => {
          if (err)
            reject(err);
          else if (rows.length === 0)
              reject(404);
          else if(owner != rows[0].owner) {
              reject(403);
          }
          else {
              const sql2 = "SELECT u.id as uid, u.name, u.email FROM assignments as a, users as u WHERE  a.task = ? AND a.user = u.id";
              db.all(sql2, [taskId], (err, rows) => {
                  if (err) {
                      reject(err);
                  } else {
                      let users = rows.map((row) => {return {id: row.uid, name: row.name, email: row.email, hash: null}});
                      resolve(users);
                  }
              });
          }
      });
  });
}


/**
 * Assign a user to the task
 *
 *
 * Input: 
 * - userId : ID of the task assignee
 * - taskId: ID of the task to be assigned
 * - owner: ID of the user who wants to assign the task
 * Output:
 * - no response expected for this operation
 * 
 **/
 exports.assignTaskToUser = function(userId,taskId,owner) {
    return new Promise((resolve, reject) => {
        const sql1 = "SELECT owner FROM tasks t WHERE t.id = ?";
        db.all(sql1, [taskId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                reject(404);
            else if(owner != rows[0].owner) {
                reject(403);
            }
            else {
                const sql2 = 'INSERT INTO assignments(task, user) VALUES(?,?)';
                db.run(sql2, [taskId, userId], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(null);
                    }
                });
            }
        });
    });
}

/** DA CAPIRE
 * Reassign tasks in a balanced manner
 *
 * Input: 
 * - owner : ID of user who wants to assign the tasks
 * Output:
 * - no response expected for this operation
 * 
 **/
 exports.assignBalanced = function(owner) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT t1.id FROM tasks t1 LEFT JOIN assignments t2 ON t2.task = t1.id WHERE t1.owner = ? AND t2.task IS NULL";
      db.each(sql, [owner], (err, tasks) => {
          if (err) {
              reject(err);
          } else {
              exports.assignEach(tasks.id, owner).then(function(userid) {
                  resolve(userid);
              });
          }
      });
      resolve(null);
    });
  }
