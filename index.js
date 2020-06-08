const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const { courses } = require('./database');

const { addUser, removeUser, getUser, getUsersInRoom, getOfflineStudents } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }, callback) => {

        async function getCourse(room) {

            try {
                const result = await courses.getCourseById(room);
                const course = (result.length > 0 ? result[0] : {});
                const { error, user } = addUser({ id: socket.id, name, courseID: room, course: course });

                if (error) return callback(error);

                socket.join(user.courseID);
                socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${course.Name}` });
                io.to(user.courseID).emit('roomData', { room: course.Name, onlineStudents: getUsersInRoom(user.courseID), offlineStudents: getOfflineStudents(course) });

                socket.broadcast.to(user.courseID).emit('message', { user: 'admin', text: `${user.name}, has joined!` });
            } catch (error) {
                console.log("Socket Connection Error on getCourse: ", error);
                callback(error);
            }
        }
        
        getCourse(room);

    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.courseID).emit('message', { user: user.name, text: message });
        io.to(user.courseID).emit('roomData', { user: user.courseID, users: getUsersInRoom(user.courseID) });

        callback();
});

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.courseID).emit('message', { user: 'admin', text: `${user.name} has left.` })
        }
        console.log('User had left!');
    })
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));