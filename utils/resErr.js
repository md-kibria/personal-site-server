function resErr(res, error, msg) {
    res.status(500).json({
        status: 500,
        msg: msg || 'Serverside error occured!',
        error: error.message
    })
}

module.exports = resErr