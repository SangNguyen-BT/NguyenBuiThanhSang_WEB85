import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "managers"
    },
    department: String,
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts"
    }
})

const EmployeeModel = mongoose.model("employees", employeeSchema)

export default EmployeeModel