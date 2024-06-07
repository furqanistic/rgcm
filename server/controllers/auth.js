import bcryptjs from 'bcryptjs' // Import bcryptjs instead of bcrypt
import jwt from 'jsonwebtoken'
import { createError } from '../error.js'
import User from '../models/User.js'

// SIGNUP
export const signup = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ username: req.body.username })
    if (userExists) {
      return res.status(409).send('User already exists')
    }

    const hashedPassword = await bcryptjs.hash(req.body.password, 10)

    const newUser = new User({ ...req.body, password: hashedPassword })
    await newUser.save()

    res.status(200).send('User created successfully')
  } catch (err) {
    next(err)
  }
}

// LOGIN
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return next(createError(404, 'User not found'))

    const isCorrect = await bcryptjs.compare(req.body.password, user.password)
    if (!isCorrect) return next(createError(401, 'Invalid password'))

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    })
    const { password, ...others } = user._doc

    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 12 * 60 * 60 * 1000,
      })
      .status(200)
      .json(others)
  } catch (err) {
    next(err)
  }
}

// UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id

    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10)
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).send('User not found')
    }

    const { password, ...others } = updatedUser._doc
    res.status(200).json(others)
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) {
      return res.status(404).send('User not found')
    }

    res.status(200).send('User deleted successfully')
  } catch (error) {
    next(error)
  }
}

// GET USER PROFILE
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).send('User not found')
    }

    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

// GET ALL USERS
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}
