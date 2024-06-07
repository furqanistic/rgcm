import React from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'
import AllTempTable from '../../components/Find/AllTempTable'

const Wrap = styled.div`
  padding: 50px 20px;

  background-color: white;
  text-transform: capitalize;
`
const ShowAllTemp = () => {
  return (
    <Layout>
      <Wrap>
        <AllTempTable />
      </Wrap>
    </Layout>
  )
}

export default ShowAllTemp
