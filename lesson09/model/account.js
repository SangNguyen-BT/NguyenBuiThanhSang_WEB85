import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: String,
  password: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["MANAGER", "CUSTOMER", "EMPLOYEE"],
    default: "CUSTOMER",
  },
});

const AccountModel = mongoose.model("accounts", accountSchema);

export default AccountModel;
