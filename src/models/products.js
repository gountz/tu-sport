const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique : true
    },
    sub_title: {
        type: String,
        required: false
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
    },
    sub_category:{
        type: Schema.Types.ObjectId,
        ref: 'Subcategory',
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: [String],
    active: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Products', productsSchema);