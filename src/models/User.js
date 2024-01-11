import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ['EMPLOYEE'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model('User', userSchema);
export default userModel;
