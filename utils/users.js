const users= [];

//join user to chat
function userJoin(id, username, room){
    const user ={id, username, room};

    users.push(user);

    return user;
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id === id);  //find method in users array, for every user return the one with same id 
}

//user leaves chat remove user from users array
function userLeave(id){
    const index = users.findIndex( user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0]; // splice return the removes elements in a new array. so we need to return array[0](only elemeny in array), not array  
    }
}

// get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room)  // filter creates new array of elements that pass the condition
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};