const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const  { courses, students } = require('./database');

//Root
router.get('/', (req, res) => {
    res.send('server is up and running');
});

//Courses
router.post('/course', bodyParser.json(), async (req, res) => {
    try {
        const result = await courses.creauuteCourse(req.body);
        res.send(result);
    } catch(error) {
        res.send(error);
    }
});

router.get('/course', async (req, res) => {
    try {
        const result = await courses.getCourseList();
        
        res.send(result);
    } catch(error) {
        console.log("Error in get course:", error)
        res.send(error);
    }
});

router.get('/course/:id', async (req, res) => {
    try {
        const result = await courses.getCourseById(req.params.id);
        
        res.send(result.length > 0 ? result[0] : {});
    } catch(error) {
        res.send(error);
    }
});

router.put('/course/:id', bodyParser.json(), async (req, res) => {
    try {
        const result = await courses.updateCourse(req.params.id, req.body);
        
        res.send(result);
    } catch(error) {
        res.send(error);
    }
});

//Students
router.post('/student', bodyParser.json(), async (req, res) => {
    try {
        const result = await students.createStudent(req.body);
        res.send(result);
    } catch(error) {
        console.log("Error in post student:", error)
        res.send(error);
    }
})

router.put('/student/:id', bodyParser.json(), async (req, res) => {
    try {
        const result = await students.updateStudent(req.params.id, req.body);
        
        res.send(result);
    } catch(error) {
        console.log("Error in put student:", error)
        res.send(error);
    }
})

module.exports = router;