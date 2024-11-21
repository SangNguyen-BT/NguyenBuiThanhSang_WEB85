export const roles = {
    admin: "admin",
    customer: "customer"
}

export const authorize = (requireRole) => {
    return (req, res, next) => {
        try {
            const { api_key } = req.query
            if (!api_key) return res.status(403).send("Forbidden")

            const { role } = JSON.parse(api_key)
            if (role === requireRole) {
                next()
            } else {
                return res.status(403).send("Forbidden")
            }

        } catch (error) {
            next(error)
        }

    }
}