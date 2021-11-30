const mongoose = require("Mongoose");
const Joi = require("joi");
const {productSchema} = require (`./product`);

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  isGoldMember: {type: Boolean, default: false},
  shoppingCart: {type: [productSchema], default:[] },
});

const User = mongoose.model ("User, userSchema");

function validateUser (user) {
  const schema = Joi.object({
    name: Joi.string().required(),

  });
  return schema.validate(user);

}

  exports.User = User;
  exports.validate = validateUser;

 const { User} = require (`../models/user`);
 const {Product, validate } = require ('../models/product');
 const express = require ('express');
 const router = express.Router();

 router.post ('/:userId/shoppingcart/:productId' , async (req, res) => {
   try {
     const user = await User.findbyID (req.params.userID);
     if (!user) return res.status (400). send (`The user with id "${req.params.userId} " does not exist. `);

     const product = await Product.findById (req.params.productId);
     if (!product) return res.status (400).send (`The product with id "${req.params.productId}" does not exist.`);

        user.shoppingCart.push(product);

        await user.save();
        return res.send (user.shoppingCart);
   } catch (ex) {
     return res.status (500) .send (`Internal Server Error: ${ex}`);
   }

  });



module.exports = router;