import mongoose from "mongoose"

const propertySchema = new mongoose.Schema({
    address: String,
    price: String,
    area: String,
    status: {
        type: String,
        enum: ["On Sale", "Sold", "Cancelled"],
        default: "On Sale"
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees"
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "managers"
    }
})

const PropertyModel = mongoose.model("properties", propertySchema)

export default PropertyModel