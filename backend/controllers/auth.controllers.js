import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
export const signup= async (req,res)=>{
   try {
    const {username,fullName,email,password}=req.body;

    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({error :"Invalid email Format"});
    }
    const existingEmail=await User.findOne({email:email})//check with username also
    const existingUsername=await User.findOne({username})
    if(existingEmail || existingUsername){
        return res.status(400).json({error:"Already Existing User or Email"})
    }

    if(password.length<6){
        return res.status(400).json({error:"Password must have atleast 6 char length"})
    }
    //hashing the passowrd
    //123456=cn39f3yffj2fu2yf2

    const salt= await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    const newUser=new User({
        username,//username:username ippadi podalam but rendum same variable so atha ippadi potruken
        fullName,
        email,
        password:hashedPassword
    })
    
    if(newUser){
        generateToken(newUser._id,res)
        await newUser.save();//to store database
        res.status(200).json({
            //testing purpose responive for frontend
            _id:newUser._id,
            username:newUser.username,
            fullName:newUser.fullName,
            email:newUser.email,
            followers:newUser.followers,
            following:newUser.following,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg,
            bio:newUser.bio,
            link:newUser.link
        })
    }
    else{
        res.status(400).json({message:"User created Successfully"});
    }
   } catch (error) {
    console.log(`Error in signup controller : ${error}`);
    res.status(500).json({error:"Internal Server Error"});
   }
}

export const login= async (req,res)=>{
    try {
        const {username,password}=req.body;
        const user= await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");
        if(!user || !isPasswordCorrect){
           return res.status(400).json({error:"Invalid username or password"});
        }
        generateToken(user._id,res);
        res.status(200).json({
            //testing purpose responive for frontend
            _id:user._id,
            username:user.username,
            fullName:user.fullName,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
            bio:user.bio,
            link:user.link
        })
    } catch (error) {
        console.log(`Error in Login controller :${error}`);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const logout= async (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logout successfully"});
    } catch (error) {
        console.log(`Error in Logout controller :${error}`);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const getMe =async (req,res)=>{
    try {
        const user =await User.findOne({_id:req.user._id}).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log(`Error in Logout controller :${error}`);
        res.status(500).json({error:"Internal Server Error"});
    }
}