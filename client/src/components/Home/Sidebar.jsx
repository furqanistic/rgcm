import {
  BarChart2,
  Bell,
  FileBarChart,
  LogOut,
  Menu,
  Plus,
  Search,
  UserRound,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { logout } from '../../redux/userSlice.js'

const SidebarContainer = styled.div`
  position: relative;
  z-index: 10;
  transition: all 0.3s ease-in-out;
  flex-shrink: 0;
  width: ${(props) => (props.isOpen ? '250px' : '80px')};
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  /* padding: 1rem; */
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
`

const ToggleButton = styled.button`
  padding: 0.5rem;
  border-radius: 50%;
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
`

const NavList = styled.nav`
  flex-grow: 1;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
`

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  text-decoration: none;
  color: white;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover,
  &.active {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const NavIcon = styled.div`
  min-width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const NavText = styled.span`
  margin-left: 1rem;
  white-space: nowrap;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.2s, width 0.2s;
  overflow: hidden;
  width: ${(props) => (props.isVisible ? 'auto' : '0')};
`

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-top: auto;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 0, 0, 0.6);
  }
`

const SIDEBAR_ITEMS = [
  { name: 'Booking', icon: Plus, color: '#6366f1', href: '/new' },
  { name: 'Find', icon: Search, color: '#f07407', href: '/find' },
  { name: 'Stats', icon: BarChart2, color: '#8B5CF6', href: '/stats' },
  { name: 'Report', icon: FileBarChart, color: '#EC4899', href: '/reports' },
  { name: 'Accounts', icon: UserRound, color: '#48e1ec', href: '/register' },
  { name: 'Reminder', icon: Bell, color: '#10B981', href: '/reminder' },
]

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 915)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsSidebarOpen(!isSidebarOpen)
    }
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
    <SidebarContainer isOpen={isSidebarOpen && !isMobile}>
      <ToggleButton onClick={toggleSidebar} disabled={isMobile}>
        <Menu size={24} />
      </ToggleButton>
      <NavList>
        {filteredItems.map((item) => (
          <NavItem
            key={item.href}
            to={item.href}
            className={location.pathname === item.href ? 'active' : ''}
          >
            <NavIcon>
              <item.icon size={24} color={item.color} />
            </NavIcon>
            <NavText isVisible={isSidebarOpen && !isMobile}>
              {item.name}
            </NavText>
          </NavItem>
        ))}
      </NavList>
      <LogoutButton onClick={handleLogout}>
        <NavIcon>
          <LogOut size={24} color='#ffffff' />
        </NavIcon>
        <NavText isVisible={isSidebarOpen && !isMobile}>Logout</NavText>
      </LogoutButton>
    </SidebarContainer>
  )
}

export default Sidebar
