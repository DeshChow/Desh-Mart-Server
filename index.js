const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;

require('dotenv').config()

//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kceb4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l8znv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors());

app.use(fileUpload());


const port = 5000;


app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const productCollection = client.db("DeshMart").collection("womensdressProducts");


    app.post('/addProducts', (req, res) => {
        console.log(req.body);
        console.log(req.files.file);


        const file = req.files.file;
        const name = req.body.name;
        const price = req.body.price;
        const brand = req.body.brand;
        const color = req.body.color;
        const madeIn = req.body.madeIn;
        const quantity = req.body.quantity;
        const itemDetails = req.body.itemDetails;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        console.log(1, req.body.category);

        client.db("DeshMart").collection(req.body.category).insertOne({ name, brand, color, madeIn, quantity, price, itemDetails, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });

    /* app.get('/womensdressProducts',(req,res)=>
     {
            productCollection.find({})
            .toArray((err,documents)=>
            {
                res.send(documents);
            }) 
     })*/

    app.get('/products/:key', (req, res) => {
        const Collection = req.params.key;

        console.log(Collection);

        client.db("DeshMart").collection(Collection).find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/products/:key', (req, res) => {
        const Collection = req.params.key;

        console.log(Collection);

        client.db("DeshMart").collection(Collection).find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:_id/:category', (req, res) => {

        const category = req.params.category;

        const _id = req.params._id;

        const ID = ObjectID(_id);

        console.log(typeof (ID), ID);


        client.db("DeshMart").collection(category).find({ _id: ID })
            .toArray((err, documents) => {

                console.log(documents[0]);
                res.send(documents[0]);
            })









    })

    app.delete('/delete/:id/:category', (req, res) => {

        client.db("DeshMart").collection(req.params.category).deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    app.patch('/updateProduct', (req, res) => {
        client.db("DeshMart").collection(req.body.category).updateOne({ _id: ObjectID(req.body.id) },
            {
                $set: { price: req.body.price }
            })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })

    app.post('/orderSave', (req, res) => {
        console.log(req.body);

        client.db("DeshMart").collection('orders').insertOne(req.body)
            .then(result => {
                client.db("DeshMart").collection('orderHistory').insertOne(req.body)
                    .then(result => {
                        res.send(result.insertedCount > 0);
                    })
            })


    })

    app.get('/orders', (req, res) => {


          //console.log('hamaisi');
        client.db("DeshMart").collection('orders').find({})
        .toArray((err, documents) => {

           // console.log((documents));
            res.send(documents);
        })

    })
    app.get('/orderHistory', (req, res) => {


      //  console.log('hamaisi');
      client.db("DeshMart").collection('orderHistory').find({})
      .toArray((err, documents) => {

         // console.log((documents));
          res.send(documents);
      })

      app.delete('/deleteOrder/:collection/:_id', (req, res) => {

        client.db("DeshMart").collection(req.params.collection).deleteOne({ _id: ObjectID(req.params._id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

  })




    console.log('db connected');
});


app.listen(process.env.PORT || port)
