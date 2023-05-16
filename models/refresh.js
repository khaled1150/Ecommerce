const mongo=require("mongoose");
  


const refreshschema=new mongo.Schema(
    {
        token:{type:String,required:1,unique:1}
    }
    ,{timestamps:true}
);
module.exports=mongo.model("refresh",refreshschema);