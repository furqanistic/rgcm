import { BarChart, Calendar, Clock, Plus } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.div`
  max-width: 520px;
  border: 1px solid rgba(219, 234, 254, 1);
  border-radius: 1rem;
  background-color: white;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const Icon = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #232222;
  padding: 0.75rem;
  color: white;
`

const Alert = styled.h2`
  font-weight: 600;
  color: #374151;
  font-size: 1.25rem;
  margin: 0;
`

const Actions = styled.div`
  display: grid;
  gap: 0.75rem;
`

const ActionLink = styled(Link)`
  text-decoration: none;
  display: block;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`

const cardItems = [
  { name: 'Bookings', path: 'all', color: '#01470f', icon: Plus },
  {
    name: 'Permanent Bookings',
    path: 'all-perm',
    color: '#015f64',
    icon: Calendar,
  },
  {
    name: 'Temporary Bookings',
    path: 'all-temp',
    color: '#412424',
    icon: Clock,
  },
  { name: 'Monthly Chart', path: 'by-month', color: '#b3038d', icon: BarChart },
]

const FindCard = () => (
  <Card>
    <Header>
      <Icon>
        <Plus size={24} />
      </Icon>
      <Alert>Find Forms Here</Alert>
    </Header>
    <Actions>
      {cardItems.map((item) => (
        <ActionLink
          key={item.path}
          to={item.path}
          style={{ backgroundColor: item.color, color: 'white' }}
        >
          <item.icon
            size={18}
            style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
          />
          {item.name}
        </ActionLink>
      ))}
    </Actions>
  </Card>
)

export default FindCard
