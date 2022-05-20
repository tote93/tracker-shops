import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getRandomColor } from "../utils/shared";

export default function SimpleAreaChart({ chartData = [], wSize = "100%", hSize = 300, xValue = "x" }) {
  const randColor = getRandomColor()
  return (
    <ResponsiveContainer width={wSize} height={hSize}>
      <AreaChart
        width={600}
        height={400}
        data={chartData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey={xValue} stroke={randColor} fill={randColor} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
