import React from 'react';
import { Column, Line, Pie, Area, Bar } from '@ant-design/charts';

export default function Dashboard() {
  const data = [
    { month: 'Jan', revenue: 30000 },
    { month: 'Feb', revenue: 35000 },
    { month: 'Mar', revenue: 40000 },
    // ... dữ liệu khác
  ];

  const columnConfig = {
    data,
    xField: 'month',
    yField: 'revenue',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      month: { alias: 'Tháng' },
      revenue: { alias: 'Doanh thu' },
    },
  };

  const lineConfig = {
    data,
    xField: 'month',
    yField: 'revenue',
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      month: { alias: 'Tháng' },
      revenue: { alias: 'Doanh thu' },
    },
  };

  const pieData = [
    { type: 'Product A', value: 40 },
    { type: 'Product B', value: 21 },
    { type: 'Product C', value: 17 },
    { type: 'Product D', value: 13 },
    { type: 'Product E', value: 9 },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div>
      <h2>Biểu đồ cột</h2>
      <Column {...columnConfig} />
      <h2>Biểu đồ đường</h2>
      <Line {...lineConfig} />
      <h2>Biểu đồ tròn</h2>
      <Pie {...pieConfig} />
    </div>
  );
}
