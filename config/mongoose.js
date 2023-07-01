const mongoose=require("mongoose");

const env=require('./environment');

// mongoose.connect(`mongodb://0.0.0.0:27017/${env.db}`)
// mongoose.connect('mongodb://localhost:27017/Manual_Authenction')
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to MongoDB"));

db.once('open',function(){
    console.log("Connected to database Mongodb");
})

module.exports=db;