import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv, { populate } from "dotenv";

import checkRegisterFields from "./middleware/checkRegister.js";
import authToken from "./middleware/authToken.js";

import AccountModel from "./model/account.js";
import CustomerModel from "./model/customer.js";
import EmployeeModel from "./model/employee.js";
import ManagerModel from "./model/manager.js";
import PropertyModel from "./model/property.js"
import DepositOrdersModel from "./model/depositOrder.js"

dotenv.config();

mongoose.connect(
  "mongodb+srv://kennySang:dragon9076@cluster0.r6njk.mongodb.net/L09"
);

const app = express();
app.use(express.json());

// Task 3           */// TẠO TÀI KHOẢN TRƯỚC (HASH, SALT)
app.post("/register", checkRegisterFields, async (req, res, next) => {
  try {
    const { email, password, role, isActive } = req.body;

    const existedAccount = await AccountModel.findOne({ email });
    if (existedAccount) return res.status(400).json("Email already exists");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newAccount = await AccountModel.create({
      email,
      password: hash,
      isActive,
      role,
    });

    res.status(201).send({
      message: "Register successfully",
      newAccount,
      success: true,
    });

  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 4       */// SAU ĐÓ LOGIN LẤY "TOKEN" ĐỂ XÁC THỰC
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const account = await AccountModel.findOne({ email });
    if (!account) return res.status(404).json("Account not found");
    if (account.password !== password)
      return res.status(400).json("Invalid password");
    if (!account.isActive) return res.status(400).json("The user is offline");

    const token = jwt.sign(
      { userId: account._id, role: account.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      message: "Login successful",
      token: token,
      role: account.role,
      success: true,
    });

  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 5 *         /// GET PROFILE DỰA VÀO ROLE, PHẢI CÓ TOKEN
app.get("/profile", authToken, async (req, res) => {
  try {
    const { userId, role } = req.user;

    const infoModel = {
      CUSTOMER: CustomerModel,
      EMPLOYEE: EmployeeModel,
      MANAGER: ManagerModel,
    }[role];

    if (!infoModel) return res.status(400).json("Invalid Role");

    const currentUser = await infoModel.findOne({ accountId: userId });
    if (!currentUser) return res.status(400).json("No user found");

    return res.status(200).json({
      message: "Get profile successfully",
      data: currentUser,
      success: true,
    });

  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 6 * /// ACCOUNT (ĐÃ ĐANG NHẬP) TẠO PROFILE THEO ROLE TƯƠNG ỨNG
app.post("/create-profile", authToken, async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const { name, email, phone, address, department } = req.body;

    let newProfile;

    if (role === "CUSTOMER") {
      if (!name || !email || !phone || !address)
        return res
          .status(400)
          .json("Missing required fields: name, email, phone, address");

      const existedEmail = await CustomerModel.findOne({ email });
      if (existedEmail) return res.status(400).json("Email already exists");

      const account = await AccountModel.findById(userId)
      if (!account) return res.status(404).json("Account not found")
      if (email !== account.email) return res.status(400).json("Email must match the registered email")

      newProfile = await CustomerModel.create({
        name,
        email,
        phone,
        address,
        accountId: userId,
      });
      await newProfile.save();

    } else if (role === "EMPLOYEE") {
      if (!name || !email || !phone || !department)
        return res
          .status(400)
          .json("Missing required fields: name, email, phone, department");

      const existedEmail = await EmployeeModel.findOne({ email });
      if (existedEmail) return res.status(400).json("Email already exists");

      const account = await AccountModel.findById(userId)
      if (!account) return res.status(404).json("Account not found")
      if (email !== account.email) return res.status(400).json("Email must match the registered email")

      newProfile = await EmployeeModel.create({
        name,
        email,
        phone,
        department,
        accountId: userId,
      });
      await newProfile.save();

    } else if (role === "MANAGER") {
      if (!name || !email || !phone || !department)
        return res
          .status(400)
          .json("Missing required fields: name, email, phone, department");

      const existedEmail = await ManagerModel.findOne({ email });
      if (existedEmail) return res.status(400).json("Email already exists");

      const account = await AccountModel.findById(userId)
      if (!account) return res.status(404).json("Account not found")
      if (email !== account.email) return res.status(400).json("Email must match the registered email")

      newProfile = await ManagerModel.create({
        name,
        email,
        phone,
        department,
        accountId: userId,
      });
      await newProfile.save();

    } else {
      return res.status(400).json("Invalid role");
    }

    return res.status(201).json({
      message: `${role} profile created successfully`,
      data: newProfile,
      success: true,
    });

  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 7 */// MANAGER TẠO TÀI KHOẢN, THÔNG TIN CHO EMPLOYEE
app.post("/create-employee", authToken, async (req, res, next) => {
  try {
    const { userId, role } = req.user;

    if (role !== "MANAGER") {
      return res.status(403).json("Only managers can create employees");
    }

    const { email, password, name, phone, department } = req.body;

    if (!email || !password || !name || !phone || !department)
      return res
        .status(400)
        .json("Missing required fields: name, phone, department");

    const existingAccount = await AccountModel.findOne({ email });
    const existedEmail = await EmployeeModel.findOne({ email });

    if (existingAccount || existedEmail) {
      return res.status(400).json("Email already exists");
    }

    const manager = await ManagerModel.findOne({accountId: userId})

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newAccount = await AccountModel.create({
      email,
      password: hash,
      role: "EMPLOYEE",
      isActive: true,
    });

    const newEmployee = await EmployeeModel.create({
      name,
      email,
      phone,
      department,
      accountId: newAccount._id,
      managerId: manager._id,
    });

    await newEmployee.save();

    return res.status(201).json({
      message: "Employee created successfully",
      data: newEmployee,
      success: true,
    });

  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 8 * /// MANAGER & EMPLOYEE TẠO PROFILE PROPERTY
app.post("/create-property", authToken, async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    
    const { address, price, area, status, employeeId, managerId} = req.body;

    const existedProperty = await PropertyModel.findOne({address})
    if (existedProperty) return res.status(400).json("House is already on sale")

    let newProperty

    if (role !== "MANAGER" && role !== "EMPLOYEE") {
      return res
        .status(401)
        .json("Only managers or employees can create properties");

    } else if (role === "EMPLOYEE") {
      if (!address || !price || !area ) return res.status(400).json("Missing fields: address, price, area")

      const employee = await EmployeeModel.findOne({accountId: userId});
      
      if (!employee) {
        return res.status(400).json("Employee not found");
      }
      newProperty = await PropertyModel.create({
        address,
        price,
        area,
        status,
        employeeId: employee._id,
      });
      
      await newProperty.save()

    } else if (role === "MANAGER") {
      if (!address || !price || !area) return res.status(400).json("Missing fields: address, price, area")

      const manager = await ManagerModel.findOne({accountId: userId})
      if (!manager) return res.status(400).json("Manager Not Found")

      newProperty = await PropertyModel.create({
        address,
        price,
        area,
        status,
        managerId: manager._id,
      });
      
      await newProperty.save()

    } else {return res.status(400).json("Invalid role");}

    return res.status(201).json({
      message: "Property created successfully",
      data: newProperty,
      success: true,
    });

  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// Task 9 * /// MANAGER & EMPLOYEE UPDATE DATA PROPERTY
app.put("/update-property/:propertyId", authToken, async (req, res, next) => {
  try {
    const {propertyId} = req.params
    const { userId, role } = req.user
    
    if (role !== "MANAGER" && role !== "EMPLOYEE") return res.status(403).json("Only Manager or Employee can update property")
      
    const {address, price, area, status, employeeId } = req.body

    const property = await PropertyModel.findById(propertyId)
    if (!property) return res.status(400).json("Property not found")

    if (role === "EMPLOYEE" && property.employeeId.toString() !== userId){
      return res.status(400).json("Employees can only update properties assigned to them")
    }

    if (employeeId && role === "MANAGER") {
      const employee = await EmployeeModel.findById(employeeId)
      if (!employee) return res.status(400).json("Employee not found")

      if (property.managerId.toString() !== userId) {
        return res.status(400).json("Managers can only reassign employees to properties they manage")
      }

      property.employeeId = employeeId
    }

    if (address) property.address = address
    if (price) property.price = price
    if (area) property.area = area
    if (status) property.status = status

    await property.save()

    return res.status(200).json({
      message: "Property updated successfully",
      data: property,
      success: true,
    });

  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
})

// Task 10 * /// CUSTOMER TẠO ĐƠN ĐẶT CỌC
app.post("/create-orders", authToken, async (req, res, next) => {
  try {
    const {userId, role} = req.user

    if (role !== "CUSTOMER") return res.status(400).json("Only Customer can create deposit")

    const {propertyId, depositAmount, date, status} = req.body
    if (!propertyId || !depositAmount || !date) return res.status(400).json("Missing fields: propertyId, depositAmount, date")

    const property = await PropertyModel.findById(propertyId)
    if (!property) return res.status(400).json("Property not found")
    
    const existingDeposit = await DepositOrdersModel.findOne({propertyId})
    if (existingDeposit) return res.status(400).json("This property has already been reserved")

    if (property.status !== "On Sale") return res.status(400).json("Property is not available for sale")

    const customer = await CustomerModel.findOne({accountId: userId})
    
    const newOrder = await DepositOrdersModel.create({
      customerId: customer._id,
      propertyId,
      depositAmount,
      date,
      status
    })

    return res.status(201).json({
      message: "Deposit order created successfully",
      data: newOrder,
      success: true,
    });

  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
})

// Task 11 * /// MANAGER & EMPLOYEE LẤY PROFILE ORDER + CUSTOMER(TÊN EMAIL SĐT)
app.get("/deposit-orders", authToken, async (req, res, next) => {
  try {
    const {role} = req.user
    if (role !== "MANAGER" && role !== "EMPLOYEE") return res.status(400).json("Only managers or employees can view deposit orders")

    const depositOrder = await DepositOrdersModel.find()
    .populate("customerId", "name email phone")

    if (!depositOrder || depositOrder.length === 0) return res.status(400).json("No deposit order found")

    return res.status(200).json({
      message: "Deposit orders retrieved successfully",
      data: depositOrder,
      success: true,
    });

  } catch(error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
})

// Task 12 * /// CUSTOMER XEM PROFILE ORDER, TRẢ VỀ THÔNG TIN PROPERTY + EMPLOYEE (tên, email, sđt) TẠO PROP ĐÓ
app.get("/my-order-profile", authToken, async (req, res, next) => {
  try {
    const { userId, role } = req.user

    if (role !== "CUSTOMER") return res.status(400).json("Only Customer can view profile")

    const customer = await CustomerModel.findOne({accountId: userId})
    if (!customer) return res.status(400).json("Customer not found")

    const depositOrder = await DepositOrdersModel.find({customerId: customer._id})
    .populate({
      path: "propertyId",
      select: "address price area status managerId employeeId",
      populate: [
        {
          path: "managerId",
          select: "name email phone"
        },
        {
          path: "employeeId",
          select: "name email phone"
        }
      ]
    })

    if (!depositOrder.length) return res.status(404).json("No deposits found")

    return res.status(200).json({
      message: "Deposits fetched successfully",
      data: depositOrder,
      success: true,
    });

  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
})

// Task 13 * /// EMPLOYEE(ONLY) GET PROFILE PROPERTY DO EMPL. ĐÓ TẠO
app.get("/my-properties", authToken, async (req, res, next) => {
  try {
    const { userId, role} = req.user

    if (role !== "EMPLOYEE" && role !== "MANAGER") return res.status(403).json("Only employees or managers can access this resource")

    let properties;

    if (role === "EMPLOYEE") {
      const employee = await EmployeeModel.findOne({accountId: userId})

      properties = await PropertyModel.find({employeeId: employee._id})
      .select("address price area status")
    }

    if (role === "MANAGER") {
      const manager = await ManagerModel.findOne({accountId: userId})

      properties = await PropertyModel.find({managerId: manager._id})
      .select("address price area status")
    }

    if (!properties || !properties.length) return res.status(400).json("No properties found on this user")

    return res.status(200).json({
      message: "Properties fetched successfully",
      data: properties,
      success: true,
    });

  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
})

// Task 14 * /// MANAGER(ONLY) XEM TẤT CẢ CÁC ORDER TRÊN HỆ THỐNG
app.get("/all-orders", authToken, async (req, res, next) => {
  try {
    const { userId, role } = req.user

    if (role !== "MANAGER") return res.status(400).json("Only managers can access this resource")

    const orders = await DepositOrdersModel.find()
    .populate("customerId", "name email phone")
    .populate("propertyId", "address price area status")

    if (!orders || orders.length === 0) return res.status(400).json("No orders found in the system")

    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
      success: true,
    });

  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
})

// Task 15 * /// MANAGER (ONLY) GET PROFILE CỦA TẤT CẢ EMPLOYEE DO M. TẠO
app.get("/all-profiles", authToken, async (req, res, next) => {
  try {
    const { userId, role } = req.user

    if (role !== "MANAGER") return res.status(400).json("Only Managers can view profiles")

    const manager = await ManagerModel.findOne({accountId: userId})

    const employees = await EmployeeModel.find({managerId: manager._id})
    .select("name email phone department")

    if (!employees || employees.length === 0) return res.status(400).json("No employees found under this management")

    return res.status(200).json({
      message: "Employees fetched successfully",
      data: employees,
      success: true,
    });
    
  } catch (error) {
    return res.status(403).json({
      message: error.message,
      data: null,
      success: false,
    });
  }
})

app.listen(8080, () => {
  console.log("Server is running");
});
