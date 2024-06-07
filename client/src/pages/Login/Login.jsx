import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { loginStart, loginSuccess } from '../../redux/userSlice'
import { axiosInstance } from '../../config'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    try {
      const res = await axiosInstance.post('/auth/signin', {
        username,
        password,
      })
      dispatch(loginSuccess(res.data))
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <div className='container'>
        <div className='box'>
          <div className='form'>
            <h2>Login</h2>
            <div className='inputBox'>
              <input
                type='text'
                required='required'
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                autoComplete='off'
              />
              <span>Username</span>
              <i></i>
            </div>
            <div className='inputBox'>
              <input
                type='password'
                required='required'
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='off'
              />
              <span>Password</span>
              <i></i>
            </div>
            <a>
              <input type='submit' value='Login' onClick={handleLogin} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
