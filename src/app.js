const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userController = require('./controllers/users');
const productsController = require('./controllers/products');
const categoryController = require('./controllers/category');
const subCategoryController = require('./controllers/sub_category');
const emailController = require('./controllers/email');
const cors = require('cors')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api-rest/users',  userController);
app.use('/api-rest/products', productsController);
app.use('/api-rest/category',  categoryController);
app.use('/api-rest/sub_category',  subCategoryController);
app.use('/api-rest/email', emailController);

mongoose.connect(process.env.MONGO_URI)
    .then( () => {
        console.log("Se a conectado a la base de datos")
    })
    .catch( (err => {
        console.log('error' + err);
    }))

app.listen(process.env.PORT || 3000)