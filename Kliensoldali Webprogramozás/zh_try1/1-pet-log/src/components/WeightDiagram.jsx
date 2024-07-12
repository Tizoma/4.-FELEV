// ‼️ Ezt a komponenst nem kell módosítanod ‼️

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const WeightDiagram = ({ weightHistory }) => {
  const data = Object.keys(weightHistory).map(date => ({
    date: new Date(date).toLocaleDateString(),
    weight: weightHistory[date]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeightDiagram;
