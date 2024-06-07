import React from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'
import AllBookingsTable from '../../components/Find/AllBookingsTable'

const Wrap = styled.div`
  padding: 50px 20px;

  background-color: white;
  text-transform: capitalize;
`
const ShowAllBookings = () => {
  return (
    <Layout>
      <Wrap>
        <AllBookingsTable />
      </Wrap>
    </Layout>
  )
}

export default ShowAllBookings
