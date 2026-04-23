import { useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useVesperVoice = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string, id?: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsPlaying(false)
      setPlayingId(null)
    }

    if (!text || text.trim().length === 0) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('vesper-voice', {
        body: { text },
      })

      if (error || !data?.audio) throw new Error(error?.message || 'No audio returned')

      const audioSrc = `data:${data.contentType};base64,${data.audio}`
      const audio = new Audio(audioSrc)
      audioRef.current = audio

      audio.onplay = () => { setIsPlaying(true); setPlayingId(id ?? null) }
      audio.onended = () => { setIsPlaying(false); setPlayingId(null); audioRef.current = null }
      audio.onerror = () => { setIsPlaying(false); setPlayingId(null); audioRef.current = null }

      await audio.play()
    } catch (err) {
      console.error('Vesper voice error:', err)
      setIsPlaying(false)
      setPlayingId(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsPlaying(false)
      setPlayingId(null)
    }
  }, [])

  return { speak, stop, isPlaying, isLoading, playingId }
}
