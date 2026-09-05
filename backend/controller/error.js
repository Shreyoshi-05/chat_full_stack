export const ress = (req,res,status,message,success,data)=>{
  return res.status(status).json({
    "message":message,
    "success":success,
    "data":data
  })
}