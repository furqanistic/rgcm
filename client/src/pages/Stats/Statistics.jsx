import React from 'react'
import Layout from '../../Layout'
import DataTable from '../../components/Stats/DataTable'
import styled from 'styled-components'

const Wrap = styled.div`
  padding: 100px;
  background-color: white;
`
const Statistics = () => {
  return (
    <Layout>
      <Wrap>
        <DataTable />
      </Wrap>
    </Layout>
  )
}

export default Statistics
