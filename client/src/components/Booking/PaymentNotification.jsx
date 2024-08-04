import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { axiosInstance } from '../../config'

const PaymentNotification = () => {
  const { data } = useQuery(
    'pendingPayments',
    async () => {
      // Adjust the endpoint to one that fetches all bookings with 'Pending' status
      const res = await axiosInstance.get('/booking/pending')
      return res.data
    },
    {
      onSuccess: (data) => {
        // Assuming each booking has a 'date' or 'createdAt' field to sort by
        const sortedBookings = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 7)
        sortedBookings.forEach((booking) => {
          // Assuming 'booking' has some identifiable information like 'bookingId'
          toast.warn(`Payment for ${booking} is pending!`, {
            position: 'top-right',
            autoClose: 5000,
          })
        })
      },
      staleTime: 1000 * 60 * 60 * 24, // 1 day
    }
  )

  return null // This component doesn't render any visible content
}

export default PaymentNotification
