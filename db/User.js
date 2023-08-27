const fs = require('fs');
const {hashSync} = require("bcrypt");
const path = process.cwd() + "/static/userDetails.json"
const usersData = require(path);

exports.saveUser = (username, password) => {
    const _id = usersData[usersData.length - 1]._id + 1;
    const newUser = {_id, username, password : hashSync(password, 10)}
    usersData.push(newUser);
    fs.writeFileSync(path, JSON.stringify(usersData));
}

exports.findOneByUsername = (username) => {
    if (!username) return {error: "Undefined Username"}
    return usersData.find(user => user.username === username);
}

exports.findById = (id) => {
    return usersData.find(user => user._id === id);
}
