import { Box, Typography, useTheme ,Select, MenuItem} from '@mui/material'
import StatBox from './component/statBox'
import Header from './component/header'
import { tokens } from './styles/theme'
import EmailIcon from '@mui/icons-material/Email'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TrafficIcon from '@mui/icons-material/Traffic'
import LineChart from './component/lineChart'
import { mockTransactions } from './data/barChartData'
import BarChart from './component/barChart'
import { useQuery } from 'react-query'
import { getDashboard } from '../../../api/dashboardApi'
import { format } from 'date-fns'

import { useState } from 'react'
import LineChart2 from './component/lineChart2'
const Dashboard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const currentDate = new Date()
  const day = format(currentDate, 'MM/dd/yyyy') // Lấy ngày
  const month = format(currentDate, 'MM/dd/yyyy')
  const { data: dashboardResponse, isLoading } = useQuery(
    ['dashboard', { day, month }],
    () => getDashboard(day, month),
    {
      refetchOnMount: true,
      refetchInterval: 6000
    }
  )
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  // console.log(dashboardResponse?.data || [])
  const revenueByDayFood = dashboardResponse?.data?.revenueByDayFood || 0
  const revenueByYearFood = dashboardResponse?.data?.revenueByYearFood || 0
  const revenueByYearSchedule = dashboardResponse?.data?.revenueByYearSchedule || 0


  const revenueByDaySchedule = dashboardResponse?.data?.revenueByDaySchedule || 0
  const topCustomer = dashboardResponse?.data?.topCustomers || []

  const handleYearChange = (event: any) => {
    setSelectedYear(event.target.value)
  }
  return (
    <Box m='20px'>
      {/* HEADER */}
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Header title='THỐNG KÊ' subtitle='Thống Kê Dữ Liệu Của Hệ Thống' />
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          sx={{ minWidth: 100, backgroundColor: '#fff' }} // Thêm style cho Select
        >
          {[...Array(5)].map((_, index) => {
            const year = currentDate.getFullYear() - index
            return (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            )
          })}
        </Select>
      </Box>

      {/* GRID & CHARTS */}
      <Box display='grid' gridTemplateColumns='repeat(12, 1fr)' gridAutoRows='140px' gap='20px'>
        {/* ROW 1 */}
        <Box gridColumn='span 3' bgcolor={'white'} display='flex' alignItems='center' justifyContent='center'>
          <StatBox
            title={revenueByDayFood.toString()}
            subtitle='Doanh thu đặt đồ ăn'
            progress='0.75'
            increase='+14%'
            icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>
        <Box gridColumn='span 3' bgcolor={'white'} display='flex' alignItems='center' justifyContent='center'>
          <StatBox
            title={revenueByDaySchedule.toString()}
            subtitle='Doanh thu đặt lịch'
            progress='0.50'
            increase='+21%'
            icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>
        <Box gridColumn='span 3' bgcolor={'white'} display='flex' alignItems='center' justifyContent='center'>
          <StatBox
            title='32,441'
            subtitle='Số Lượng Khách Hàng'
            progress='0.30'
            increase='+5%'
            icon={<PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>
        <Box gridColumn='span 3' bgcolor={'white'} display='flex' alignItems='center' justifyContent='center'>
          <StatBox
            title='1,325,134'
            subtitle='Traffic Received'
            progress='0.80'
            increase='+43%'
            icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
          />
        </Box>

        {/* / ROW 2 */}
        <Box gridColumn='span 8' gridRow='span 2' bgcolor={'white'}>
          <Box mt='25px' p='0 30px' display='flex ' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography variant='h5' fontWeight='600' color={colors.grey[100]}>
                Doanh Thu Đặt Đồ Ăn
              </Typography>
              <Typography variant='h5' fontWeight='bold' color={colors.greenAccent[500]}>
              {revenueByYearFood.toLocaleString('vi-VN')} VNĐ
              </Typography>
            </Box>
          </Box>
          <Box height='250px' m='-20px 0 0 0'>
            <LineChart isDashboard={true} selectedYear={selectedYear} />
          </Box>
        </Box>
        <Box gridColumn='span 4' gridRow='span 2' bgcolor={'white'} overflow='auto'>
          {/* Top những khách hàng */}
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            borderBottom={`4px solid ${colors.primary[500]}`}
            p='15px'
          >
            <Typography color={colors.grey[100]} variant='h6' fontWeight='600'>
              Những Khách Hàng Mua Nhiều Nhất
            </Typography>
          </Box>
          {topCustomer.map((customer:any, i: number) => (
            <Box
              key={`${customer.customerId}-${i}`}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              borderBottom={`4px solid ${colors.primary[500]}`}
              p='15px'
            >
              <Box>
                <Typography color={colors.greenAccent[500]} variant='h6' fontWeight='600'>
                {i + 1}
                </Typography>
                <Typography color={colors.grey[100]}>{customer.customerName}</Typography>
              </Box>
              {/* <Box color={colors.grey[100]}>{transaction.date}</Box> */}
              <Box 
  bgcolor={colors.greenAccent[500]} 
  p='5px 15px' 
  borderRadius='20px'
  display='flex'
  alignItems='center'
  gap='5px'
>
  <Typography variant='body2' color='white'>
    {customer.orderCount}
  </Typography>
  <Typography variant='body2' color='white' fontSize='0.8rem'>
    đơn hàng
  </Typography>
</Box>
            </Box>
          ))}
        </Box>
        {/* ROW 3 */}
        <Box gridColumn='span 6' gridRow='span 2' bgcolor='white'>
          <Box>
            
          </Box>
          <Typography variant='h5' fontWeight='600' sx={{ padding: '30px 30px 0 30px' }}>
            Top Nguyên Liệu
          </Typography>
          <Box height='300px' mt='-20px'>
            <BarChart isDashboard={true} />
          </Box>
          
        </Box>
        <Box gridColumn='span 6' gridRow='span 2' bgcolor='white'>
  <Box mt='25px' p='0 30px' display='flex' justifyContent='space-between' alignItems='center'>
    <Box>
      <Typography variant='h5' fontWeight='600' color={colors.grey[100]}>
        Doanh Thu Đặt Lịch
      </Typography>
      <Typography variant='h5' fontWeight='bold' color={colors.greenAccent[500]}>
      {revenueByYearSchedule.toLocaleString('vi-VN')} VNĐ
      </Typography>
    </Box>
  </Box>
  <Box height='250px' m='-20px 0 0 0'>
    <LineChart2 isDashboard={true} selectedYear={selectedYear} />
  </Box>
</Box>
      </Box>
    </Box>
  )
}

export default Dashboard
