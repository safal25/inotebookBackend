const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const MongoURI=process.env.MONGO_URI;

const connectToMongo = ( )=>{
    mongoose.connect(MongoURI,()=>{
        console.log('connected to mongo db atlas');
    })
}

module.exports=connectToMongo;
