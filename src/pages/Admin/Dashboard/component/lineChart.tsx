import { useTheme } from '@mui/material'
import { ResponsiveLine } from '@nivo/line'
import { tokens } from '../styles/theme'
import { mockLineData as data } from '../data/barChartData'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { getDashboardYear } from '../../../../api/dashboardApi'
interface LineChartProps {
  selectedYear: number
  isDashboard?: boolean
}
const LineChart: React.FC<LineChartProps> = ({ selectedYear, isDashboard = false }) => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const { data, isLoading, error } = useQuery(['revenueByYear', selectedYear], () => getDashboardYear(selectedYear), {
    enabled: !!selectedYear
  })

  // Kiểm tra trạng thái loading và error
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error fetching data</div>
  const chartData = [
    {
      id: 'Doanh thu',
      color: tokens(theme.palette.mode).greenAccent[500],
      data: data.data.map((item: any) => ({ x: item.month, y: item.foodRevenue }))
    }
  ]
  return (
    <>
      <ResponsiveLine
        data={chartData}
        tooltip={({ point }) => (
          <div
            style={{
              background: 'white',
              padding: '9px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <div>
              <strong>Tháng: </strong>
              {point.data.xFormatted}
            </div>
            <div>
              <strong>$: </strong> {point.data.y.toLocaleString()}
            </div>
          </div>
        )}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100]
              }
            },
            legend: {
              text: {
                fill: colors.grey[100]
              }
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1
              },
              text: {
                fill: colors.grey[100]
              }
            }
          },
          legends: {
            text: {
              fill: colors.grey[100]
            }
          },
          tooltip: {
            container: {
              color: colors.primary[500]
            }
          }
        }}
        colors={isDashboard ? { datum: 'color' } : { scheme: 'nivo' }} // added
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: 'auto',
          stacked: true,
          reverse: false
        }}
        yFormat=' >-.2f'
        curve='catmullRom'
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'transportation',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : 'count',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ]
          }
        ]}
      />
    </>
  )
}

export default LineChart
