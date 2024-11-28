import jwt from "jsonwebtoken";

const generateToken=(userId,res)=>{
const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"15d"
});
res.cookie("jwt",token,{
    maxAge:15*24*60*1000,//15days 24hrs 60sec 1000ms
    httpOnly: true,//prevents xss attacks
    sameSite:"strict",//prevents CSRF attacks
    secure:process.env.NODE_ENV !== "development"
})
}

export default generateToken;