'use strict';

const db = require('../components/db');
var constants = require('../utils/constants.js');


/**
 * Create a new task
 *
 * Input: 
 * - task: the task object that needs to be created
 * - owner: ID of the user who is creating the task
 * Output:
 * - the created task
 **/

 exports.addTask = function(task, owner) {
  return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO tasks(description, important, private, project, deadline, completed, owner) VALUES(?,?,?,?,?,?, ?)';
      db.run(sql, [task.description, task.important, task.private, task.project, task.deadline, task.completed, owner], function(err) {
          if (err) {
              reject(err);
          } else {
              var createdTask = {taskId: this.lastID, description: task.description, important: task.important, private: task.private, deadline: task.deadline, project: task.project, completed: task.completed};
              resolve(createdTask);
          }
      });
  });
}

/**
 * Retrieve the public tasks
 * 
 * Input: 
 * - req: the request of the user
 * Output:
 * - list of the public tasks
 * 
 **/
 exports.getPublicTasks = function(req) {
  return new Promise((resolve, reject) => {
      var sql = "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline,t.completed ,c.total_rows FROM tasks t, (SELECT count(*) total_rows FROM tasks l WHERE l.private=0) c WHERE  t.private = 0 "
      var limits = getPagination(req);
      if (limits.length != 0) sql = sql + " LIMIT ?,?";
      db.all(sql, limits, (err, rows) => {
          if (err) {
              reject(err);
          } else {
              let tasks = rows.map((row) => createTask(row));
              resolve(tasks);
          }
      });
  });
}

exports.getTotalPublicTasks = function(){
    return new Promise((resolve, reject) => {
        var sql = "SELECT * FROM tasks WHERE private=?"
        db.all(sql, [0], (err, rows) => {
            if(err){
                reject(err)
            } else {
                let total = rows.length;
                resolve(total)
            }
        })
    })
}

/**
 * Delete a task having taskId as ID
 *
 * Input: 
 * - taskId: the ID of the task that needs to be deleted
 * - owner: ID of the user who is creating the task
 * Output:
 * - no response expected for this operation
 * 
 * Process: if the owner is the owner of the task, firts I delete the assignments
 *          then I can delete the task from the DB.
 **/

 exports.deleteTask = function(taskId, owner) {
  return new Promise((resolve, reject) => {
      const sql1 = "SELECT owner FROM tasks t WHERE t.id = ?";
      db.all(sql1, [taskId], (err, rows) => {
          if (err)
              reject(err);
          else if (rows.length === 0) //the task does not exist
              reject(404);
          else if(owner != rows[0].owner) {  //if owner does not the real owner of the task
              reject(403);
          }
          else {
              const sql2 = 'DELETE FROM assignments WHERE task = ?';
              db.run(sql2, [taskId], (err) => {
                  if (err)
                      reject(err);
                  else {
                      const sql3 = 'DELETE FROM tasks WHERE id = ?';
                      db.run(sql3, [taskId], (err) => {
                          if (err)
                              reject(err);
                          else
                              resolve(null);
                      })
                  }
              })
          }
      });
  });
}

/**
 * Retrieve the task having taskId as ID
 *
 * Input: 
 * - taskId: the ID of the task that needs to be retrieved
 * - owner: ID of the user who is retrieving the task
 * Output:
 * - the requested task
 * 
 **/
 exports.getTask = function(taskId, owner) {
  return new Promise((resolve, reject) => {
      const sql1 = "SELECT id as tid, description, important, private, project, deadline, completed, owner FROM tasks WHERE id = ?";
      db.all(sql1, [taskId], (err, rows) => {
          if (err)
              reject(err);
          else if (rows.length === 0)
              reject(404);
          else if (rows[0].owner == owner){
              var task = createTask(rows[0]);
              resolve(task);
          }
          else{
              const sql2 = "SELECT t.id as total FROM tasks as t, assignments as a WHERE t.id = a.task AND t.id = ? AND a.user = ? ";
              db.all(sql2, [taskId, owner], (err, rows2) => {
                  if(rows2.length === 0){
                      reject(403);
                  }
                  else{
                      var task = createTask(rows[0]);
                      resolve(task);
                  }
              });
          }
      });
  });
}

