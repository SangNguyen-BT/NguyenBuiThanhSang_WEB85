function checkRegisterFields(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).json("Require email or password");

  next();
}

export default checkRegisterFields
