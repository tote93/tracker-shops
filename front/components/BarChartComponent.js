import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function BarChartComponent({ chartData = [], wSize = "100%", hSize = 300, firstBar = "x", secondBar = "y" }) {
  return (
    <ResponsiveContainer width={wSize} height={hSize}>
      <BarChart
        width={600}
        height={400}
        data={chartData}
        margin={{
          top: 0,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={firstBar} fill="#8884d8" />
        <Bar dataKey={secondBar} fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
