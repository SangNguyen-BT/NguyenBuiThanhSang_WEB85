import CustomerModel from "../model/customer.js";

export const authenUser = async (req, res, next) => {
    const { apiKey } = req.query;

    if (!apiKey) return res.status(401).json({ message: "Missing apiKey" });

    const [text, userId, email, randomString] = apiKey.split('/');
    
    if (text !== 'web' || !userId || !email || !randomString) {
        return res.status(401).json({ message: "Invalid apiKey" })
    };

    const user = await CustomerModel.findOne({ id: userId, email });
    if (!user) return res.status(401).json({ message: "Invalid user apiKey" }); // chưa fix được authen RANDOM STRING

    req.user = user

    next();
}