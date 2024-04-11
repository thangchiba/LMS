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
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
    youtube.current = event.target
  }

  const onPause = async () => {
    try {
      // toast.error('No pause mat roi')
    } catch (e) {}
  }
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
          <YouTube
            videoId="9NqthBLHBDg"
            // videoId={playbackId} // Or any default video ID like "mkFDlAXRNb4"
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
                controls: 1,
                rel: 0,
                showinfo: 1,
                mute: 0,
                origin: 'https://lms.thangchiba.com',
              },
            }}
            className="absolute top-0 left-0 right-0 bottom-0"
            onReady={onPlayerReady}
            onEnd={onEnd}
            onPause={onPause}
          />
        </div>
      )}
    </div>
  )
}
