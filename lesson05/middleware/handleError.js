function handleError(error, req, res, next) {
    res.status(403).send({
        message: error.message,
        data: null,
        success: false
    })
}

export default handleError