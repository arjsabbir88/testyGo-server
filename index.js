const express = require("express");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://tastygo-8d15.vercel.app',"http://localhost:3000"], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
};

app.use(cors(corsOptions));
app.use(express.json());


const uri = process.env.MONGO_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db("myDB");
    itemsCollection = db.collection("items");

    const userCollection = db.collection("users");

    //    add new items
    app.post("/add-items", async (req, res) => {
      try {
        const item = req.body;
        const result = await itemsCollection.insertOne(item);
        res.status(201).send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to insert item" });
      }
    });

    //get all the items

    app.get("/items", async (req, res) => {
      try {
        const items = await itemsCollection.find().toArray();
        res.status(200).send(items);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch items" });
      }
    });

    app.get("/items/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const item = await itemsCollection.findOne({ _id: new ObjectId(id) });
        if (!item) {
          return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch item" });
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const { email } = user;

        const existing = await userCollection.findOne({ email });

        if (existing) {
          return NextResponse.json(
            { message: "User already exists" },
            { status: 400 }
          );
        }

        const result = await userCollection.insertOne(user);
        res.status(201).send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to insert user" });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
