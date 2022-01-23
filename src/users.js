const users = [];
let userlimit={};
// Join user to chat
function userJoin(id, name, room) {
  const user = { id, name, room,"date":Date.now() };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id) {
  const t=users.find(user => user.id === id);
  // console.log('users.js wala ',t);
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

function limitId(id){
  if(userlimit[`${id}`]==undefined){
    userlimit[`${id}`]=Date.now();
    return true;
  }
  else{
    let tim=userlimit[`${id}`];
    if(Date.now()-tim<400){
      userlimit[`${id}`]=Date.now();
      return false;
    }
    else{
      userlimit[`${id}`]=Date.now();
    }
  }
  return true;
}

function clearLimit(){
  setTimeout(function(){
    userlimit={};
    clearLimit();
  },3600000);
}
clearLimit();
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  limitId
};