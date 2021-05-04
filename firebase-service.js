// this is the "firebase-service.js" file...

const firebase = require("firebase/app")
require("firebase/firestore")
require("dotenv").config() // use environment variables defined in the ".env" file

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}
//console.log("FIREBASE CONFIG", firebaseConfig)

const app = firebase.initializeApp(firebaseConfig)

const db = firebase.firestore(app)

async function fetchProducts() {
    console.log("FETCHING PRODUCTS...")

    // https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#get
    const docs = await db.collection("products").get()
    console.log("DOCS:", docs.size)

    // https://googleapis.dev/nodejs/firestore/latest/QuerySnapshot.html
    // instead of returning the products as documents with separate ids and data
    // let's create a single object with both the id and the data
    // to make them easier to process and loop through later
    var products = []
    docs.forEach((doc) => {
        //console.log("DOC ID:", doc.id, "DATA", doc.data())
        var product = doc.data() // create a new object with the product info
        product["id"] = doc.id // merge the id with the object
        products.push(product)
    })
    //console.log("PRODUCTS:", products.length)
    return products
}

async function createOrder(newOrder) {
    //
    // FYI: newOrder param should look like:
    //
    // {
    //   "userEmail": "hello@example.com",
    //   "productID": "klmnopq",
    //   "quantity": 2,
    //   "totalPrice": 6.99
    // }
    //
    newOrder["timestamp"] = parseInt(Date.now().toFixed())
    console.log("NEW ORDER:", newOrder)

    // see: https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html
    var ordersRef = db.collection("orders")

    // see: https://firebase.google.com/docs/database/admin/save-data
    await ordersRef.add(newOrder)

    return newOrder
}

module.exports = {firebaseConfig, app, db, fetchProducts, createOrder}