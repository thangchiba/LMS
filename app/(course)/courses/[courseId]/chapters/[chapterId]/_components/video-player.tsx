'use client'

import axios from 'axios'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'
import { useConfettiStore } from '@/hooks/use-confetti-store'
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube'

interface VideoPlayerProps {
  playbackId: string
  courseId: string
  chapterId: string
  nextChapterId?: string
  isLocked: boolean
  completeOnEnd: boolean
  title: string
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  const confetti = useConfettiStore()
  const youtube = useRef<YouTubePlayer>(null)
  const [showDialog, setShowDialog] = useState(false) // State to manage dialog visibility

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        })

        if (!nextChapterId) {
          confetti.onOpen()
        }

        toast.success('Progress updated!')
        router.refresh()

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
      }
    } catch {
      toast.error('Something went wrong')
    }
  }
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    setIsReady(true)
    event.target.pauseVideo()
    youtube.current = event.target
  }

  const onPause = async () => {
    try {
      // toast.error('No pause mat roi')
    } catch (e) {}
  }
  const closeDialogAndResumeVideo = () => {
    setShowDialog(false)
    youtube.current?.playVideo() // Resume video playback when the dialog is closed
  }

  // useEffect(() => {
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     if (event.key === 'b' || event.key === 'B') {
  //       setShowDialog(true)
  //       youtube.current?.pauseVideo()
  //     }
  //   }
  //
  //   // Attach the event listener to the document
  //   document.addEventListener('keydown', handleKeyPress)
  //
  //   return () => {
  //     // Don't forget to remove the event listener
  //     document.removeEventListener('keydown', handleKeyPress)
  //   }
  // }, [])

  return (
    <div className="relative aspect-video w-full min-h-full">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <div className="relative" style={{ width: '100%', paddingBottom: '56.25%' }}>
          <div style={{ borderRadius: '50px', overflow: 'hidden', width: '100%', height: '100%' }}>
            <YouTube
              videoId="9NqthBLHBDg"
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  autoplay: 1,
                  controls: 2,
                  rel: 0,
                  showinfo: 1,
                  mute: 0,
                  origin: 'https://lms.thangchiba.com',
                },
              }}
              loading="lazy"
              className="absolute top-0 left-0 right-0 bottom-0"
              onReady={onPlayerReady}
              onEnd={onEnd}
              onPause={onPause}
            />
          </div>
        </div>
      )}
      {showDialog && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4">
            <textarea className="w-full h-32" placeholder="Enter content here..." />
            <button onClick={closeDialogAndResumeVideo}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
