import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const carVisitedSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    visitCount: {
      type: Number,
      default: 0, 
    },
    offers: { 
        type: String,
        required: true,
    },  
    model_no: { 
        type: String, 
        required: true 
    },  
    colors: [{
        color: { 
            type: String, 
            required: true,
        },
        price: { 
            type: Number, 
            required: true, 
        },
        images: [{ 
            type: String, 
            required: true,
         }],
    }],
  });

  const favouriteCarSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    offers: { 
        type: String,
        required: true,
    },  
    model_no: { 
        type: String, 
        required: true 
    },  
    colors: [{
        color: { 
            type: String, 
            required: true,
        },
        price: { 
            type: Number, 
            required: true, 
        },
        images: [{ 
            type: String, 
            required: true,
         }],
    }],
});

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:'/uploads/profile-pics/default-avatar.png',
    },
    admin:{
        type:Boolean,
        default:false,
    },
    searchhistory:{
        type:[String],
        default:[],
    },
    carvisited:{
        type:[carVisitedSchema],
        default:[]
    },
    favourites: {
        type: [favouriteCarSchema],
        default: [],
    },
    dayUsage: {
        type: Map,
        of: String,
        default: {},
      },
      currentLogin: {
        type: Date,
        default: null,
      },
});

// Secure the password with the bcrypt
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Creating Json Web Token
userSchema.methods.generateToken = async function (){
    try{
        return jwt.sign({
            userId: this._id.toString(),
            email:this.email,
            admin:this.admin,
        },
        "shashankgupta",
        {
            expiresIn: "30d",
        }
    );
    } catch(error){
        console.log(error);
    }
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    try{
        return bcrypt.compare(password, this.password);
    } catch(error){
        console.log(error);
    }
};

const User = mongoose.model("User",userSchema);
export default User;