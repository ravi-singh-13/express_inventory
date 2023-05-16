const Category = require("../models/Category");
const Product = require("../models/Product")
const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

exports.category_list=asyncHandler( async (req, res, next) => {
    const allCategories = await Category.find().sort({name:1}).exec();
    
    res.render("category_list",{
        title: "Category",
        categories: allCategories
    })
});

exports.category_details = asyncHandler( async (req, res, next) => {
    const category = await Category.findById(req.params.id)
    .exec();

    res.render("category_details",{
       title: category.name,
       category:category      
    })
});

exports.category_create_get = asyncHandler( async (req, res, next) => {
   res.render("category_form", {
    title: "New Product"
   })
});

exports.category_create_post = [
    body("name", "invalid name").trim().isLength({min:1}).escape(),

    asyncHandler( async (req, res, next)=>{
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
        });

        if (!errors.isEmpty()){
            res.render("category_form", {
                title: "New Category",
                category: category,
                errors :errors.array(),
            })
        }else{
            await category.save();
            res.redirect(category.url)
        }
    }),
]

exports.category_delete_get = asyncHandler( async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    if(category == null){
        res.redirect("/catalog/product")
    };

    res.render("category_delete",{
        title: "Delete Category",
        category: category,

    })
});

exports.category_delete_post = asyncHandler( async (req, res, next) => {
    const allProduct = await Product.find({category: req.params.id}).exec();
    const category = await Category.findById(req.params.id).exec();

    if(allProduct.length > 0 ){
         res.render("category_delete",{
        title: "Delete Category",
        allProduct: allProduct,
        category: category,
    })
    return;
    }else{
        await Category.findByIdAndRemove(req.params.id);
        res.redirect("/catalog/category")
    }  
});

exports.category_update_get = asyncHandler( async (req, res, next) => {
    const category = await  Category.findById(req.params.id).exec();
    

    if(category === null){
        const err = new Error("category not found");
        err.status = 404;
        return next(err);
    };


    res.render("category_update", {
        title: "Update Product",
        category: category
        
      }); 
});

exports.category_update_post = [
    body("name", "invalid name").trim().isLength({min:1}).escape(),

    asyncHandler( async (req, res, next)=>{
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            _id: req.params.id,
        });

        if (!errors.isEmpty()){
            res.render("category_form", {
                title: "New Category",
                category: category,
                errors :errors.array(),
            })
        }else{
            await Category.findByIdAndUpdate(req.params.id, category, {});
            res.redirect(category.url)
        }
    }),
]