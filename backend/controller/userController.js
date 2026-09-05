import { User } from "../table/userTable.js";
import { ress } from "./error.js";
import bcrypt from "bcrypt";



export const signUpController = async(req,res) => {
  console.log(req.body)
  try {
    const{name,phone,email,pass} = req.body;
    if(!name || !phone || !email || !pass){
      return ress(req,res,500,"all input value are not avaliable",false, null);
    }

    const hasspass = await bcrypt.hash(pass,10);

    await User.create({name,phone,email,pass:hasspass});
    return ress(req,res,500,"user signed up",true,null);

  } catch (error) {
    return ress(req,res,500,error.message,false,null);
  }
}


export const signInController = async(req,res) => {
  try {
    const {email,pass} = req.body;
    if(!email || !pass){
      return ress(req,res,400,"all input value are not avaliable for signin",false,null);
    };

    const user = await User.findOne({where:{email}});
    if(!user){
      return ress(req,res,404,"user not found",false,null);
    }

    const find = await bcrypt.compare(pass,user.pass);
    if(!find){
      return ress(req,res,401,"Invalid  password try again",false,null);
    }
    return ress(req,res,401,"Login Successful",true,user);

  } catch (error) {
    return ress(req,res,500,error.message,false,null);
  }
}