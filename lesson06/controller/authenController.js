import CustomerModel from "../model/customers.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const customer = await CustomerModel.findOne({ email });

    if (!customer) throw new Error("Email does not exist");
    if (customer && customer.password === password) {
      res.status(201).send({
        message: "Login successfully",
        data: { 
            email,
            role: customer.role 
        },
        success: true,
      });
    } else {
      throw new Error("Invalid Password");
    }
    
  } catch (error) {
    next(error);
  }
};
