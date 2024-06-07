import React, { useEffect } from 'react'
import Layout from '../../Layout'
import styled from 'styled-components'
import FindCard from '../../components/Find/FindCard'

const Mid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`
const Find = () => {
  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [])
  return (
    <Layout>
      <Mid>
        <FindCard />
      </Mid>
    </Layout>
  )
}

export default Find
