const mongoose = require("mongoose");


const CartSchema = new mongoose.Schema(

  {
      userId : {type: String, required:true},
      products : [  // we can specify that the type is Array but we want to add some properties
          {
             productID: {
                  type:String
             },
             quntity: {
                 type:Number,
                 default:1
             },
        

          }

      ],
      totalPrice:{type:Number, default:0},
    
   
      //createdAt : Date.now()
  },{timestamps: true}// mongoose function : when it is created

);

module.exports = mongoose.model("CartSchema", CartSchema);