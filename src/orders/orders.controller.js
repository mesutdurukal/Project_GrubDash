const orders = require("../data/orders-data");
const nextId = require("../utils/nextId");

const orderExists = (req, res, next) => {
    const orderId = req.params.orderId;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    const error = new Error(`Order id not found: ${orderId}`);
    error.status = 404;
    next(error);
};

const validateOrder = (req, res, next) => {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    if (!deliverTo) {
        return next({ status: 400, message: "Order must include a deliverTo" });
    }
    if (!mobileNumber) {
        return next({ status: 400, message: "Order must include a mobileNumber" });
    }
    if (!dishes) {
        return next({ status: 400, message: "Order must include a dish" });
    }
    if (!Array.isArray(dishes) || dishes.length === 0) {
        return next({ status: 400, message: "Order must include at least one dish" });
    }

    dishes.forEach((dish, index) => {
        if (!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
            return next({ status: 400, message: `Dish ${index} must have a quantity that is an integer greater than 0` });
        }
    });
    return next();
};

function list(req, res) {
    res.json({ data: orders });
}

function create(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status: status || "pending",
        dishes,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

function read(req, res, next) {
    res.json({ data: res.locals.order });
}

function update(req, res, next) {
    const foundOrder = res.locals.order;
    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    if (id && id !== foundOrder.id) {
        return next({ status: 400, message: `Order id ${id} does not match route id ${foundOrder.id}` });
    }
    if (!status || status == "invalid"){
        return next({ status: 400, message: `status is missing` });
    }
    foundOrder.deliverTo = deliverTo;
    foundOrder.mobileNumber = mobileNumber;
    foundOrder.status = status || foundOrder.status;
    foundOrder.dishes = dishes;
    res.json({ data: foundOrder });
}

function deleteOrder(req, res, next){
    const foundOrder = res.locals.order;
    if (foundOrder.status !== "pending") {
        return next({ status: 400, message: `pending status` });
    }
    const index = orders.findIndex((order) => order.id === foundOrder.id);
    if (index !== -1) {
        orders.splice(index, 1);
    }
    return res.sendStatus(204);
}

function methodNotAllowed(req, res, next) {
    res.status(405).json({ error: "Method not allowed" });
}

module.exports = {
    list,
    read: [orderExists, read],
    create: [validateOrder, create],
    update: [orderExists, validateOrder, update],
    delete:  [orderExists, deleteOrder],
    methodNotAllowed,
};