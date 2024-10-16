import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartComponentProps {
  data: { season_name: string; rank: number }[];
  xAxisKey: string;
  yAxisKey: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, xAxisKey, yAxisKey }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '800px', height: '400px' }}>
      <BarChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, left: 50, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} interval={0} angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={yAxisKey} fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BarChartComponent;
