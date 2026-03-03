const trasactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");


async function createTransactionController(req, res) {

    /**
     * 1. Validate request
     */

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({ message: "Both from and to accounts must exist" });
    }

    /** 
     * 2. Validate idempotency key
     */

    const isTransactionAlreadyExists = await trasactionModel.findOne({
        idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            });
        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({ message: "Transaction is already in process" });
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({ message: "Transaction failed" });
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(200).json({ message: "Transaction was reversed" });
        }
    }

    /**
     * 3. Check account status
    */

    const isFromAccountValid = await accountModel.findOne({
        _id:fromAccount
    });

    const isToAccountValid = await accountModel.findOne({
        _id:toAccount
    })

    if(!isFromAccountValid || !isToAccountValid){
        return res.status(400).json({
            message:"Both from and to accounts must exist"
        });
    }

    if(isFromAccountValid !== "ACTIVE" || isToAccountValid !== "ACTIVE"){
        return res.status(400).json({
            message:"Account is FROZEN or CLOSED"
        })
    }

    /**
     * 4. Check sufficient balance in from account using ledger entries
     * 
     */

    const balancce = await fromUserAccount.getBalance();

}