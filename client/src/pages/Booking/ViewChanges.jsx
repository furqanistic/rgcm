import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { DateTime } from 'luxon'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'

import { useQuery } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../Loader.jsx'
import { axiosInstance } from '../../config.js'
const Wrap = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  background-color: white;
  border-radius: 5px;
  padding: 2rem;
  min-height: 100%;
`
const Heading = styled.p`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
`

const ViewChanges = () => {
  const params = useParams()
  const navigate = useNavigate()

  function formatDate(dateTimeString) {
    const dt = DateTime.fromISO(dateTimeString).setZone('Asia/Karachi')
    if (!dt.isValid) {
      console.error(`Invalid date string: ${dateTimeString}`)
      return 'Invalid Date'
    }

    return `${dt.toFormat('EEEE dd-MM-yyyy hh:mm a')}` // Using 'a' will give AM/PM
  }

  function formatFieldName(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // add a space before each uppercase letter
      .replace(/^./, (str) => str.toUpperCase()) // capitalize the first letter
  }

  // getting serial for user
  const { data, status } = useQuery('audit-logs', async () => {
    const res = await axiosInstance.get(`/audit/${params.id}/auditlogs`)
    // const res = await axiosInstance.get(`/booking/get-booking/${params.id}`)
    return res.data
  })
  if (status === 'loading') {
    return <Loader />
  }
  console.log(data)
  return (
    <Layout>
      <Wrap id='booking-form-wrap'>
        <Heading>RGC Booking Form</Heading>
        <div>
          {data.map((log) => (
            <div key={log._id}>
              <h3>Edited by: {log.editedBy.username}</h3>
              <p>Edited on: {formatDate(log.updatedAt)}</p>

              {log.changedFields && log.changedFields.length === 0 ? (
                <p>No changes made.</p>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Old Value</TableCell>
                        <TableCell>New Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(log.oldValues).map((field) => (
                        <TableRow key={field}>
                          <TableCell>{formatFieldName(field)}</TableCell>
                          <TableCell>{log.oldValues[field] || '-'}</TableCell>
                          <TableCell>{log.newValues[field] || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          ))}
        </div>
      </Wrap>
    </Layout>
  )
}

export default ViewChanges
