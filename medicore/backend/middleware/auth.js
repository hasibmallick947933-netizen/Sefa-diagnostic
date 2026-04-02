const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes — require valid JWT
exports.protect = async (req, res, next) => {
  try {
    let token
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or account deactivated.' })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token. Please sign in.' })
  }
}

// Restrict to specific roles
exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Requires role: ${roles.join(' or ')}.`,
    })
  }
  next()
}
