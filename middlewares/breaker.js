module.exports = (req, res, next) => {
    res.status(400).json({
        status: 400,
        msg: 'This request is blocked by developer'
    })
}