// EventModal.tsx
import React, { useEffect, useState } from 'react'
import { Modal, Collapse, Button } from 'antd'
import { EventType } from '../../../../Models/calendar'
import { useQuery } from 'react-query'
import { getAppointment } from '../../../../api/calendarApi'
import ChatWindow from './modalChat'
import { CommonButton } from '../../../../UI/button/Button'

const { Panel } = Collapse

interface ModalCalendarDetailProps {
  visible: boolean
  selectedDate: string
  onClose: () => void
}

const ModalCalendarDetails: React.FC<ModalCalendarDetailProps> = ({ visible, selectedDate, onClose }) => {
  const [eventsForDate, setEventsForDate] = useState<EventType[]>([])
  const [isChatVisible, setChatVisible] = useState(false)
  const [currentAppointmentId, setCurrentAppointmentId] = useState<number | null>(null)

  const { data: calendarResponse } = useQuery('calendar', getAppointment, {
    refetchOnMount: true,
    refetchInterval: 60000,
  })

  useEffect(() => {
    if (calendarResponse) {
      const formattedDate = selectedDate
      const events = calendarResponse.data.filter((item: any) => {
        return item.appointmentDate.startsWith(formattedDate)
      }).map((item: any) => ({
        appointmentId: item.id,
        timePeriod: item.timePeriod,
        description: item.description,
        subPackage: {
          title: item.packageName,
          price: item.fee,
        },
      }))

      setEventsForDate(events)
    }
  }, [calendarResponse, selectedDate])

  return (
    <Modal visible={visible} title={`Events for ${selectedDate}`} onCancel={onClose} footer={null} width={800} centered>
      <Collapse accordion>
        {eventsForDate.map((event: any, index: any) => (
          <Panel header={`${event.timePeriod.startTime} - ${event.timePeriod.endTime}`} key={index}>
            {/* <p>
              <strong>Customer:</strong> {event.customerName || 'N/A'}
            </p> */}
            <p>
              <strong>Mô tả:</strong> {event.description || 'N/A'}
            </p>
            <p>
              <strong>Gói:</strong> {event.subPackage?.title || 'N/A'}
            </p>
            <p>
              <strong>Giá:</strong> {event.subPackage?.price || 'N/A'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px' }}>
              <Button type="link" href={event.meetUrl} target="_blank">Meet URL</Button>
              <CommonButton 
                type="primary" 
                onClick={() => {
                  setCurrentAppointmentId(event.appointmentId)
                  setChatVisible(true)
                  console.log(currentAppointmentId)
                }}
              >
               Trò Chuyện
              </CommonButton>
            </div>
          </Panel>
        ))}
      </Collapse>
      <ChatWindow 
        visible={isChatVisible} 
        onClose={() => setChatVisible(false)} 
        appointmentId={currentAppointmentId || 0} 
      />
    </Modal>
  )
}

export default ModalCalendarDetails
