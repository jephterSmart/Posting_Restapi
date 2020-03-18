const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer')
const uuidv4 = require('uuid/v4');
const helmet = require('helmet');
const cors = require('cors')


const feedRoute = require('./routes/feed')
const authRoute = require('./routes/auth')

const app = express();
const fileStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './images/')
    },
    filename: function(req,file,cb) {
        
        cb(null, uuidv4() + '-'+ file.originalname);
    }
})

const fileFilter = function(req,file,cb) {
    
    if(file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' ||
     file.mimetype === 'image/jpeg'){
         cb(null,true)
     }
     else cb(null,false)
}


app.use(bodyParser.json());
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
//  app.use(helmet());

app.use('/images',express.static(path.join(__dirname,'images')));


app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*')//who will access my resources
    res.setHeader('Access-Control-Allow-Methods','GET, PUT, PATCH, POST, DELETE, OPTIONS')//which method will be used to access my resources
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')//which headers will be used to access my resources
    next();
})
app.options('*',cors())
app.use((req,res,next) => {
    if(req.method === "OPTIONS")
    res.sendStatus(200);
    else next();
})
app.use('/feed',feedRoute);
app.use('/auth',authRoute);

app.use((error,req,res,next) =>{
    const message = error.message;
    const status = error.statusCode || 500;
    console.log(error);
    res.status(status).json({
        message: message,
        error:error.errors
    });
})
mongoose.connect(process.env.MONGO_URI,
{useNewUrlParser: true})
.then(result => {
   
 const server = app.listen(process.env.PORT || 8080)
const io = require('./socket').init(server);
io.on('connection', socket =>{
    
    
})
    })
.catch(err =>{
    throw err
    
})
