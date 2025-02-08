// ye mongodb mei user model ka structure hai
//ye user data store or retrieve karne ke liye hoga
const mongoose = require("mongoose");  //mongoose ko import kia jo mongodb se interact krne mei help krega

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // ye ek string type hai jisme username dena compulasary hai or ye unique hona chahiye
  password: { type: String, required: true }, // password text format mei hona chahiye or ye dena zruri hai
});

module.exports = mongoose.model("User", userSchema); //user collection mei convert hoga or userschema apply hoga
