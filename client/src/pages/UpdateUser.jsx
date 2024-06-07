import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import Layout from '../Layout'
import Loader from '../Loader'
import AllUsers from '../components/Find/AllUsers'
import { axiosInstance } from '../config'

const Wrap = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  background-color: white;
  border-radius: 5px;
  padding: 2rem;
  padding-bottom: 3rem;
  min-height: 100%;
  position: relative;
`
const Heading = styled.p`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
`
const InputWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`
const InputSet = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 20px;
`

const FormText = styled.span`
  font-size: 1.1rem;
  margin-right: 10px;
  font-weight: 500;
  min-width: 170px;
`
const FormInput = styled.input`
  max-width: 300px;
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid black;
  border-radius: 4px;
  outline: none;
  &:focus {
    outline: 2px solid black;
  }
`
const SubmitForm = styled.button`
  min-width: 100px;
  border: none;
  color: white;
  padding: 0.5rem;
  background-color: #0009b3;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  margin-top: 30px;
  right: 50px;
`
const SubmitFormDel = styled.button`
  min-width: 100px;
  border: none;
  color: white;
  padding: 0.5rem;
  background-color: #ec0000;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  margin-top: 30px;

  right: 220px;
`
const UpdateUser = () => {
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const params = useParams()

  const { data, status } = useQuery(
    'edit-user',
    async () => {
      const res = await axiosInstance.get(`/auth/profile/${params.id}`)
      return res.data
    },
    {
      onSuccess: (data) => {
        setFname(data.fname)
        setLname(data.lname || [])
        setUsername(data.username)
      },
    }
  )
  if (status === 'loading') {
    return <Loader />
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.put(`/auth/update/${params.id}`, {
        fname,
        lname,
        username,
        password,
      })
      navigate('/register')
    } catch (err) {
      console.log(err)
    }
  }
  const handleDelete = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.delete(`/auth/delete/${params.id}`)
      navigate('/register')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout>
      <Wrap>
        <Heading>Create Account</Heading>
        <InputWrap>
          <InputSet>
            <FormText>First Name :</FormText>
            <FormInput
              placeholder='Enter Name...'
              type='text'
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
          </InputSet>
          <InputSet>
            <FormText>Last Name :</FormText>
            <FormInput
              placeholder='Enter Father Name...'
              type='text'
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </InputSet>
        </InputWrap>
        <InputWrap>
          <InputSet>
            <FormText>Username :</FormText>
            <FormInput
              placeholder='Enter UserName...'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputSet>
          <InputSet>
            <FormText>Password :</FormText>
            <FormInput
              placeholder='Enter Password...'
              type='text'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputSet>
        </InputWrap>
        <InputWrap>
          <SubmitForm onClick={handleUpdate}>Update Account</SubmitForm>
          <SubmitFormDel onClick={handleDelete}>Delete Account</SubmitFormDel>
        </InputWrap>
      </Wrap>
    </Layout>
  )
}

export default UpdateUser
