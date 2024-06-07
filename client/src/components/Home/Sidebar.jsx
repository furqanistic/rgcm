import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  Add,
  ExitToApp,
  GraphicEq,
  NotificationsActive,
  Person,
  Report,
  Search,
  VerifiedUser,
} from '@mui/icons-material'
import { logout } from '../../redux/userSlice.js'

import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
const Bar = styled.div`
  background-color: #00000081;
  height: 100%;
`

const Name = styled.div`
  font-size: 3rem;
  font-weight: 600;
  color: #ffffffae;
  letter-spacing: 0.3rem;
  background-color: #000000;
  max-width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const ItemsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  max-width: 250px;
  height: 100vh;
  color: white;
  background-color: #000000;
`
const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #ffffff;
  width: 100%;
  border-radius: 20px;
  transition: all 0.1s ease;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #000000;
    color: #f6d75c;
  }
`
const ItemEnd = styled(Item)`
  position: absolute;
  bottom: 10px;
`
const ItemName = styled.p`
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  width: 100%;
`
const ItemIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  width: 100%;
`
const Linker = styled(Link)`
  text-decoration: none;
  width: 100%;
`

const Sidebar = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [selectedItem, setSelectedItem] = useState()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const items = [
    { name: 'Booking', icon: <Add />, key: 'Booking', path: '/new' },

    { name: 'Find', icon: <Search />, key: 'Find', path: '/find' },
    {
      name: 'Stats',
      icon: <GraphicEq />,
      key: 'Stats',
      path: '/stats',
    },
    {
      name: 'Report',
      icon: <Report />,
      key: 'Report',
      path: '/reports',
    },
    { name: 'Accounts', icon: <Person />, key: 'Register', path: '/register' },
    {
      name: 'Reminder',
      icon: <NotificationsActive />,
      key: 'Reminder',
      path: '/reminder',
    },
  ]
  let filteredItems = items

  if (
    currentUser.username === 'admin' ||
    currentUser.username === 'zaighamhafeez' ||
    currentUser.username === 'subhanwaseem'
  ) {
    filteredItems = items.filter((item) => item.name !== 'Stats')
  } else {
    filteredItems = items.filter(
      (item) => item.name !== 'Report' && item.name !== 'Accounts'
    )
  }

  useEffect(() => {
    const currentKey = items.find(
      (item) => item.path === location.pathname
    )?.key
    if (currentKey) {
      setSelectedItem(currentKey)
    }
  }, [location.pathname, items])

  const handleClick = () => {
    dispatch(logout())
    navigate('/login')
  }
  return (
    <>
      <Bar>
        <Name>RGC</Name>
        <ItemsWrapper>
          {filteredItems.map((item) => (
            <Linker
              to={item.path}
              key={item.key}
              style={{ textDecoration: 'none' }}
            >
              <Item
                onClick={() => setSelectedItem(item.key)}
                style={{
                  backgroundColor:
                    selectedItem === item.key ? '#ffffff' : 'transparent',
                  color: selectedItem === item.key ? '#000000' : '#ffffff',
                }}
              >
                <ItemIcon>{item.icon}</ItemIcon>
                <ItemName>{item.name}</ItemName>
              </Item>
            </Linker>
          ))}
          <Item
            onClick={handleClick}
            style={{
              backgroundColor: '#a705056b',
              color: '#ffffff',
            }}
          >
            <ItemIcon>
              <ExitToApp />
            </ItemIcon>
            <ItemName>Logout</ItemName>
          </Item>
        </ItemsWrapper>
      </Bar>
    </>
  )
}

export default Sidebar
