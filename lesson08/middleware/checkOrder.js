export const checkOrderFields = (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity)
    return res
      .status(400)
      .json({
        message: "Missing required fields: productId, quantity",
      });

  next();
};
