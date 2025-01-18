import React from 'react'

const Options = ({field}) => {
  return (
    <select {...field} className='p-3 rounded-md w-full text-sm'>
    <option value="" disabled>Select an category</option>
    <option value="Computer science"> Computer science</option>
    <option value="Music">Music</option>
    <option value="Fitness">Fitness</option>
    <option value="Photography">Photography</option>
    <option value="Accounting">Accounting</option>
    <option value="Engineering">Engineering</option>
    <option value="Filming">Filming</option>
  </select>
  )
}

export default Options