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

async function userLoginController(req,res){

    const {email,password} = req.body;

    const isUserValid = await userModel.findOne({
        email
    }).select("+password");

    if(!isUserValid){
        return res.status(401).json({
            success:false,
            message:"User not found with the provided email"
        })
    }

    const isPasswordCorrect = await isUserValid.comparePassword(password);

    if(!isPasswordCorrect){
        return res.status(401).json({
            success:false,
            message:"Invalid password"
        })
    }

    const token = jwt.sign({userId:isUserValid._id},process.env.JWT_SECRET,{expiresIn:"3d"});
    res.cookie("token", token);

    return res.status(200).json({
        success:true,
        message:"User logged in successfully",
        user:{
            _id:isUserValid._id,
            email:isUserValid.email,
            name:isUserValid.name
        },
        token
    })
}


module.exports = { userRegisterController, userLoginController }