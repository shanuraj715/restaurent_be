const mongoose = require("mongoose");

// do not remove the below unused import.
// Item modal is using in the mongoose "pre" middleware.
const Item = require("../Item/Item");

const CategorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: {
      type: Array,
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
  },
  { timestamps: true }
);

// 🧩 Middleware: Clean up references in FoodItem when a category is deleted
// CategorySchema.pre("findByIdAndDelete", async function (next) {
//   const categoryToDelete = await this.model.findOne(this.getFilter());

//   if (categoryToDelete) {
//     await mongoose
//       .model("Item")
//       .updateMany(
//         { categories: categoryToDelete._id },
//         { $pull: { categories: categoryToDelete._id } }
//       );
//   }

//   next();
// });

module.exports = mongoose.model("Category", CategorySchema);
