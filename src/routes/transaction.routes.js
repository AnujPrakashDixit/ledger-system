const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.post("/", authMiddleware.authMiddleware, transactionController.createTransactionController);

router.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransactionController);


module.exports = router;