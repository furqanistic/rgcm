import { createError } from './error.js'
import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
  const token = req.cookies?.access_token

  if (!token) {
    return next(
      createError(401, 'Access token is missing. You are not authenticated.')
    )
  }

  try {
    const decodedUser = await jwt.verify(token, process.env.JWT)
    req.user = decodedUser
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, 'Token has expired. Please login again.'))
    }
    return next(createError(403, 'Token is not valid.'))
  }
}
