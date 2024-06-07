import React from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'
import AllBobBookingsTable from '../../components/Find/AllBobBookingsTable'

const Wrap = styled.div`
  padding: 50px 20px;
  background-color: white;
  text-transform: capitalize;
`
const ShowAllBobBookings = () => {
  return (
    <Layout>
      <Wrap>
        <AllBobBookingsTable />
      </Wrap>
    </Layout>
  )
}

export default ShowAllBobBookings
