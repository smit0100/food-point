const { Schema, default: mongoose } = require("mongoose")

const Category = new Schema({
    name: {
        type:String
    },
    description:{
        type:String,
    },
    isActive: {
        type: Boolean,
        default:true
    },
    subCategory: [
        {
            type: mongoose.Types.ObjectId,
            ref:"SubCategory"
        }
    ],
    product: [{
        type: mongoose.Types.ObjectId,
        ref:'Product'
    }]
   
})

module.exports = mongoose.model('Category', Category);
