import { DeleteForever, Download, Edit } from '@mui/icons-material'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Layout from '../../Layout'

import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
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
const InputWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  text-transform: capitalize;
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
  border: 0px solid black;
  outline: none;
  text-transform: capitalize;
  border-bottom: 1px solid black;
`
const InputSet = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 20px;
  text-transform: capitalize;
`

const AddBtn = styled.button`
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  color: white;
  font-size: 1rem;
  margin-left: 1rem;
  background-color: green;
`
const DelBtn = styled(AddBtn)`
  position: absolute;
  right: 5px;
  font-size: 0.7rem;
  padding: 0;
  background-color: transparent;
  display: ${(props) => (props.hideForPDF ? 'none' : 'block')};
`

const DishItem = styled.li`
  margin-bottom: 5px;
  list-style-type: none;
  display: flex;
  position: relative;
  font-size: 1rem;
  font-weight: 300;
  margin-bottom: 10px;
  border: 2px solid #000000;
  padding: 0.5rem;
  border-radius: 5px;
  color: #000000;
  text-transform: uppercase;
  background-color: white;
`
const DishesSet = styled.div`
  min-width: 400px;
  border: 3px solid white;
  border-radius: 10px;
  margin-left: 20px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: #2f2e2ea2;
`
const RightLeft = styled.div`
  display: flex;
`
const Left = styled.div`
  flex: 1;
`
const Right = styled.div`
  flex: 1;
  position: relative;
`
const DateEr = styled.div`
  color: red;
  font-size: 0.5rem;
  margin-left: 5px;
`
const SubmitForm = styled.button`
  min-width: 100px;
  border: none;
  color: white;
  padding: 0.5rem;
  background-color: green;
  font-size: 1rem;
  position: absolute;
  bottom: 0;
  right: 40px;
  cursor: pointer;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  display: ${(props) => (props.hideForPdf ? 'none' : 'flex')};
`
const SelectCat = styled.select`
  width: 100%;
  border-radius: 4px;
  border: 1px solid #000000;
  background-color: rgba(255, 255, 255, 0);
  outline: none;
  font-size: 1rem;
  padding: 0.5rem 1rem;
`
const SelectOpt = styled.option`
  width: 100%;
`
const Linker = styled(Link)`
  text-decoration: none;
`
const NoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  margin-bottom: 5px;
`
const NotesSet = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  text-align: start;
  font-size: 0.8rem;
  font-weight: 300;
`
const NoteDesc = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: underline;
`
const ViewBooking = () => {
  const { currentUser } = useSelector((state) => state.user)

  const [dish, setDish] = useState('')
  const [dishes, setDishes] = useState([])
  const [date, setDate] = useState('')
  const [dateError, setDateError] = useState(null)
  const [host, setHost] = useState('')
  const [functionType, setFunctionType] = useState('')
  const [contact, setContact] = useState('')
  const [location, setLocation] = useState('')
  const [perHead, setPerHead] = useState('')
  const [foodAmount, setFoodAmount] = useState('')
  const [stageAmount, setStageAmount] = useState('')
  const [decorationLights, setDecorationLights] = useState('')
  const [soundSystem, setSoundSystem] = useState('')
  const [coldDrink, setColdDrink] = useState('')
  const [advancePay, setAdvancePay] = useState('')
  const [hallRentBalc, setHallRentBalc] = useState('')
  const [extraDecor, setExtraDecor] = useState('')
  const [others, setOthers] = useState('')
  const [discount, setDiscount] = useState('')
  const [functionCat, setFunctionCat] = useState('')
  const [formType, setFormType] = useState('')
  const [timings, setTimings] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [numOfGuests, setNumOfGuests] = useState(0)
  const [serialNumber, setSerialNumber] = useState(0)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [notes, setNotes] = useState([])
  const [paymentStatus, setPaymentStatus] = useState('')
  const savePdfRef = useRef(null)
  const editRef = useRef(null)
  const deleteRef = useRef(null)

  const params = useParams()
  const navigate = useNavigate()
  const generatePDF = () => {
    if (savePdfRef.current) {
      savePdfRef.current.style.display = 'none'
    }
    if (editRef.current) {
      editRef.current.style.display = 'none'
    }
    if (deleteRef.current) {
      deleteRef.current.style.display = 'none'
    }
    const input = document.getElementById('booking-form-wrap')

    // Save original width and temporarily set a fixed width
    const originalWidth = input.style.width
    input.style.width = '1200px' // You can adjust this value based on the desired output

    html2canvas(input, {
      scale: 2, // Increase scale for higher resolution
      useCORS: true, // Enable CORS to capture images from other domains
      logging: false, // Disable logging for better performance
      backgroundColor: '#ffffff', // Set background color to white
    }).then((canvas) => {
      // Restore the original width
      input.style.width = originalWidth

      const imgData = canvas.toDataURL('image/jpeg', 1.0) // Use JPEG with maximum quality

      // Calculate the ratio to maintain the aspect ratio of the canvas
      const imgWidth = 210 // A4 width in mm (slightly reduced to ensure margins)
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      const pdf = new jsPDF('p', 'mm', 'a4')
      let position = 0

      pdf.setProperties({
        title: `Booking Form - ${host}`,
        subject: 'RGC Booking Form',
        author: 'RGC Booking System',
        keywords: 'booking, form, RGC',
        creator: 'RGC Booking System',
      })

      while (heightLeft >= 0) {
        pdf.addImage(
          imgData,
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight,
          '',
          'FAST'
        )
        heightLeft -= pageHeight
        if (heightLeft > 0) {
          pdf.addPage()
          position -= pageHeight
        }
      }

      pdf.save(`${host}_booking_form.pdf`)
      if (savePdfRef.current) {
        savePdfRef.current.style.display = 'block'
      }
      if (editRef.current) {
        editRef.current.style.display = 'block'
      }
      if (deleteRef.current) {
        deleteRef.current.style.display = 'block'
      }
    })
  }

  // getting serial for user
  const { data, status } = useQuery(
    'serial',
    async () => {
      const res = await axiosInstance.get(`/booking/get-booking/${params.id}`)
      return res.data
    },
    {
      onSuccess: (data) => {
        setDish(data.dish)
        setDishes(data.dishes || []) // assuming `dishes` is an array
        setDate(data.date)
        setDateError(data.dateError)
        setHost(data.host)
        setFunctionType(data.functionType)
        setContact(data.contact)
        setLocation(data.location)
        setPerHead(data.perHead || 0)
        setFoodAmount(data.foodAmount || 0)
        setStageAmount(data.stageAmount || 0)
        setDecorationLights(data.decorationLights || 0)
        setSoundSystem(data.soundSystem || 0)
        setColdDrink(data.coldDrink || 0)
        setAdvancePay(data.advancePay || 0)
        setHallRentBalc(data.hallRentBalc || 0)
        setExtraDecor(data.extraDecor || 0)
        setOthers(data.others || 0)
        setDiscount(data.discount || 0)
        setFunctionCat(data.functionCat)
        setFormType(data.formType)
        setTotalAmount(data.totalAmount)
        setNumOfGuests(data.numberOfGuests || 0)
        setTimings(data.timings)
        setSerialNumber(data.serialNo)
        setNotes(data.notes)
        const formatMongoDate = (mongoDate) => {
          const dateObj = new Date(mongoDate)
          const day = String(dateObj.getUTCDate()).padStart(2, '0')
          const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0')
          const year = dateObj.getUTCFullYear()
          return `${day}-${month}-${year}`
        }
        setFromDate(formatMongoDate(data.fromDate))
        setToDate(formatMongoDate(data.toDate))
        setPaymentStatus(data.paymentStatus)
      },
    }
  )
  if (status === 'loading') {
    return <Loader />
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    const data = {
      DeletedBy: currentUser.username,
    }
    try {
      await axiosInstance.put(`/booking/invoice/${params.id}/delete`, data)
      navigate('/find/all')
    } catch (err) {
      console.log(err)
    }
    console.log(data)
  }

  return (
    <Layout>
      <Wrap id='booking-form-wrap'>
        <Heading>RGC Booking Form</Heading>
        <InputWrap>
          <InputSet>
            <FormText>Serial No # {serialNumber}</FormText>
          </InputSet>
        </InputWrap>
        <InputWrap>
          <InputSet>
            <FormText>Host :</FormText>
            <FormInput type='text' value={host} readOnly />
          </InputSet>
          <InputSet>
            <FormText>Function :</FormText>
            <FormInput type='text' value={functionType} readOnly />
          </InputSet>
        </InputWrap>
        <InputWrap>
          <InputSet>
            <FormText>Contact :</FormText>
            <FormInput type='text' value={contact} readOnly />
          </InputSet>
          <InputSet>
            <FormText>Location :</FormText>
            <FormInput type='text' value={location} readOnly />
          </InputSet>
        </InputWrap>
        <InputWrap>
          <InputSet>
            <FormText>Booking Type :</FormText>

            <SelectOpt value={functionCat}>{functionCat}</SelectOpt>
          </InputSet>
          <InputSet style={{ marginLeft: '15%' }}>
            <FormText>Form Type :</FormText>

            <SelectOpt value={formType}>{formType}</SelectOpt>
          </InputSet>
        </InputWrap>
        {functionCat === 'Temporary' && (
          <InputWrap>
            <InputSet>
              <FormText>From Date:</FormText>
              <FormInput type='text' value={fromDate} />
            </InputSet>
            <InputSet>
              <FormText>To Date:</FormText>
              <FormInput type='text' value={toDate} />
            </InputSet>
          </InputWrap>
        )}
        <InputWrap>
          <InputSet>
            <FormText>Total Dishes: {dishes.length}</FormText>
          </InputSet>
        </InputWrap>
        <RightLeft>
          <Left>
            <InputWrap>
              <InputSet>
                {dishes.length === 0 && (
                  <DishesSet style={{ color: 'white' }}>
                    No Dishes Added...
                  </DishesSet>
                )}
                {dishes.length > 0 && (
                  <DishesSet>
                    {dishes.map((dish, index) => (
                      <DishItem key={index}>{dish}</DishItem>
                    ))}
                  </DishesSet>
                )}
              </InputSet>
            </InputWrap>
          </Left>
          <Right>
            <InputWrap>
              <InputSet>
                <FormText>Per Head </FormText>
                <FormInput type='text' value={perHead} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Function Date:</FormText>
                <FormInput type='text' value={date} readOnly maxLength='10' />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Timings: </FormText>
                <FormInput type='text' value={timings} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>No. Of Guest: </FormText>
                <FormInput type='text' value={numOfGuests} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Food Amount: </FormText>
                <FormInput type='text' value={foodAmount} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Stage Amount: </FormText>
                <FormInput type='text' value={stageAmount} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Decoration Lights: </FormText>
                <FormInput type='text' value={decorationLights} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Sound System: </FormText>
                <FormInput type='text' value={soundSystem} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Cold Drink: </FormText>
                <FormInput type='text' value={coldDrink} readOnly />
              </InputSet>
            </InputWrap>

            <InputWrap>
              <InputSet>
                <FormText>Hall Rent Balc: </FormText>
                <FormInput type='text' value={hallRentBalc} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Extra Decor: </FormText>
                <FormInput type='text' value={extraDecor} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Others: </FormText>
                <FormInput type='text' value={others} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Advance Payment: </FormText>
                <FormInput type='text' value={advancePay} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Payment Status :</FormText>

                <SelectOpt value={paymentStatus}>{paymentStatus}</SelectOpt>
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText style={{ color: 'red' }}>Discount: </FormText>
                <FormInput type='text' value={discount} readOnly />
              </InputSet>
            </InputWrap>
            <InputWrap style={{ marginBottom: '5rem' }}>
              <InputSet>
                <FormText style={{ color: 'green' }}>Total Amount: </FormText>
                <FormInput type='text' value={totalAmount} readOnly />
              </InputSet>
            </InputWrap>
            <SubmitForm ref={savePdfRef} onClick={generatePDF}>
              <Download /> Save PDF
            </SubmitForm>
            <Linker to={`/edit/${params.id}`}>
              <SubmitForm
                ref={editRef}
                style={{ marginRight: '22%', backgroundColor: 'blue' }}
              >
                <Edit style={{ marginRight: '0.5rem' }} /> Edit
              </SubmitForm>
            </Linker>
            <SubmitForm
              ref={deleteRef}
              style={{ marginRight: '42%', backgroundColor: 'red' }}
              onClick={handleDelete}
            >
              <DeleteForever style={{ marginRight: '0.5rem' }} /> Delete
            </SubmitForm>
          </Right>
        </RightLeft>
        <NoteDesc>Note: </NoteDesc>
        <InputWrap>
          <NotesSet>
            {notes.map((note, index) => (
              <NoteItem key={index}>
                {index + 1} - {note}
              </NoteItem>
            ))}
          </NotesSet>
        </InputWrap>
      </Wrap>
    </Layout>
  )
}

export default ViewBooking
