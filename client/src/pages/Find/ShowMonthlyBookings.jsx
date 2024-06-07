import React, { useState } from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'

import MonthlyDataTable from '../../components/Find/MonthlyDataTable'

const Wrap = styled.div`
  padding: 50px 20px;

  background-color: white;
  text-transform: capitalize;
`
const ShowMonthlyBookings = () => {
  return (
    <Layout>
      <Wrap>
        <MonthlyDataTable />
      </Wrap>
    </Layout>
  )
}

export default ShowMonthlyBookings
