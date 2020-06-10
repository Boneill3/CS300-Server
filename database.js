const { MongoClient, ObjectID } = require('mongodb');

    const url = 'mongodb://localhost:27017'
    const dbName = 'schoolChat'

function courses() {

    //Course Functions
    //Create a new course
    function createCourse(course) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try {
                await client.connect();
                const db = client.db(dbName);

                const addedCourse = await db.collection('courses').insertOne(course);

                resolve(addedCourse.ops[0]);
                client.close();

            } catch (error) {
                client.close();
                console.log("Error creating course", error)
                reject(error);
            }
        });
    }

    //get list returns a list of all classes
    function getCourseList() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try {
                await client.connect();
                const db = client.db(dbName);

                let courses = db.collection('courses').aggregate([
                    { $lookup: { from: "students", localField: "Students", foreignField: "_id", as: "students"}}
                ]);

                resolve(await courses.toArray());
                client.close();
            } catch (error) {
                client.close();
                reject(error);
            }
        });

    }

    //get list returns a list of all classes
    function getCourseById(id) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try {
                await client.connect();
                const db = client.db(dbName);

                const course = db.collection('courses').aggregate([
                    { $match: { _id: id }},
                    { $lookup: { from: "students", localField: "Students", foreignField: "_id", as: "students"}},
                    { $limit: 1 }
                ]).toArray();

                resolve(await course);
                client.close();
            } catch (error) {
                console.log("Get Course By ID error:", error);
                client.close();
                reject(error);
            }
        });

    }

    //Update a single Couse
    function updateCourse(id, newCourse) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try {
                await client.connect();
                const db = client.db(dbName);
                const originalCourse = await db.collection('courses').findOne({ _id: newCourse._id});
                console.log("ORIGINAL", originalCourse);

                newCourse.Students = originalCourse.Students;

                const updatedCourse = await db.collection('courses')
                    .findOneAndReplace({ _id: id }, newCourse, { returnOriginal: false });

                resolve(updatedCourse.value);
                client.close();
            } catch (error) {
                client.close();
                reject(error);
            }
        });

    }

    function addMessage(user, message) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try {
                await client.connect();
                const db = client.db(dbName);

                const updatedCourse = await db.collection('courses')
                    .updateOne({ _id: user.courseID }, { $push: { messages: message }}, { returnOriginal: false });

                resolve(updatedCourse.value);
                client.close();
            } catch (error) {
                client.close();
                reject(error);
            }
        }); 
    }

    return { getCourseList, createCourse, getCourseById, updateCourse, addMessage }
}

function students () {

    //Create a new student
    function createStudent(student) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try {
                await client.connect();
                const db = client.db(dbName);

                const addedStudent = await db.collection('students').insertOne(student);

                resolve(addedStudent.ops[0]);
                client.close();

            } catch (error) {
                client.close();
                reject(error);
            }
        });
    } 

    //Create a new student
    function updateStudent(id, newStudent) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try {
                await client.connect();
                const db = client.db(dbName);

                //Remove existing course connections
                result = await db.collection('courses').updateMany( {}, {$pull: { Students: ObjectID(id)}}, { multi: true});

                const updatedStudent = await db.collection('students')
                    .findOneAndReplace({ _id: ObjectID(id) }, newStudent, { returnOriginal: false });

                //Add current course connections
                for(course of newStudent.courses)
                {
                    await db.collection('courses').updateOne( {_id: course}, { $push: { Students: new ObjectID(id) }});
                }

                resolve(updatedStudent.value);
                client.close();

            } catch (error) {
                client.close();
                reject(error);
            }
        });
    } 

    //Get List of all students
    function getStudents() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try {
                await client.connect();
                const db = client.db(dbName);

                let students = db.collection('students').find();

                resolve(await students.toArray());
                client.close();
            } catch (error) {
                client.close();
                reject(error);
            }
        });
    } 

    return {createStudent, updateStudent, getStudents}
}

module.exports = { courses: courses(), students: students() }