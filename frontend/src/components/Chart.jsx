
import React from 'react'
import { Bar, ResponsiveContainer, XAxis, YAxis,BarChart, Tooltip } from 'recharts'
import { Card } from './ui/card'

const Chart = ({data}) => {
  return (
    <Card className='mt-4'>
        <ResponsiveContainer width="100%" height={500} >
            <BarChart data={data} >
                <XAxis 
                dataKey="title"
                stroke='#888888'
                tickLine={false}
                axisLine={false}
                fontSize={12}

                 />
                <YAxis
                tickLine={false}
                minTickGap={5}
                axisLine={false}
                tickFormatter={(price) => `₹${price}`}
                stroke='#888888'
                fontSize={12}
                 />
                 <Tooltip />
                 <Bar dataKey="price" fill="#0369a1"  radius={[4,4,0,0]} />
            </BarChart>
        </ResponsiveContainer>
    </Card>
  )
}

export default Chart