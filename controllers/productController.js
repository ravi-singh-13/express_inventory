const Product = require("../models/Product");
const Category = require("../models/Category")
const asyncHandler = require("express-async-handler");
const { body, validationResult} = require("express-validator");
const { findByIdAndRemove } = require("../models/Product");

exports.index = asyncHandler(async (req, res, next) => {
   const [categories, products] = await Promise.all([
    Category.countDocuments({}).exec(),
    Product.countDocuments({}).exec(),
   ]);
   res.render("index",{
    title: "Express Inventory",
    categories : categories,
    products : products,
   })
})

exports.product_list = asyncHandler( async (req, res, next) => {
    const allProduct = await Product.find().sort({name:1}).exec();
    
    res.render("product_list",{
        title: "Products",
        products: allProduct
    })
})

exports.product_details = asyncHandler( async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();

    res.render("product_details",{
       title: product.name,
       product: product,
    })
});

exports.product_create_get = asyncHandler( async (req, res, next) => {
    const allCategories = await Category.find().sort({name:1}).exec();
   res.render("product_form", {
    title:"New Product",
    categories: allCategories, 
   })
});

exports.product_create_post = [
    (req, res, next) => {
        if (!(req.body.category instanceof Array)){
            if (typeof req.body.category === 'undefined'){
                req.body.category = []
            }else{
                req.body.category = new Array(req.body.category)
            }
        }
                next()
    },

        body("name", "Product name must not be empty")
            .trim()
            .isLength({min:1})
            .escape(),

        body("price", "Price must not be empty") 
            .trim()
            .isLength({min:1}) 
            .escape(),
            
        body("description", "invalid description")
            .trim()
            .escape(),
            
        body("image", "invalid image URL")
            .trim()
            ,
            
        body("category.*").escape(),

    asyncHandler( async (req, res, next)=>{
        const errors = validationResult(req);

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
        });

        if (!errors.isEmpty()){
            const allCategories = await Category.find().exec();

            for(const category of allCategories){
                if(product.category.indexOf(category._id) > -1){
                    category.checked= "true";
                }
            };

            res.render("product_form", {
                title: "New Product",
                categories:allCategories,
                product: product,
                errors: errors.array()
            })
        }else{
            await product.save();
            res.redirect(product.url)
        }
    }),
] 
    


exports.product_delete_get = asyncHandler( async (req, res, next) => {
    const product = await Product.findById(req.params.id).exec();

    if(Product == null){
        res.redirect("/catalog/product")
    };

    res.render("product_delete",{
        title: "Delete Product",
        product: product,

    })
});

exports.product_delete_post = asyncHandler( async (req, res, next) => {
   await Product.findByIdAndRemove(req.params.id);

   res.redirect("/catalog/product")
});

exports.product_update_get = asyncHandler( async (req, res, next) => {
    const [product, allCategories] = await Promise.all([
        Product.findById(req.params.id).exec(),
        Category.find().exec(),
    ]);

    if(product === null){
        const err = new Error("Product not found");
        err.status = 404;
        return next(err);
    };

    for(const category of allCategories){
        if(product.category.indexOf(category._id) > -1){
            category.checked= "true";
        }
    };

    res.render("product_update", {
        title: "Update Product",
        categories:allCategories,
        product: product,
      });  

});

exports.product_update_post = [
    (req, res, next) => {
        if (!(req.body.category instanceof Array)){
            if (typeof req.body.category === 'undefined'){
                req.body.category = []
            }else{
                req.body.category = new Array(req.body.category)
            }
        }
                next()
    },

        body("name", "Product name must not be empty")
            .trim()
            .isLength({min:1})
            .escape(),

        body("price", "Price must not be empty") 
            .trim()
            .isLength({min:1}) 
            .escape(),
            
        body("description", "invalid description")
            .trim()
            .escape(),
            
        body("image", "invalid image URL")
            .trim()
            ,
            
        body("category.*").escape(),

    asyncHandler( async (req, res, next)=>{
        const errors = validationResult(req);

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
            _id: req.params.id
        });

        if (!errors.isEmpty()){
            const allCategories = await Category.find().exec();

            for(const category of allCategories){
                if(product.category.indexOf(category._id) > -1){
                    category.checked= "true";
                }
            };

            res.render("product_form", {
                title: "New Product",
                categories:allCategories,
                product: product,
                errors: errors.array()
            })
        }else{
            await Product.findByIdAndUpdate(req.params.id, product, {});
            res.redirect(product.url)
        }
    }),
]