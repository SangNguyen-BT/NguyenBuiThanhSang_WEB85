export const checkRegisterFields = ((req, res, next) => {
    const { name, email, age, password } = req.body
    if (!name || !email || !age || !password ) throw new Error("Missing required field: name, email, age, password")
    next()
})