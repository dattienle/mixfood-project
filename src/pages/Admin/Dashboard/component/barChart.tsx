import { useTheme } from '@mui/material'
import { ResponsiveBar } from '@nivo/bar'
import React from 'react'
import { tokens } from '../styles/theme'
import { useQuery } from 'react-query'
import { format } from 'date-fns'
import { getDashboard } from '../../../../api/dashboardApi'
const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme()
  const colors = [
    '#eed312',
    '#38bcb2',
    '#ff5733',
    '#33ff57',
    '#3357ff',
    '#ff33a1',
    '#a133ff',
    '#ffbd33',
    '#33ffd6',
    '#d633ff'
  ]

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

  if (isLoading) {
    return <div>Loading...</div> 
  }
  const topIngredients = dashboardResponse?.data?.topIngredients
  const data = topIngredients?.map((ingredient: any, index: number) => ({
    ingredientName: ingredient.ingredientName,
    quantity: ingredient.totalQuantity,
    color: colors[index % colors.length]
  }))
  // console.log('data', data)
  return (
    <ResponsiveBar
      data={data}
      keys={['quantity']}
      indexBy='ingredientName'
      tooltip={({ indexValue, value, color }) => (
        <div
          style={{
            padding: '2px 10px ',
            color: 'black',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div style={{ width: 13, height: 13, backgroundColor: color, marginRight: 8 }} /> {/* Màu sắc cột */}
          {indexValue}: <strong>{value} </strong>
          {/* Nội dung hiển thị */}
        </div>
      )}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={(d) => d.data.color.toString()}
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#38bcb2',
          size: 4,
          padding: 1,
          stagger: true
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#eed312',
          rotation: -45,
          lineWidth: 6,
          spacing: 10
        }
      ]}
      borderColor={{
        from: 'color'
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'country', // changed
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'food', // changed
        legendPosition: 'middle',
        legendOffset: -40
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1.6]]
      }}
      legends={[
        {
          dataFrom: 'indexes',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      role='application'
      // barAriaLabel={function (e) {
      //   return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      // }}
    />
  )
}

export default BarChart
