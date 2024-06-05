const mongoose=require("mongoose");
const {Schema}=mongoose;
const brandSchema=new Schema({
    value:{type:String,require:true,unique:true},
    label:{type:String,require:true},

})

const virtual=brandSchema.virtual('id');
virtual.get(function(){
    return this._id
})

brandSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform:function(doc,ret){delete ret._id}
})

exports.Brand=mongoose.model("Brand",brandSchema);

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