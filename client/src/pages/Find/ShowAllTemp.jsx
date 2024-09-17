import React from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'
import AllTempTable from '../../components/Find/AllTempTable'

const Wrap = styled.div`
  height: 100%;
  background-color: white;
  text-transform: capitalize;
  padding-top: 2rem;
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
