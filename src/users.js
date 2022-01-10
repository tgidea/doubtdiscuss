const users = [];
// Join user to chat
function userJoin(id, name, room) {
  const user = { id, name, room,"date":Date.now() };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  const t=users.find(user => user.id === id);
  console.log('users.js wala ',t);
  return t;
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    const bye = (users[index]);
    // const det = users.splice(index, 1)[0];
    return bye;
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function deleteUsers(){
  let n=users.length;
  console.log(n);
  for(var i=0;i<n;i++){
    if((Date.now()-users[i].dat)>200000){
      console.log(users[i]);
      // users.splice(i, 1)[0];
    }
  }
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};