import { Calendar } from 'antd'
import React, { useState } from 'react'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'
import './style.scss'
import ModalCalendarDetails from './modal/modalCalendarDetails'
import { EventType } from '../../../Models/calendar'
import { CommonButton } from '../../../UI/button/Button'
import { PlusOutlined } from '@ant-design/icons'
import ModalAddCanlendar from './modal/modalAddCalendar'
import { useQuery } from 'react-query'
import {  getFullCalendar } from '../../../api/calendarApi'
import dayjs from 'dayjs'

export default function CalendarForStaff() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [eventsForDate, setEventsForDate] = useState<EventType[]>([])
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode)
  }
  const { data: calendarResponse , isLoading} = useQuery('calendar', getFullCalendar)
console.log(calendarResponse)


const onSelectDate = (value: Dayjs) => {
  const formattedDate = value.format('YYYY-MM-DD');
  const events = calendarResponse?.data?.flatMap((item: any) => {
    if (dayjs(item.date).format('YYYY-MM-DD') === formattedDate) {
      return item.requests.map((request: any) => ({
        timePeriod: request.package.timePeriod,
      }));
    }
    return [];
  }) || [];

  if (events.length > 0) {
    setSelectedDate(formattedDate);
    setEventsForDate(events);
    setIsModalVisible(true);
  }
};

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }
  const dateCellRender = (value: Dayjs) => {
    const formattedDate = value.format('YYYY-MM-DD')
    if (isLoading) {
      return (
        <ul className='events'>
          <li className='no-events'>Loading...</li>
        </ul>
      );
    }

    if (!calendarResponse) {
      return (
        <ul className='events'>
          <li className='no-events'>No data available.</li>
        </ul>
      );
    }
    const events = calendarResponse?.data?.flatMap((item: any) => {
      if (dayjs(item.date).format('YYYY-MM-DD') === formattedDate  && item.requests) {
        return item.requests.map((request: any) => ({
          timePeriod: request.timePeriod,
        }));
      }
      return [];
    });
    return (
      <ul className='events'>
        {events.length > 0  ? (
          events.map((event: any, index: number) => (
            <li key={index} className='event'>
              <div className='time'>
                {event.timePeriod.startTime} - {event.timePeriod.endTime}
              </div>
            </li>
          ))
        ) : (
          <li className='no-events'></li>
        )}
      </ul>
    )
  }

  return (
    <div className='body-calendar'>
      <h1>Quản lý đặt lịch cho Khách hàng</h1>
      <CommonButton onClick={() => setIsModalAddOpen(true)} type='primary' icon={<PlusOutlined />}>
        Thêm Danh Mục
      </CommonButton>
      <Calendar dateCellRender={dateCellRender} onSelect={onSelectDate} onPanelChange={onPanelChange} />
      <ModalCalendarDetails
        visible={isModalVisible}
      
        selectedDate={selectedDate}
        onClose={handleCloseModal}
      />
      <ModalAddCanlendar
        onAddEvent={() => setIsModalAddOpen(false)}
        visible={isModalAddOpen}
        onClose={() => setIsModalAddOpen(false)}
      />
    </div>
  )
}
