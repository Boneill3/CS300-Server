const { MongoClient, ObjectID } = require('mongodb');

function db() {
    const url = 'mongodb://localhost:27017'
    const dbName = 'schoolChat'

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

                let courses = db.collection('courses').find();

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

                let course = db.collection('courses').findOne({ _id: ObjectID(id) });

                resolve(await course);
                client.close();
            } catch (error) {
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

                const updatedCourse = await db.collection('courses')
                    .findOneAndReplace({ _id: ObjectID(id) }, newCourse, { returnOriginal: false });

                resolve(updatedCourse.value);
                client.close();
            } catch (error) {
                client.close();
                reject(error);
            }
        });

    }

    return { getCourseList, createCourse, getCourseById, updateCourse }
}



module.exports = db();