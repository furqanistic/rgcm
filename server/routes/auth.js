import express from 'express'
import {
  deleteUser,
  getAllUsers,
  getUserProfile,
  signin,
  signup,
  updateUser,
} from '../controllers/auth.js'
import { verifyToken } from '../verifyToken.js'

const router = express.Router()

// Signup route
router.post('/signup', signup)

// Signin route
router.post('/signin', signin)

// Update user
router.put('/update/:id', updateUser)
// Delete user route
router.delete('/delete/:id', deleteUser)

// Get user profile route
router.get('/profile/:id', getUserProfile)

// Get all users route - for admin purposes, so ensure proper authorization in the future
router.get('/all-users', getAllUsers)

export default router
