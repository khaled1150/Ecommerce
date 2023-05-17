const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE CART, any user can create the cart
router.post("/", verifyToken, async(req,res)=>{
     
      const newCart = new Cart(req.body);

      try{
          const savedCart = await newCart.save();

          return res.status(200).json(savedCart);
      }catch{
          return res.status(500).json(err);
      }
});

// UPDATE, user can change its own cart
// put new version
router.put("find/:id", verifyTokenAndAuthorization,(req, res)=>{
       
    try{
         const updatedCart = Cart.findOneAndUpdate({userId:req.params.id},{
             $set: req.body
         }, {new:true});

           return res.status(200).json(updatedCart);
    }catch(err){
        return res.status(500).json(err);
    }
        
});


//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async(req,res)=>{
     try{
     await Cart.deleteOne({userId: req.params.id});

    return res.status(200).json("Cart Deleted successfully");
     }catch(err){
         return res.status(500).json(err);
     }
});


// GET USER CART

router.get("find/:id", verifyTokenAndAuthorization, async(req,res)=>{
   
   try{
    const cart =  await Cart.findOne({userId: req.params.id});
    return res.status(200).json(cart);
   }catch(err){
       return res.status(500).json(err);
   }
});

router.get("/",verifyTokenAndAdmin, async (req,res)=>{

  try{
      const carts = await Cart.find();
      return res.status(200).json(carts);
  }catch(err){
      return res.status(500).json(err);
  }

});





module.exports = router;