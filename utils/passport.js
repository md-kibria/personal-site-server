const JwtStrategy = require('passport-jwt').Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt
const User = require('../models/User')

let opts = {}
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (payload, done) => {
        try {
            const user = await User.findOne({_id: payload._id})

            if(user) {
                return done(null, user)
            } else {
                return done(null, false)
            }

        } catch (error) {
            return done(error, false)
        }
    }))
}