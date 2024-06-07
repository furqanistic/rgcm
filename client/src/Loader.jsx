import React from 'react'
import { MagnifyingGlass } from 'react-loader-spinner'
import styled from 'styled-components'

const MakeCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`
const Loader = () => {
  return (
    <MakeCenter>
      <MagnifyingGlass
        visible={true}
        height='80'
        width='80'
        ariaLabel='magnifying-glass-loading'
        wrapperStyle={{}}
        wrapperClass='magnifying-glass-wrapper'
        glassColor='#c0efff'
        color='#e15b64'
      />
    </MakeCenter>
  )
}

export default Loader
