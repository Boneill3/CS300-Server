const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./database')

//Root
router.get('/', (req, res) => {
    res.send('server is up and running');
});

//Courses
router.post('/course', bodyParser.json(), async (req, res) => {
    try {
        const result = await db.createCourse(req.body);
        res.send(result);
    } catch(error) {
        res.send(error);
    }
});

router.get('/course', async (req, res) => {
    try {
        const result = await db.getCourseList();
        
        res.send(result);
    } catch(error) {
        res.send(error);
    }
});

router.get('/course/:id', async (req, res) => {
    try {
        const result = await db.getCourseById(req.params.id);
        
        res.send(result);
    } catch(error) {
        res.send(error);
    }
});

router.put('/course/:id', bodyParser.json(), async (req, res) => {
    try {
        const result = await db.updateCourse(req.params.id, req.body);
        
        res.send(result);
    } catch(error) {
        res.send(error);
    }
});


module.exports = router;