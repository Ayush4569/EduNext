import { cn } from '@/lib/utils'
import { Loader2, Lock } from 'lucide-react'
import React, { useState } from 'react'

const VideoPlayer = ({videoUrl,isLocked}) => {
    const [isReady, setIsReady] = useState(false)
  return (
    <div className='relative aspect-video'>
    {
      !isLocked && !isReady &&(
        <div className='flex items-center justify-center inset-0 absolute bg-slate-800'>
            <Loader2 className="animate-spin text-secondary h-8 w-8"  />
        </div>
      )
    }
    {
      isLocked && (
        <div className='flex flex-col text-secondary gap-y-2 items-center justify-center inset-0 absolute bg-slate-800'>
            <Lock className="h-8 w-8"  />
            <p className='text-sm'>This chapter is locked</p>
        </div>
      )
    }
    {
        !isLocked && (
            <video
                src={videoUrl}
                className={cn(!isReady && 'hidden')}
                controls
                onCanPlay={() => setIsReady(true)}
                />
        )
    }
    </div>
  )
}

export default VideoPlayer