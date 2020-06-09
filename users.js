const users = [];

const addUser = ({ id, name, courseID, course }) => {
    const existingUser = users.find((user) => user.courseID === courseID && user.name === name);

    if(existingUser) {
        return { error: 'Username is taken' }
    }

    validStudent = course.students.filter(student => student.name == name);
    if(validStudent.length == 0) {
        console.log(`Access Denied for ${name} in ${course._id}`);
        return { error: 'User does not have access to this class' }
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
    const online = getUsersInRoom(course._id);
    return course.students.filter((student) => online.findIndex((onlineStudent) => onlineStudent.name == student.name) == -1);
}

function testUsers(){
    return users;
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getOfflineStudents, testUsers }