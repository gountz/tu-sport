const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique : true
    },
    sub_c : [
        {
            sub_category: {
                type: Schema.Types.ObjectId,
                ref: 'Subcategory',
            }
        }
    ]       
});


module.exports = mongoose.model('Category', categorySchema);