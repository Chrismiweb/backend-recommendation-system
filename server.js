const express = require('express');
const rateLimit = require('express-rate-limit')
const router = require('./routes/handler');
const connectDb = require('./database/connectDB');
const app = express();
// const port = 1050;
const cors = require('cors')

const port = process.env.PORT || 1050;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const limiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 24 hours
	limit: 3, // limit to 3 request per users.: 
    message: "You've used your daily request, try again after 24 hours "  // messae
	
})

app.use('/recommendation', limiter )


app.use(cors(corsOptions))
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