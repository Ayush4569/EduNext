import InfoCard from '@/components/InfoCard';
import React from 'react'

const Teacheranalytics = () => {
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard label="Total revenue" className='bg-sky-500/20'  value={300} />
        <InfoCard label="Total sales" className='bg-green-200/50' value={2} />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 w-full">
        
      </div>
    </div>
  )
}

export default Teacheranalytics