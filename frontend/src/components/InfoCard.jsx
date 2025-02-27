import React from 'react'

const InfoCard = ({value,label,icon:Icon,className}) => {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
       <div className="flex items-center gap-x-2">
              <div className={`h-12 w-12 p-3 rounded-full flex items-center justify-center ${className}`}>
                <Icon className="h-6 w-6 object-cover" />
              </div>
            </div>
       <div>
        <p className='font-medium'>{label}</p>
        <p className='text-gray-500 text-sm'>
            {value} {value===1?'course':'courses'}
        </p>
       </div>
    </div>
  )
}

export default InfoCard