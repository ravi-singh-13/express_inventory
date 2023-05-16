const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name:{type: String, required: true, maxLength: 100}
})

// virtual for category url,
CategorySchema.virtual("url").get(function(){
    return `/catalog/category/${this._id}`;
});

//export model
module.exports = mongoose.model("Category", CategorySchema);