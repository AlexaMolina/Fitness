import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = ({ data }) => {
  return (
    <div>
      <h2>Actividad</h2>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="steps" stroke="#8884d8" />
        <Line type="monotone" dataKey="calories" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
};

export default Dashboard;
