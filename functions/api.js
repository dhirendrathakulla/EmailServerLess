const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const axios = require("axios").default;
const NodeCache = require('node-cache');


const app = express();
const cacheStrore = new NodeCache( { stdTTL: 24 * 60 * 60 } ); // 24 hours 

const path = require("path");
const dotenv = require("dotenv");
if(!process.env.MYEMAIL)
dotenv.config({ path: path.join(__dirname, "../.env") });
const serverless = require("serverless-http");
const router = express.Router()

// const db = require("faunadb");
const email = require("./email");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "https://dhirendrathakulla.com.np"}));
// app.set("port", PORT);

function setEmailCountToCache(email) {
    let count =1;
    if(cacheStrore.get(email)) {
      count = parseInt(cacheStrore.get(email));
      count++;
    }
    cacheStrore.set(email, count);
}

function getEmailCountFromCache(email) {
  
  if(cacheStrore.get(email)) {
    return parseInt(cacheStrore.get(email));
  }
  return 0;
}

router.get("/", async (req, res) => {
    res.send("welcome");
  });
  
  router.post("/send-email", async (req, res,next) => {

    if(!req.body || !req.body.email || !req.body.message){
       return res.status(400).send({message:"Email and message is required !!"})
    }
    setEmailCountToCache(req.body.email)
    if(getEmailCountFromCache(req.body.email) > 5) {
        return  res.status(200).send({status: 429,message:"Email send already !!"});
    };
   const resp = await email.sendEmail(req.body)
    return res.status(200).send({status: 200,data: resp});
  });
// var client = new db.Client({ secret: 'YOUR_FAUNADB_SECRET' })
// 
// app.listen(2000, () => {
  
app.use("/.netlify/functions/api",router)

//   console.log(`Example app listening on port ${PORT}`);
// });
module.exports.handler = serverless(app)