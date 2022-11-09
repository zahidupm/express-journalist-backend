const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('colors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vggwpnk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnect() {
    try {
        await client.connect();
        console.log('Database connected'.yellow.italic);

    } catch (error) {
        console.log(error.name.red, error.message, error.stack);
    }
}   

dbConnect();

const Product = client.db('expressJournalist').collection('services');
const User = client.db('expressJournalist').collection('reviews');

// review ====
// data transfer
app.post('/reviews', async (req, res) => {
    try {
        const result = await User.insertOne(req.body);
        // console.log(result);

        if(result.insertedId) {
            res.send({
                success: true,
                message: `Successfully created the ${req.body.title} with id ${result.insertedId}`
            })
        }
    } catch (error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
})

// get the data
app.get('/reviews', async (req, res) => {
    try {
        let query = {};
        if(req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = User.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);

    } catch(error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
})

app.delete('/reviews/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await User.deleteOne(query);
        res.send(result);
    } catch(error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
})

// data mongodb theke pawar jonno
app.get('/services', async (req, res) => {
    try {
        const query = {};
        const cursor = Product.find(query);
        const services = await cursor.toArray();
        res.send(services);
    } catch (error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
})

// data transfer
app.post('/services', async (req, res) => {
    try {
        const result = await Product.insertOne(req.body);
        // console.log(result);

        if(result.insertedId) {
            res.send({
                success: true,
                message: `Successfully created the ${req.body.title} with id ${result.insertedId}`
            })
        }
    } catch (error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            message: error.message
        })
    }
})

// single service
app.get('/service/:id', async (req, res) => {
    try {
        const id  = req.params;
        const product = await Product.findOne({ _id: ObjectId(id) });
        res.send(product)
    } catch (error) {
        console.log(error.name.red, error.message.bold);
        res.send({
            success: false,
            error: error.message
        })
    }
})


app.get('/', (req, res) => {
    res.send('Journalist service server is running')
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})
