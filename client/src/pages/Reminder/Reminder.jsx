import React from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'
import AllReminder from '../../components/Reminder/AllReminder'

const Wrap = styled.div`
  padding: 50px;
  background-color: white;
`
const Reminder = () => {
  return (
    <Layout>
      <Wrap>
        <AllReminder />
      </Wrap>
    </Layout>
  )
}

export default Reminder
