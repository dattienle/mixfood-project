// EventModal.tsx
import React, { useState } from 'react'
import { Modal, Collapse, Input, Button } from 'antd'
import { EventType, Requests } from '../../../../Models/calendar'
import { addMeetUrl, getCalendarByTime, getFullCalendar } from '../../../../api/calendarApi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import dayjs, { Dayjs } from 'dayjs'
import { toast } from 'react-toastify'
import { CommonButton } from '../../../../UI/button/Button'

const { Panel } = Collapse

interface ModalCalendarDetailProps {
  visible: boolean
  selectedDate: string
  onClose: () => void
}

const ModalCalendarDetails: React.FC<ModalCalendarDetailProps> = ({ visible, selectedDate, onClose }) => {
  const [eventsForDate, setEventsForDate] = useState<EventType[]>([])
  const { data: calendarResponse, isLoading } = useQuery('calendarByTime', getFullCalendar, {
    refetchInterval: 60000 // Thêm dòng này để fetch API mỗi 60 giây
  })
  const [meetUrlInputVisible, setMeetUrlInputVisible] = useState<number | null>(null)
  const [meetUrlInputValue, setMeetUrlInputValue] = useState('')
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
        toast.success('Upload Meet URL Thành Công')
        queryClient.invalidateQueries('calendarByTime')
        setMeetUrlInputVisible(null)
        setMeetUrlInputValue('')
      },
      onError: (error) => {
        toast.error('Upload Meet URL Thất Bại')
        console.error('Error updating request:', error)
      }
    }
  )

  const handleAddMeetUrl = (index: number) => {
    setMeetUrlInputVisible(index)
  }
  const handleMeetUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeetUrlInputValue(e.target.value)
  }
  const handleSaveMeetUrl = (eventId: number) => {
    updateRequestMutation({ requestId: eventId, meetUrl: meetUrlInputValue })
  }
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
              <strong>Khách Hàng:</strong> {event.customerName || 'N/A'}
            </p>
            <p>
              <strong>Yêu Cầu Tư Vấn:</strong> {event.description || 'N/A'}
            </p>
            <p>
              <strong>Gói:</strong> {event.subPackage?.title || 'N/A'}
            </p>
            <p>
              <strong>Giá:</strong> {event.subPackage?.price || 'N/A'}
            </p>
            <p>
              <strong>Meet URL:</strong> {event.meetUrl || 'N/A'}
            </p>

            {!event.meetUrl && meetUrlInputVisible === index ? ( // Conditional rendering for input
              <div>
                <Input value={meetUrlInputValue} onChange={handleMeetUrlInputChange} />
                <CommonButton onClick={() => handleSaveMeetUrl(event.id)} type='primary'>
                  Lưu
                </CommonButton>
              </div>
            ) : (
              !event.meetUrl && <CommonButton onClick={() => handleAddMeetUrl(index)}>Thêm Meet URL</CommonButton>
            )}
          </Panel>
        ))}
      </Collapse>
    </Modal>
  )
}

export default ModalCalendarDetails
