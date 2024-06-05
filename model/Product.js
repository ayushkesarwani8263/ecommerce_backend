const mongoose=require("mongoose");
const {Schema}=mongoose;
const productSchema=new Schema({
    title:{type:String,require:true,unique:true},
    description:{type:String,require:true},
    price:{type:Number,min:[1,'wrong min price'],max:[10000,'wrong max price'],require:true},
    discountPercentage:{type:Number,min:[1,'wrong min discount'],max:[10000,'wrong max discount'],require:true},
    rating:{type:Number,min:[0,'wrong min rating'],max:[5,'wrong max rating'],default:0,require:true},
    stock:{type:Number,min:[0,'wrong min stock'],default:0,require:true},
    brand:{type:String,require:true},
    category:{type:String,require:true},
    thumbnail:{type:String,require:true},
    images:{type:[String],require:true},
    deleted:{type:Boolean,default:false}
})

const virtual=productSchema.virtual('id');
virtual.get(function(){
    return this._id
})

productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}
})

exports.Product=mongoose.model("Product",productSchema);

// "id": 1,
// "title": "iPhone 9",
// "description": "An apple mobile which is nothing like apple",
// "price": 1199,
// "discountPercentage": 12.96,
// "rating": 4.69,
// "stock": 0,
// "brand": "Apple",
// "category": "smartphones",
// "thumbnail": "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
// "images": [
//   "https://cdn.dummyjson.com/product-images/1/1.jpg",
//   "https://cdn.dummyjson.com/product-images/1/2.jpg",
//   "https://cdn.dummyjson.com/product-images/1/3.jpg",
//   "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"
// ],
// "deleted": true