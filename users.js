const users = [];
const db = require('./database');

const addUser = ({ id, name, courseID }) => {
    name = name.trim().toLowerCase();
    courseID = courseID.trim().toLowerCase();

    const existingUser = users.find((user) => user.courseID === courseID && user.name === name);

    if(existingUser) {
        return { error: 'Username is taken' }
    }

    const user = {id, name, courseID};

    users.push(user);

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (courseID) => users.filter((user) => user.courseID === courseID);

function getOfflineStudents(course) {
    const online = getUsersInRoom(course._id.toString().trim().toLowerCase());
    return course.Students.filter((student) => online.findIndex((onlineStudent) => onlineStudent.name == student.name.toLowerCase()) == -1);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getOfflineStudents }