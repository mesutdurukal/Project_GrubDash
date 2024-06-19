const router = require("express").Router();

const ordersController = require("./orders.controller");

router.route("/")
    .post(ordersController.create)
    .get(ordersController.list)
    .all(ordersController.methodNotAllowed);
router.route("/:orderId")
    .get(ordersController.read)
    .put(ordersController.update)
    .delete(ordersController.delete)
    .all(ordersController.methodNotAllowed);

module.exports = router;
