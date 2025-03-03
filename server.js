const express = require('express');
const app = express();
const port = 1050;


app.get('/', (req, res)=>(
    console.log("app is running fine ")
    
))

 app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
    
 });