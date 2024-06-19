const router = require("express").Router();
const dishesController = require("./dishes.controller");
const ordersController = require("../orders/orders.controller");

router.route("/")
    .post(dishesController.create)
    .get(dishesController.list)
    .all(dishesController.methodNotAllowed);
router.route("/:dishId")
    .get(dishesController.read)
    .put(dishesController.update)
    .delete (dishesController.deleteDish)
    .all(dishesController.methodNotAllowed);

module.exports = router;




