const express = require('express');   //server
const mongoose = require('mongoose');
const myRouter = require('./routes/index');
require('dotenv').config();

// set env
const keys = require('./config/index')

mongoose.connect(keys.mongo_uri , {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(()=> console.log(`connected to ${keys.mongo_uri}`))
    .catch(console.log)

const app = express();
app.use(express.json());  //middleware parse body data to JSON
app.use(express.urlencoded({ extended: false }))

app.use('/', express.static('./public'))
app.use('/docs', require('./routes/docs'))

app.use('/api', myRouter);  //localhost:9000/ --> goi myRouter = routes/index.js
// serve static folder
app.use('/uploads', express.static('./uploads'))

const port = process.env.PORT || keys.port;
app.listen(port, ()=> {
    console.log(`Server runing on port ${port}`);
})

