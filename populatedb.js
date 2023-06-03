#! /usr/bin/env node

console.log(
    'This script populates some test product and bocategory to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Category = require("./models/category");
  const Product = require("./models/product");

  
  const categories = [];
  const products = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategory();
    await createProduct();
  
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function categoryCreate(name) {
    const category = new Category({ name: name });
    await category.save();
    categories.push(category);
    console.log(`Added category: ${name}`);
  }
  
  async function productCreate(name, price, description, image, category) {
    authordetail = { name: name, price: price,  };
    if (description != false) authordetail.description = description;
    if (image != false) authordetail.image = image;
    if (category != false) authordetail.category = category;
    
  
    const product = new Product(authordetail);
  
    await product.save();
    products.push(product);
    console.log(`Added author: ${name} ${price}`);
  }
  
  
  
  
  
  async function createCategory() {
    console.log("Adding category");
    await Promise.all([
      categoryCreate("kichen"),
      categoryCreate("office"),
      categoryCreate("cloth"),
    
    ]);
  }
  
  async function createProduct() {
    console.log("Adding authors");
    await Promise.all([
      productCreate("Knife", 42.3, "stainless steel knife", "https://www.shutterstock.com/image-photo/sharp-not-touch-chefs-kitchen-knife-1281029980",[categories[0]]),
      productCreate("Noteook", 44,"", "", [categories[1]]),
      productCreate("Cricket bat", 456, "used cricket bat", "", []),
      productCreate("Pant", 300, "premium quality pant for summer", "", [categories[2]]),
      productCreate("toy", 585 , "dummy bear for dog", "", []),
    ]);
  }
  
 
