import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartComponentProps {
  data: { [key: string]: any }[];
  xAxisKey: string;
  yAxisKey: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, xAxisKey, yAxisKey }) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: '800px', height: '500px' }}>
      <BarChart
        width={800}
        height={500}
        data={data}
        margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} interval={0} angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="bottom" align="center" wrapperStyle={{paddingTop: '30px', }}/>
        <Bar dataKey={yAxisKey} fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BarChartComponent;
