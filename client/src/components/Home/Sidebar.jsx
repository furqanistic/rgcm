import {
  BarChart2,
  Bell,
  FileBarChart,
  LogOut,
  Menu,
  Plus,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { logout } from '../../redux/userSlice.js'

const TopbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }

  @media print {
    display: none;
  }
`

const NavList = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.95);
    transform: ${(props) =>
      props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease-in-out;
    padding: 2rem;
    gap: 2rem;
  }
`

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: white;
  transition: all 0.2s;
  border-radius: 8px;
  font-weight: 500;

  &:hover,
  &.active {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    justify-content: center;
  }
`

const NavIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.75rem;
`

const NavText = styled.span`
  white-space: nowrap;
`

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
  border-radius: 8px;
  font-weight: 500;

  &:hover {
    background-color: rgba(255, 59, 48, 0.8);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    margin-top: auto;
    justify-content: center;
  }
`

const ToggleButton = styled.button`
  display: none;
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-right: 2rem;
`

const SIDEBAR_ITEMS = [
  { name: 'New Booking', icon: Plus, color: '#6366f1', href: '/new' },
  { name: 'Find', icon: Search, color: '#f07407', href: '/find' },
  { name: 'My Bookings', icon: BarChart2, color: '#8B5CF6', href: '/stats' },
  { name: 'Report', icon: FileBarChart, color: '#EC4899', href: '/reports' },
  { name: 'Accounts', icon: UserRound, color: '#48e1ec', href: '/register' },
  { name: 'Reminder', icon: Bell, color: '#10B981', href: '/reminder' },
]

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  let filteredItems = SIDEBAR_ITEMS
  if (
    ['admin', 'zaighamhafeez', 'subhanwaseem'].includes(currentUser.username)
  ) {
    filteredItems = SIDEBAR_ITEMS.filter((item) => item.name !== 'Stats')
  } else {
    filteredItems = SIDEBAR_ITEMS.filter(
      (item) => !['Report', 'Accounts'].includes(item.name)
    )
  }

  return (
    <TopbarContainer>
      <Logo>RGCM</Logo>
      <ToggleButton onClick={toggleMenu}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </ToggleButton>
      <NavList isOpen={isMenuOpen}>
        {filteredItems.map((item) => (
          <NavItem
            key={item.href}
            to={item.href}
            className={location.pathname === item.href ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            <NavIcon>
              <item.icon size={24} color={item.color} />
            </NavIcon>
            <NavText>{item.name}</NavText>
          </NavItem>
        ))}
        <LogoutButton onClick={handleLogout}>
          <NavIcon>
            <LogOut size={24} color='#ffffff' />
          </NavIcon>
          <NavText>Logout</NavText>
        </LogoutButton>
      </NavList>
    </TopbarContainer>
  )
}

export default Sidebar
