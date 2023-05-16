const mongoose = require("mongoose");

 
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name:{type: String, require:true, maxLength: 100},
    price:{type: Number, require:true},
    description:{type: String, maxLength:250},
    image:{type:String, },
    category:[{type:Schema.Types.ObjectId, ref:"Category"}]
})

// Virtual for Product url.
ProductSchema.virtual("url").get(function(){
    return `/catalog/product/${this._id}` ;
});

//export model
module.exports = mongoose.model("Product", ProductSchema);
