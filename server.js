const express = require('express');
const router = require('./routes/handler');
const connectDb = require('./database/connectDB');
const app = express();
const port = 1050;


// exxpress to json
app.use(express.json())
app.use("/", router)


app.get('/', (req, res)=>(
    console.log("app is running fine ")
    
))

 app.listen(port, async()=>{
    console.log(`server is running on port ${port}`);
    await connectDb(`database is currently running on ${port}`)
    
 });