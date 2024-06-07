// PaymentNotification.jsx

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
        data.forEach((booking) => {
          toast.warn(`Payment for ${booking} is pending!`, {
            position: 'top-right',
          })
        })
      },
      staleTime: 1000 * 60 * 60 * 24,
    }
  )

  return null // This component doesn't render any visible content
}

export default PaymentNotification
