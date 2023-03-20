const express = require('express')
const app=express()
const cors=require('cors')
const paymentRoute=require('./paymentRoute')
const bodyParser=require('body-parser')


const port=60
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api', paymentRoute);
app.listen(port,()=>{
    console.log(`Server running at ${port}`)
})
app.get('/', (req, res) => {
    res.send('Server working')
})