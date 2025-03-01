import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
const DataCard = ({value,label,shouldFormat=false}) => {
  return (
    <Card>
      <CardHeader className='flex iems-center justify-between space-y-0 pb-2' >
        <CardTitle className='text-sm font-medium'>
            {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
            {shouldFormat?new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(value):value}
        </div>
      </CardContent>
    </Card>
  )
}

export default DataCard