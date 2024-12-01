import mongoose from "mongoose"

const managerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    department: String,
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts"
    }
})

const ManagerModel = mongoose.model("managers", managerSchema)

export default ManagerModel