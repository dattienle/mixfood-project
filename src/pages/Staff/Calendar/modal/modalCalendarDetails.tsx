// EventModal.tsx
import React, { useState } from 'react';
import { Modal, Collapse } from 'antd';
import { EventType, Requests } from '../../../../Models/calendar';
import {  getCalendarByTime, getFullCalendar } from '../../../../api/calendarApi';
import { useQuery } from 'react-query';
import dayjs,{ Dayjs } from 'dayjs'


const { Panel } = Collapse;

interface ModalCalendarDetailProps {
  visible: boolean;
  selectedDate: string;
  onClose: () => void;
}

const ModalCalendarDetails: React.FC<ModalCalendarDetailProps> = ({ visible, selectedDate, onClose }) => {
  const [eventsForDate, setEventsForDate] = useState<EventType[]>([])
  const { data: calendarResponse , isLoading} = useQuery('calendarByTime', getFullCalendar)
  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
  React.useEffect(() => {
    if (calendarResponse && formattedDate) {
      const events = calendarResponse.data.flatMap((item: any) => {
        if (dayjs(item.date).format('YYYY-MM-DD') === formattedDate) {
        console.log("đung ngay ")
          return item.requests.map((request: any) => ({
            ...request, 
            date: item.date,
            customerName: request.customerName,
            message: request.description, 
            subPackage: request.package
          }));
        }
        return [];
      });

      setEventsForDate(events as EventType[]);
    }

  }, [calendarResponse, formattedDate]);
  return(
    <Modal
    visible = {visible}
      title={`Events for ${selectedDate}`}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
         
      <Collapse accordion>
        {eventsForDate.map((event:any, index:any) => (
           <Panel header={`${event.timePeriod.startTime} - ${event.timePeriod.endTime}`} key={index}> 
           <p><strong>Customer:</strong> {event.customerName || 'N/A'}</p>
           <p><strong>Message:</strong> {event.description || 'N/A'}</p>
           <p><strong>Package:</strong> {event.subPackage?.title || 'N/A'}</p>
           <p><strong>Price:</strong> {event.subPackage?.price || 'N/A'}</p>

         </Panel>
        ))}
      </Collapse>
    </Modal>
  )

}



export default ModalCalendarDetails;
