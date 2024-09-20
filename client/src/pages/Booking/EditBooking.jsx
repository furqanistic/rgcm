import { Delete } from '@mui/icons-material'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Layout from '../../Layout'

import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
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
const InputSet = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 20px;
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
  background-color: blue;
  font-size: 1rem;
  position: absolute;
  bottom: 0;
  right: 40px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
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
const NotesSet = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
`
const DeleteBtn = styled.button`
  background: red;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  margin-left: 10px;
`
const NoteDesc = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
`
const NoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  margin-bottom: 5px;
`
const BlueBtn = styled.button`
  background-color: #0901ac;
  padding: 0.5rem 0.8rem;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 10px;
  margin-top: 1rem;
  cursor: pointer;
`
const EditBooking = () => {
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
  const [totalAmount, setTotalAmount] = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState(0)
  const [timings, setTimings] = useState('')
  const [serialNumber, setSerialNumber] = useState(0)
  const [recentBookings, setRecentBookings] = useState(false)
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')

  const params = useParams()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axiosInstance.put(
        `/booking/update-booking/${params.id}`,
        {
          perHead,
          foodAmount,
          stageAmount,
          decorationLights,
          soundSystem,
          coldDrink,
          advancePay,
          hallRentBalc,
          extraDecor,
          others,
          discount,
          totalAmount,
          host,
          functionType,
          contact,
          location,
          date,
          numberOfGuests,
          updatedBy: currentUser.username,
          dishes,
          functionCat,
          formType,
          timings,
          useridd: currentUser,
          notes,
          paymentStatus,
        }
      )
      if (response.status === 200) {
        toast.success('Booking Updated Successfully', {
          duration: 4000,
        })
        navigate(`/view/${params.id}`)
      } else {
        toast.error('Failed to update booking. Please try again.')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    calculateTotalAmount()
  }, [
    perHead,
    numberOfGuests,
    foodAmount,
    stageAmount,
    decorationLights,
    soundSystem,
    coldDrink,
    hallRentBalc,
    extraDecor,
    others,
    discount,
  ])

  const calculateTotalAmount = () => {
    const perHeadTotal = Number(perHead) * Number(numberOfGuests)
    const amounts = [
      perHeadTotal, // Add this new calculation
      foodAmount,
      stageAmount,
      decorationLights,
      soundSystem,
      coldDrink,

      hallRentBalc,
      extraDecor,
      others,
    ].map(Number)
    const total =
      amounts.reduce((acc, curr) => acc + curr, 0) - Number(discount)
    setTotalAmount(total)
  }

  const handleDateChange = (e) => {
    let newDate = e.target.value

    // Remove all non-digit characters
    newDate = newDate.replace(/\D/g, '')

    // Add dashes between DD, MM, and YYYY
    if (newDate.length <= 2) {
      setDate(newDate)
    } else if (newDate.length <= 4) {
      setDate(`${newDate.slice(0, 2)}-${newDate.slice(2)}`)
    } else {
      setDate(
        `${newDate.slice(0, 2)}-${newDate.slice(2, 4)}-${newDate.slice(4, 8)}`
      )
    }

    // Validate the date if it is in the correct format
    if (newDate.length === 8) {
      const error = validateDate(newDate)
      setDateError(error)
    }
  }

  const validateDate = (date) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/
    if (!regex.test(date)) {
      return 'Wrong Date'
    }

    const [day, month, year] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)

    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() + 1 !== month ||
      dateObj.getDate() !== day
    ) {
      return 'Invalid date. Please enter a valid date.'
    }

    return null
  }

  const handleAddDish = () => {
    if (dish) {
      setDishes([...dishes, dish])
      setDish('')
    }
  }

  const handleDeleteDish = (index) => {
    setDishes(dishes.filter((_, i) => i !== index))
  }

  const handleAddNote = () => {
    if (currentNote.trim()) {
      // Add note only if it's not empty
      setNotes([...notes, currentNote])
      setCurrentNote('') // Reset input field
    }
  }

  const handleDeleteNote = (index) => {
    const newNotes = [...notes]
    newNotes.splice(index, 1) // Remove the note at the specified index
    setNotes(newNotes)
  }
  // getting serial for user
  const { data, status } = useQuery(
    'edit-booking',
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
        setPerHead(data.perHead)
        setFoodAmount(data.foodAmount)
        setStageAmount(data.stageAmount)
        setDecorationLights(data.decorationLights)
        setSoundSystem(data.soundSystem)
        setColdDrink(data.coldDrink)
        setAdvancePay(data.advancePay)
        setHallRentBalc(data.hallRentBalc)
        setExtraDecor(data.extraDecor)
        setOthers(data.others)
        setDiscount(data.discount)
        setFunctionCat(data.functionCat)
        setFormType(data.formType)
        setTotalAmount(data.totalAmount)
        setNumberOfGuests(data.numberOfGuests || 0)
        setTimings(data.timings)
        setSerialNumber(data.serialNumber || 0)
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

  // cats array
  const categories = ['Choose', 'Temporary', 'Permanent']
  const formcats = ['Choose', 'Regular', 'BOB']
  const times = ['Choose', 'Day', 'Night']
  const places = [
    'Choose',
    'Banquett',
    'Half Marquee',
    'Full Marquee',
    'Cuisine',
    'Farm House',
    'Upper Deck',
    'Banquett & Upper Deck',
  ]
  const StatusOptions = ['Choose', 'Paid', 'Not Paid', 'Pending', 'Adv Paid']

  return (
    <Layout>
      <Wrap id='booking-form-wrap'>
        <Heading>RGC Booking Form</Heading>
        <InputWrap>
          <InputSet>
            <FormText>Serial No # {data.serialNo + 1}</FormText>
          </InputSet>
        </InputWrap>
        <InputWrap>
          <InputSet>
            <FormText>Host :</FormText>
            <FormInput
              placeholder='Enter Host Name...'
              type='text'
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </InputSet>
          <InputSet>
            <FormText>Function :</FormText>
            <FormInput
              placeholder='Enter Function Type...'
              type='text'
              value={functionType}
              onChange={(e) => setFunctionType(e.target.value)}
            />
          </InputSet>
        </InputWrap>
        <InputWrap>
          <InputSet>
            <FormText>Contact :</FormText>
            <FormInput
              placeholder='Phone Number...'
              type='text'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </InputSet>
          <InputSet>
            <FormText>Locations :</FormText>
            <SelectCat
              name='option'
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            >
              {places.map((place) => (
                <SelectOpt key={place} value={place}>
                  {place}
                </SelectOpt>
              ))}
            </SelectCat>
          </InputSet>
        </InputWrap>
        <InputWrap>
          <InputSet>
            <FormText>Booking Type :</FormText>
            <SelectCat
              name='option'
              onChange={(e) => setFunctionCat(e.target.value)}
              value={functionCat}
            >
              {categories.map((category) => (
                <SelectOpt key={category} value={category}>
                  {category}
                </SelectOpt>
              ))}
            </SelectCat>
          </InputSet>
          <InputSet style={{ marginLeft: '15%' }}>
            <FormText>Form Type :</FormText>
            <SelectCat
              name='option'
              onChange={(e) => setFormType(e.target.value)}
              value={formType}
            >
              {formcats.map((cats) => (
                <SelectOpt key={cats} value={cats}>
                  {cats}
                </SelectOpt>
              ))}
            </SelectCat>
          </InputSet>
        </InputWrap>
        {functionCat === 'Temporary' && (
          <InputWrap>
            <InputSet>
              <FormText>From Date:</FormText>
              <FormInput
                type='date'
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </InputSet>
            <InputSet>
              <FormText>To Date:</FormText>
              <FormInput
                type='date'
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </InputSet>
          </InputWrap>
        )}

        <InputWrap>
          <InputSet>
            <FormText>Add Dishes : </FormText>
            <FormInput
              type='text'
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              placeholder='Enter Dish Name...'
            />
            <AddBtn onClick={handleAddDish}> + Add </AddBtn>
          </InputSet>
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
                      <DishItem key={index}>
                        {dish}
                        <DelBtn onClick={() => handleDeleteDish(index)}>
                          <Delete style={{ color: '#ff0000' }} />
                        </DelBtn>
                      </DishItem>
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
                <FormInput
                  type='text'
                  placeholder='Per Head Amount...'
                  value={perHead}
                  onChange={(e) => setPerHead(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Function Date:</FormText>
                <FormInput
                  type='text'
                  value={date}
                  onChange={handleDateChange}
                  placeholder='DD-MM-YYYY'
                  maxLength='10'
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Timing :</FormText>
                <SelectCat
                  name='option'
                  onChange={(e) => setTimings(e.target.value)}
                  value={timings}
                >
                  {times.map((time) => (
                    <SelectOpt key={time} value={time}>
                      {time}
                    </SelectOpt>
                  ))}
                </SelectCat>
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>No. Of Guest: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Guests...'
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Food Amount: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={foodAmount}
                  onChange={(e) => setFoodAmount(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Stage Amount: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={stageAmount}
                  onChange={(e) => setStageAmount(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Decoration Lights: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={decorationLights}
                  onChange={(e) => setDecorationLights(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Sound System: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={soundSystem}
                  onChange={(e) => setSoundSystem(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Cold Drink: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={coldDrink}
                  onChange={(e) => setColdDrink(e.target.value)}
                />
              </InputSet>
            </InputWrap>

            <InputWrap>
              <InputSet>
                <FormText>Hall Rent Balc: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={hallRentBalc}
                  onChange={(e) => setHallRentBalc(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Extra Decor: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={extraDecor}
                  onChange={(e) => setExtraDecor(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Others: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={others}
                  onChange={(e) => setOthers(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Advance Payment: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Amount...'
                  value={advancePay}
                  onChange={(e) => setAdvancePay(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText>Payment Status :</FormText>
                <SelectCat
                  name='option'
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  value={paymentStatus}
                >
                  {StatusOptions.map((opt) => (
                    <SelectOpt key={opt} value={opt}>
                      {opt}
                    </SelectOpt>
                  ))}
                </SelectCat>
              </InputSet>
            </InputWrap>
            <InputWrap>
              <InputSet>
                <FormText style={{ color: 'red' }}>Discount: </FormText>
                <FormInput
                  type='text'
                  placeholder='Enter Discount...'
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </InputSet>
            </InputWrap>
            <InputWrap style={{ marginBottom: '5rem' }}>
              <InputSet>
                <FormText style={{ color: 'green' }}>Total Amount: </FormText>
                <FormInput type='text' value={totalAmount} readOnly />
              </InputSet>
            </InputWrap>

            <SubmitForm onClick={handleSubmit}>Update</SubmitForm>
          </Right>
        </RightLeft>
        <InputWrap>
          <InputSet>
            <FormText>Add Note:</FormText>
            <FormInput
              type='text'
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder='Enter your note...'
            />
            <AddBtn onClick={handleAddNote}> + Add </AddBtn>
          </InputSet>
        </InputWrap>
        <NoteDesc>Note: </NoteDesc>

        <InputWrap>
          <NotesSet>
            {notes.map((note, index) => (
              <NoteItem key={index}>
                {note}
                <DeleteBtn onClick={() => handleDeleteNote(index)}>
                  Delete
                </DeleteBtn>
              </NoteItem>
            ))}
          </NotesSet>
        </InputWrap>
      </Wrap>
    </Layout>
  )
}

export default EditBooking
