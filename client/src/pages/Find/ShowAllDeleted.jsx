import React from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'
import AllBookingsTable from '../../components/Find/AllBookingsTable'
import ViewDeletedBookings from '../Booking/ViewDeletedBookings'

const Wrap = styled.div`
  padding: 50px 20px;

  background-color: white;
  text-transform: capitalize;
`
const ShowAllDeleted = () => {
  return (
    <Layout>
      <Wrap>
        <ViewDeletedBookings />
      </Wrap>
    </Layout>
  )
}

export default ShowAllDeleted
