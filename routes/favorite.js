const router = require("express").Router();
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");


const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

// CREATE Favorite, any user can create the Favorite
router.post("/", verifyToken, async(req,res)=>{
     
      const newFavorite = new Favorite(req.body);

      try{
          const savedFavorite = await newFavorite.save();

          return res.status(200).json(savedFavorite);
      }catch{
          return res.status(500).json(err);
      }
});

// UPDATE, user can change its own Favorite
// put new version
router.put("find/:id", verifyTokenAndAuthorization,(req, res)=>{
       
    try{
         const updatedFavorite = Favorite.findOneAndUpdate({userId:req.params.id},{
             $set: req.body
         }, {new:true});

           return res.status(200).json(updatedFavorite);
    }catch(err){
        return res.status(500).json(err);
    }
        
});


//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async(req,res)=>{
     try{
     await Favorite.deleteOne({userId: req.params.id});

    return res.status(200).json("Favorite Deleted successfully");
     }catch(err){
         return res.status(500).json(err);
     }
});

// GET USER Favorite

router.get("find/:id", verifyTokenAndAuthorization, async(req,res)=>{
   
   try{
    const favorite =  await Favorite.findOne({userId: req.params.id});
    return res.status(200).json(favorite);
   }catch(err){
       return res.status(500).json(err);
   }
});


router.get("/",verifyTokenAndAdmin, async (req,res)=>{

  try{
      const favorites = await Favorite.find();
      return res.status(200).json(favorites);
  }catch(err){
      return res.status(500).json(err);
  }

});





module.exports = router;