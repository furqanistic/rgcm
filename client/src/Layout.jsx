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
  margin-top: 3rem;
`
const Left = styled.div`
  max-width: 300px;
  /* padding: 0 1rem; */
  min-height: 100%;
  display: flex;
  justify-content: center;
  background-color: black;
`
const Right = styled.div`
  width: 100%;
  height: 100%;
  background-color: #00000081;
`

const Layout = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <Wrap>
      <Left>
        <Sidebar />
      </Left>
      <Right>{children}</Right>
    </Wrap>
  )
}

export default Layout
