import React from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'
import AllBookingsTable from '../../components/Find/AllBookingsTable'
import ReportsData from '../../components/Report/ReportsData'

const Wrap = styled.div`
  padding: 100px;
  background-color: white;
  text-transform: capitalize;
`
const AllReports = () => {
  return (
    <Layout>
      <Wrap>
        <ReportsData />
      </Wrap>
    </Layout>
  )
}

export default AllReports
