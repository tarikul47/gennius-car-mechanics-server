const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// dbUser
// tJRyuWBhr3i5FGL1


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dyvua.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run(){
    try{
        await client.connect();
        console.log('Conected to database');
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET Single Service 
        app.get('/services/:id', async( req, res) => {
            const id = req.params.id;
            console.log('getting sinlge id', id);
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API 
        app.post('/services', async(req, res) => {

            console.log('Hitting the post api', req.body);
            const service =  req.body;
            const result = await servicesCollection.insertOne(service);
            //console.log(result);
            res.json(result);
            
        });

        // DELETE API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.deleteOne(query);
            res.json(service);
        })
    }
    finally{
       // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res)=> {
    res.send('Running Genius Service');
});

app.get('/hello', (req, res)=> {
    res.send('hello I am running');
});

app.listen(port, () => {
    console.log('Running Genius Server on', port);
});