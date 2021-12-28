const BASEURL = '/api/'

//GET all public tasks
const getPublicTasks = async (next) => {
    return new Promise((resolve, reject) => {
      const url = next ? ('/api/tasks/public?pageNo=' + next) : ('/api/tasks/public')
      fetch(url, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }) 
      .then((res) => {
        if (!res.ok) {
          const error = new Error(`${res.status}: ${res.statusText}`);
          error.response = res;
          throw error;
        }
        resolve(res.json());
      })
        .catch((err) => {
          reject({ message: err.message });
        });
    });
  }


//GET all task of a user
const getUserTasks = async (next, userId) => {
  return new Promise((resolve, reject) => {
    const url = next ? ('/api/users/' + userId + '/tasks/created?pageNo=' + next) : ('/api/users/' + userId + '/tasks/created')
    fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(res.json());
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

//GET a task
const getTask = async (taskId) => {
  return new Promise((resolve, reject) => {
    fetch('/api/tasks/' + taskId, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(res.json());
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

//POST add a new task
const addTask = async (task) => {
  return new Promise((resolve, reject) => {
    fetch('/api/tasks', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(task)
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(res.json());
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

//PUT update a task
const updateTask = async (task) => {
  return new Promise((resolve, reject) => {
    fetch('/api/tasks/' + task.id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(task)
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(null);
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}
  
//DELETE delete a task
const deleteTask = async (taskId) => {
  return new Promise((resolve, reject) => {
    fetch('/api/tasks/' + taskId, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      }
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(null);
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

//PUT complete a task
const completeTask = async (taskId) => {
  return new Promise((resolve, reject) => {
    fetch('/api/tasks/' + taskId + '/completion', {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      }
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(null);
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

//GET retrieve all users assigned to a particular task
const getUsersAssigned = async (taskId) => {
  return new Promise((resolve, reject) => {
    fetch('/api/tasks/' + taskId + '/assignees', {
      method: "GET",
      headers: {
        "content-type": "application/json",
      }
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(res.json());
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

//DELETE retrieve all users assigned to a particular task
const removeUser = async (taskId, userId) => {
  return new Promise((resolve, reject) => {
    fetch('/api/tasks/' + taskId + '/assignees/' + userId, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      }
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      } 
      resolve();
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

//GET all users
const getUsers = async () => {
  return new Promise((resolve, reject) => {
    fetch('/api/users/', {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(res.json());
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

//POST assign a task to a user
const assignTaskToUser = async (taskId, user) => {
  return new Promise((resolve, reject) => {
    fetch('/api/tasks/' + taskId + '/assignees', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user)
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(null);
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}


//GET retrieve assigned task of a user
const getAssignedTasks = async (next, userId) => {
  return new Promise((resolve, reject) => {
    const url = next ? ('/api/users/' + userId + '/tasks/assigned?pageNo=' + next) : ('/api/users/' + userId + '/tasks/assigned')
    fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }) 
    .then((res) => {
      if (!res.ok) {
        const error = new Error(`${res.status}: ${res.statusText}`);
        error.response = res;
        throw error;
      }
      resolve(res.json());
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}

async function logIn(credentials) {
    const type = "login"
    let response = await fetch('/api/users/authenticator/' + type, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  
  async function logOut() {
    const type = "logout"
    let response = await fetch('/api/users/authenticator/' + type, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }    
    });
    if(response.ok) {
      return null;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  
  
  async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server, mostly unauthenticated user
    }
  }

const API = { getPublicTasks, getUserTasks, addTask, deleteTask, updateTask, completeTask, getUsersAssigned, removeUser, getUsers, assignTaskToUser, getAssignedTasks, getUserInfo, logIn, logOut };
export default API;