const express = require("express");
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.achcrxa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const placeCollection = client.db('placeDB').collection('place');
        const countryCollection = client.db('placeDB').collection('country');

        app.get('/place', async (req, res) => {
            const cursor = placeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/country', async (req, res) => {
            const cursor = countryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/myList/:email', async (req, res) => {
            const cursor = placeCollection.find({ email: req.params.email });
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/addPlace', async (req, res) => {
            const newPlace = req.body;
            console.log(newPlace);
            const result = await placeCollection.insertOne(newPlace);
            res.send(result)
        })

        app.get('/place/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await placeCollection.findOne(query);
            res.send(result)
        })



        app.put('/place/:id', async (req, res) => {
            const id = req.params.id;
            const fillter = { _id: new ObjectId(id) }
            const option = { upsert: true };
            const updatedPlace = req.body;
            const place = {
                $set: {
                    image: updatedPlace.image,
                    country_Name: updatedPlace.country,
                    spot: updatedPlace.spot,
                    location: updatedPlace.location,
                    description: updatedPlace.description,
                    average_cost: updatedPlace.average_cost,
                    season: updatedPlace.season,
                    time: updatedPlace.time,
                    visitor: updatedPlace.visitor
                }
            }

            const result = await placeCollection.updateOne(fillter, place, option);
            res.send(result)
        })

        app.delete('/place/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await placeCollection.deleteOne(query);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('coffee making server is running')
})

app.listen(port, () => {
    console.log(`coffee making server is running on port: ${port}`)
}
)
