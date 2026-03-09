const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const mongoose = require("mongoose");
const emailService = require("../services/email.service");


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

    const isTransactionAlreadyExists = await transactionModel.findOne({
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
        _id: fromAccount
    });

    const isToAccountValid = await accountModel.findOne({
        _id: toAccount
    })

    if (!isFromAccountValid || !isToAccountValid) {
        return res.status(400).json({
            message: "Both from and to accounts must exist"
        });
    }

    if (isFromAccountValid.status !== "ACTIVE" || isToAccountValid.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Account is FROZEN or CLOSED"
        })
    }

    /**
     * 4. Check sufficient balance in from account using ledger entries
     * 
     */

    const balance = await fromUserAccount.getBalance();


    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}, Requested amount is ${amount}`
        })
    }

    /**
     * 5. Create transaction with status PENDING
     */

    try {
        const session = await mongoose.startSession();

        session.startTransaction();

        const [transaction] = await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session });

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            type: "DEBIT",
            amount,
            transaction: transaction._id
        }], { session });

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            type: "CREDIT",
            amount,
            transaction: transaction._id
        }], { session });

        transaction.status = "COMPLETED";

        await transaction.save({ session });

        await session.commitTransaction();

        session.endSession();

        await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, fromAccount, toAccount);

        return res.status(201).json({
            message: "Transaction successful",
            transaction
        });

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Transaction failed",
            error: err.message
        })
    }
}

async function createInitialFundsTransactionController(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })
    if (!toUserAccount) {
        return res.status(400).json({
            message: "To account must exist"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    });

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "From account must exist"
        })
    }

    try {
        const session = await mongoose.startSession();

        await session.startTransaction();
        const [transaction] = await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session });


        const debitLedgerEntry = await ledgerModel.create([
            {
                account: fromUserAccount._id,
                type: "DEBIT",
                amount,
                transaction: transaction._id
            }], { session });

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            type: "CREDIT",
            amount,
            transaction: transaction._id
        }], { session });

        transaction.status = "COMPLETED";

        await transaction.save({ session });
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Initial funds transaction successful",
            transaction
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Initial funds transaction failed",
            error: err.message
        })
    }

}

module.exports = { createTransactionController, createInitialFundsTransactionController };