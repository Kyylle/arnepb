import mongoose from 'mongoose';
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true, // Prevents null values
      unique: true,   // Ensures uniqueness
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model('User', userSchema);

export default User;
