const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const dishExists = (req, res, next) => {
    const dishId = req.params.dishId;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    const error = new Error(`Dish id not found: ${dishId}`);
    error.status = 404;
    next(error);
};

// Middleware to validate dish
const validateDish = (req, res, next) => {
    const { data: { name, description, image_url, price, id } = {} } = req.body;
    if (!name) {
        return next({ status: 400, message: "Dish must include a name" });
    }
    if (!description) {
        return next({ status: 400, message: "Dish must include a description" });
    }
    if (!image_url) {
        return next({ status: 400, message: "Dish must include an image_url" });
    }
    if (price === undefined || typeof price !== "number" || price <= 0) {
        return next({ status: 400, message: "Dish must have a price that is greater than 0" });
    }
    return next();
};

// Controller functions
function createDish(req, res, next) {
    const { data: { name, description, image_url, price, id } = {} } = req.body;
    const newDish = { id: nextId(), name, description, image_url, price };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

const readDish = (req, res) => {
    res.json({ data: res.locals.dish });
};

const updateDish = (req, res, next) => {
    const { data: { name, description, image_url, price, id } = {} } = req.body;
    const dish = res.locals.dish;
    if (id!=undefined && id!="" && dish.id != id){
        return next({ status: 400, message: "Dish id wrong"+dish.id+id });
    }
    dish.name = name;
    dish.description = description;
    dish.image_url = image_url;
    dish.price = price;
    res.json({ data: dish });
};

const listDishes = (req, res) => {
    res.json({ data: dishes });
};

const deleteDish = (req, res, next) => {
    return next({ status: 405, message: "not allowed" });
};

function methodNotAllowed(req, res, next) {
    res.status(405).json({ error: "Method not allowed" });
}

// Exporting controller functions
module.exports = {
    create: [validateDish, createDish],
    read: [dishExists, readDish],
    update: [dishExists, validateDish, updateDish],
    list: listDishes,
    deleteDish,
    methodNotAllowed,
};


