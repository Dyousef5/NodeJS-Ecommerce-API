const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlenght: [3, "Too short category name"],
      maxlenght: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image:String
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if(doc.image){
    const imageUrl =`${process.env.BASE_URL}/categories/${doc.image}`
    doc.image = imageUrl
  }
}
// findOne , findAll , update
categorySchema.post('init',(doc)=>{
  setImageURL(doc)
})
// create
categorySchema.post('save',(doc)=>{
  setImageURL(doc)
})

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