/**
 * Update a task
 *
 * Input:
 * - task: new task object
 * - taskID: the ID of the task to be updated
 * - owner: the ID of the user who wants to update the task
 * Output:
 * - no response expected for this operation
 * 
 **/
 exports.updateTask = function(task, taskId, owner) {
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
                const sql2 = 'DELETE FROM assignments WHERE task = ?';
                db.run(sql2, [taskId], (err) => {
                    if (err)
                        reject(err);
                    else {
                        var sql3 = 'UPDATE tasks SET description = ?';
                        var parameters = [task.description];
                        if(task.important != undefined){
                            sql3 = sql3.concat(', important = ?');
                            parameters.push(task.important);
                        } 
                        if(task.private != undefined){
                            sql3 = sql3.concat(', private = ?');
                            parameters.push(task.private);
                        } 
                        if(task.project != undefined){
                            sql3 = sql3.concat(', project = ?');
                            parameters.push(task.project);
                        } 
                        if(task.deadline != undefined){
                            sql3 = sql3.concat(', deadline = ?');
                            parameters.push(task.deadline);
                        } 
                        sql3 = sql3.concat(' WHERE id = ?');
                        parameters.push(task.id);

                        db.run(sql3, parameters, function(err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(null);
                            }

                        })
                    }
                })
            }
        });
    });
}



/**
 * Complete a task 
 *
 * Input:
 * - taskID: the ID of the task to be completed
 * - assignee: the ID of the user who wants to complete the task
 * Output:
 * - no response expected for this operation
 * 
 **/
 exports.completeTask = function(taskId, assignee) {
    return new Promise((resolve, reject) => {
        const sql1 = "SELECT * FROM tasks t WHERE t.id = ?";
        db.all(sql1, [taskId], (err, rows) => {
            if (err)
                reject(err);
            else if (rows.length === 0)
                reject(404);
            else {
                const sql2 = "SELECT * FROM assignments a WHERE a.user = ? AND a.task = ?";
                db.all(sql2, [assignee, taskId], (err, rows2) => {
                    if (err)
                        reject(err);
                    else if (rows2.length === 0)
                        reject(403);
                    else {
                        let sql3 = 'UPDATE tasks SET completed = 0 WHERE id = ?';
                        if(rows[0].completed == 0)
                            sql3 = 'UPDATE tasks SET completed = 1 WHERE id = ?';

                        db.run(sql3, [taskId], function(err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(null);
                            }
                        })
                    }
                })
            } 
            
        });
    });
}

/**
 * Retreve the tasks created by the user
 * 
 * Input: 
 * -req: the request of the user
 * Output:
 * - the list of owned tasks
 * 
 **/
 exports.getUserTasks = function(req) {
    return new Promise((resolve, reject) => {
        var sql =  "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline, t.completed FROM tasks as t WHERE t.owner = ?";
        var limits = getPagination(req);
        if (limits.length != 0) sql = sql + " LIMIT ?,?";
        limits.unshift(1);
        db.all(sql, limits, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let tasks = rows.map((row) => createTask(row));
                resolve(tasks);
            }
        });
    });
} 

/**
 * Retreve the tasks created by the user
 * 
 * Input: 
 * -req: the request of the user
 * Output:
 * - the list of owned tasks
 * 
 **/
 exports.getUserTasksTotal = function(req) {
    return new Promise((resolve, reject) => {
        var sql =  "SELECT * FROM tasks as t WHERE t.owner = ?";
        db.all(sql, [req.params.userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.length);
            }
        });
    });
}



/**
 * Retreve the tasks assigned to the user
 * 
 * Input: 
 * - req: the request of the user
 * Output:
 * - the list of assigned tasks
 * 
 **/
 exports.getAssignedTasks = function(req) {
    return new Promise((resolve, reject) => {
        var sql =  "SELECT t.id as tid, t.description, t.important, t.private, t.project, t.deadline,t.completed, u.id as uid, u.name, u.email FROM tasks as t, users as u, assignments as a WHERE t.id = a.task AND a.user = u.id AND u.id = ?";
        var limits = getPagination(req);
        if (limits.length != 0) sql = sql + " LIMIT ?,?";
        limits.unshift(req.user);
        db.all(sql, limits, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let tasks = rows.map((row) => createTask(row));
                resolve(tasks);
            }
        });
    });
}

/**
 * Utility functions
 */
 const getPagination = function(req) {
    var pageNo = parseInt(req.query.pageNo);
    var size = constants.OFFSET;
    var limits = [];
    if (req.query.pageNo == null) {
        pageNo = 1;
    }
    limits.push(size * (pageNo - 1));
    limits.push(size);
    return limits;
}

const createTask = function(row) {
    const importantTask = (row.important === 1) ? true : false;
    const privateTask = (row.private === 1) ? true : false;
    const completedTask = (row.completed === 1) ? true : false;
    return {id: row.tid, description: row.description, important: importantTask, private: privateTask, deadline: row.deadline, project: row.project, completed: completedTask};
}