import { RemoveRedEye, VisibilityOff } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './components/Home/Sidebar'

const Wrap = styled.div`
  display: flex;
  height: 100%;
  text-transform: capitalize;
`
const Left = styled.div`
  max-width: 250px;
  min-height: 100%;
  background-color: black;
`
const Right = styled.div`
  width: 100%;
  height: 100%;
  background-color: #00000081;
`
const UserBox = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #00000097;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  position: absolute;
  color: white;
  right: 10px;
  top: 10px;
`
const UserText = styled.p`
  font-size: 1rem;
  font-weight: 400;
`
const Layout = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <Wrap>
      <Left>
        <Sidebar />
      </Left>
      <Right>
        <UserBox>
          <UserText>{currentUser.username}</UserText>
        </UserBox>
        {children}
      </Right>
    </Wrap>
  )
}

export default Layout
