// EventModal.tsx
import React, { useState } from 'react'
import { Modal, Collapse, Input, Button } from 'antd'
import { EventType, Requests } from '../../../../Models/calendar'
import { addMeetUrl, getCalendarByTime, getFullCalendar } from '../../../../api/calendarApi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import dayjs, { Dayjs } from 'dayjs'
import { toast } from 'react-toastify'
import { CommonButton } from '../../../../UI/button/Button'
import ChatWindow from './modalChat'

const { Panel } = Collapse

interface ModalCalendarDetailProps {
  visible: boolean
  selectedDate: string
  onClose: () => void
}

const ModalCalendarDetails: React.FC<ModalCalendarDetailProps> = ({ visible, selectedDate, onClose }) => {
  const [eventsForDate, setEventsForDate] = useState<EventType[]>([])
  const [isChatVisible, setChatVisible] = useState(false)
  const { data: calendarResponse, isLoading } = useQuery('calendarByTime', getFullCalendar, {
    refetchInterval: 60000 
  })

  const queryClient = useQueryClient()
  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD')
  const { mutate: updateRequestMutation } = useMutation(
    async (variables: { requestId: number; meetUrl: string }) => {
      try {
        console.log(variables)
        const response = await addMeetUrl(variables.requestId, variables.meetUrl)
        return response.data
      } catch (error) {
        console.error('Error updating request:', error)
        throw error
      }
    },
    {
      onSuccess: () => {
        toast.success('Meet URL updated successfully!')
        queryClient.invalidateQueries('calendarByTime')
    
      },
      onError: (error) => {
        toast.error('Failed to update Meet URL.')
        console.error('Error updating request:', error)
      }
    }
  )

  React.useEffect(() => {
    if (calendarResponse && formattedDate) {
      const events = calendarResponse.data.flatMap((item: any) => {
        if (dayjs(item.date).format('YYYY-MM-DD') === formattedDate) {
          console.log('đung ngay ')
          return item.requests.map((request: any) => ({
            ...request,
            date: item.date,
            customerName: request.customerName,
            message: request.description,
            subPackage: request.package
          }))
        }
        return []
      })

      setEventsForDate(events as EventType[])
    }
  }, [calendarResponse, formattedDate])
  return (
    <Modal visible={visible} title={`Events for ${selectedDate}`} onCancel={onClose} footer={null} width={800} centered>
      <Collapse accordion>
        {eventsForDate.map((event: any, index: any) => (
          <Panel header={`${event.timePeriod.startTime} - ${event.timePeriod.endTime}`} key={index}>
            <p>
              <strong>Customer:</strong> {event.customerName || 'N/A'}
            </p>
            <p>
              <strong>Message:</strong> {event.description || 'N/A'}
            </p>
            <p>
              <strong>Package:</strong> {event.subPackage?.title || 'N/A'}
            </p>
            <p>
              <strong>Price:</strong> {event.subPackage?.price || 'N/A'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
        <Button type="link" href={event.meetUrl} target="_blank">Meet URL</Button>
        <CommonButton type="primary" onClick={() => setChatVisible(true)}>Chat</CommonButton>
      </div>

          
          </Panel>
        ))}
      </Collapse>
      <ChatWindow visible={isChatVisible} onClose={() => setChatVisible(false)} />
    </Modal>
  )
}

export default ModalCalendarDetails
