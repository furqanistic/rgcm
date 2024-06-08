import { AddBox } from '@mui/icons-material'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.div`
  max-width: 520px;
  border-width: 1px;
  border-color: rgba(219, 234, 254, 1);
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 1);
  padding: 1rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Icon = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #232222;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 1);

  svg {
    height: 1.7rem;
    width: 1.7rem;
  }
`

const Alert = styled.p`
  font-weight: 600;
  color: rgba(107, 114, 128, 1);
  font-size: 1.2rem;
`

const Message = styled.p`
  margin-top: 1rem;
  color: rgba(107, 114, 128, 1);
`

const Actions = styled.div`
  margin-top: 1.5rem;
`

const ActionLink = styled.a`
  text-decoration: none;
  display: inline-block;
  border-radius: 0.5rem;
  width: 100%;
  padding: 1rem 1.5rem;
  text-align: center;
  font-size: 1.3rem;
  line-height: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  &.new {
    background-color: #01470f;
    color: rgba(255, 255, 255, 1);
  }

  &.update-booking {
    margin-top: 0.5rem;
    background-color: #015f64;
    color: #ffffff;
  }
  &.delete-booking {
    margin-top: 0.5rem;
    background-color: #a16100;
    color: #ffffff;
  }
  &.temp-booking {
    margin-top: 0.5rem;
    background-color: #412424;
    color: #ffffff;
  }
  &.monthly-booking {
    margin-top: 0.5rem;
    background-color: #b3038d;
    color: #ffffff;
  }
`
const Linker = styled(Link)`
  text-decoration: none;
`

const FindCard = () => (
  <Card>
    <Header>
      <Icon>
        <AddBox />
      </Icon>
      <Alert>Find Forms Here</Alert>
    </Header>
    <Actions>
      <Linker to='all'>
        <ActionLink className='new'>Bookings</ActionLink>
      </Linker>

      <Linker to='all-perm'>
        <ActionLink className='update-booking'>Permanent Bookings</ActionLink>
      </Linker>
      <Linker to='all-temp'>
        <ActionLink className='temp-booking'>Temporary Bookings</ActionLink>
      </Linker>
      <Linker to='by-month'>
        <ActionLink className='monthly-booking'>Monthly Chart</ActionLink>
      </Linker>
    </Actions>
  </Card>
)

export default FindCard
