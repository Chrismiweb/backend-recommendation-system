const express = require('express');
const router = require('./routes/handler');
const connectDb = require('./database/connectDB');
const app = express();
const port = 1050;
const cors = require('cors')


// exxpress to json
app.use(express.json())
app.use("/", router)

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.get('/', (req, res)=>(
    console.log("app is running fine ")
    
))

 app.listen(port, async()=>{
    console.log(`server is running on port ${port}`);
    await connectDb(`database is currently running on ${port}`)
    
 });