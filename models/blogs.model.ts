import mongoose from "mongoose";

function generateSlug(input: string): string {
  // Convert to lowercase and replace all non-alphanumeric characters with hyphens
  const hyphenated = input.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Remove leading and trailing hyphens
  return hyphenated.replace(/^-+/, "").replace(/-+$/, "");
}

const blogsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    thumbnail: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    slug: {
      type: String,
      default: function () {
        return generateSlug((this as any).title);
      },
    },
    content: {
      type: String,
      required: true,
      maxlength: 100000,
    },
  },
  {
    timestamps: true,
  }
);

blogsSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = generateSlug(this.title);
  }
  next();
});
export const BlogsModel = mongoose.model("blogs", blogsSchema);
