// EventModal.tsx
import React, { useEffect, useState } from 'react'
import { Modal, Collapse, Button } from 'antd'
import { EventType } from '../../../../Models/calendar'
import { useQuery } from 'react-query'
import { getAppointment } from '../../../../api/calendarApi'
import ChatWindow from './modalChat'
import { CommonButton } from '../../../../UI/button/Button'
import ModalAddReport from './modalAddReport'
import { getReport, getReportById } from '../../../../api/reportApi'
import { report } from 'process'
import ModalPreviewReport from './modalPreviewReport'

const { Panel } = Collapse

interface ModalCalendarDetailProps {
  visible: boolean
  selectedDate: string
  onClose: () => void
}

const ModalCalendarDetails: React.FC<ModalCalendarDetailProps> = ({ visible, selectedDate, onClose }) => {
  const [eventsForDate, setEventsForDate] = useState<EventType[]>([])
  const [isChatVisible, setChatVisible] = useState(false)
  const [isReportVisible, setIsReportVisible] = useState(false)
  const [previewReportVisible, setPreviewReportVisible] = useState(false)
  const [currentAppointmentId, setCurrentAppointmentId] = useState<number | null>(null)

  const { data: calendarResponse } = useQuery('calendar', getAppointment, {
    refetchOnMount: true, 
    refetchInterval: 60000
  })
  // ------ Lấy ra report -----
  const { data: reportResponse, refetch } = useQuery(['report', currentAppointmentId], () => getReport(currentAppointmentId!), {
    enabled: !!currentAppointmentId, // Chỉ gọi khi currentAppointmentId có giá trị
    refetchOnMount: true,
    refetchInterval: 60000
  })
  // console.log(currentAppointmentId)
  // console.log('event', eventsForDate)
  const handleAddOk = async (appointmentId: number) => {
    setIsReportVisible(false)
    setCurrentAppointmentId(appointmentId)
    refetch()
  }
  useEffect(() => {
    if (calendarResponse) {
      const formattedDate = selectedDate
      const events = calendarResponse.data
        .filter((item: any) => {
          return item.appointmentDate.startsWith(formattedDate)
        })
        .map((item: any) => ({
          appointmentId: item.id,
          timePeriod: item.timePeriod,
          description: item.description,
          meetUrl: item.meetUrl,
          subPackage: {
            title: item.packageName,
            price: item.fee
          }
        }))

      setEventsForDate(events)
    }
  }, [calendarResponse, selectedDate])
  const handlePanelClick = (appointmentId: number) => {
    console.log(appointmentId)
    setCurrentAppointmentId(appointmentId)
  }
  return (
    <Modal visible={visible} title={`Events for ${selectedDate}`} onCancel={onClose} footer={null} width={800} centered>
      <Collapse accordion>
        {eventsForDate.map((event: any, index: any) => (
          <Panel
            header={
              <span
                onClick={() => handlePanelClick(event.appointmentId)}
              >{`${event.timePeriod.startTime} - ${event.timePeriod.endTime}`}</span>
            }
            key={index}
          >
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
              <a href={event.meetUrl} target='_blank' rel='noopener noreferrer'>
                <Button type='link'>Meet URL</Button>
              </a>
              <CommonButton
                type='primary'
                onClick={() => {
                  setCurrentAppointmentId(event.appointmentId)
                  setChatVisible(true)
                }}
              >
                Trò Chuyện
              </CommonButton>
              {reportResponse ? (
                 <Button
                 type='dashed'
                 target='_blank'
                 onClick={() => {
                   setCurrentAppointmentId(event.appointmentId)
                   setPreviewReportVisible(true)
                 }}
               >
                Xem Báo Cáo
               </Button>
              ) : (
                <Button
                  type='dashed'
                  target='_blank'
                  onClick={() => {
                    setCurrentAppointmentId(event.appointmentId)
                      setIsReportVisible(true)
                  
                  }}
                >
                 Thêm Báo Cáo
                </Button>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>
      <ChatWindow
        visible={isChatVisible}
        onClose={() => setChatVisible(false)}
        appointmentId={currentAppointmentId || 0}
      />
      {isReportVisible && (
        <ModalAddReport
          visible={isReportVisible}
          handleOk={handleAddOk}
          handleCancel={() => setIsReportVisible(false)}
          appointmentId={currentAppointmentId ?? 0}
        />
      )}
        {previewReportVisible && (
        <ModalPreviewReport
          visible={previewReportVisible}
          handleOk={() => handleAddOk(currentAppointmentId ?? 0)}
          handleCancel={() => setPreviewReportVisible(false)}
          appointmentId={currentAppointmentId ?? 0}
        />
      )}
    </Modal>
  )
}

export default ModalCalendarDetails
