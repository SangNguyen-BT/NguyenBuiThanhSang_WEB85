export const checkLoginFields = ((req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) throw new Error("Missing required fields: email, password")

    next()
})