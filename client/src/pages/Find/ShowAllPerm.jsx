import React from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'

import AllPermTable from '../../components/Find/AllPermTable'

const Wrap = styled.div`
  padding: 50px 20px;

  background-color: white;
  text-transform: capitalize;
`
const ShowAllPerm = () => {
  return (
    <Layout>
      <Wrap>
        <AllPermTable />
      </Wrap>
    </Layout>
  )
}

export default ShowAllPerm
