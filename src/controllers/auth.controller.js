const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function userRegisterController(req, res) {

    const { email, name, password } = req.body;

    const userAlreadyExists = await userModel.findOne({
            email
    })

    if(userAlreadyExists){
        return res.status(422).json({
            success:false,
            message:"User with the same email already exists"
        })
    }

    const user = await userModel.create({
        email,
        name,
        password
    })

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});

    res.cookie("token", token);



    return res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })


}


module.exports = { userRegisterController }