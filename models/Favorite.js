const mongoose= require("mongoose");



const FavoriteSchema = new mongoose.Schema(
    {
     
       userId: {type:String, required:true},
       products : [

           {
             productId:{type:String},
            
           }
       ]
   }, {timestamps:true}

);


module.exports = mongoose.model("FavoriteSchema", FavoriteSchema);  