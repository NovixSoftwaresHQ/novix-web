import { Maximize2, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useConsultation } from '../../context/ConsultationContext.jsx'
import { enquiryLabel } from '../../data/companyData.js'
import Button from '../ui/Button.jsx'
import SectionHeader from '../ui/SectionHeader.jsx'
import SectionReveal from '../ui/SectionReveal.jsx'

// It plays by itself (muted) while at least this share of it is on screen, and pauses when less than this is.
const PLAY_ABOVE = 0.55
const PAUSE_BELOW = 0.25
const LOAD_MARGIN = '600px' // it starts loading when it is this close to the screen

/**
 * A film on a page. The poster (the film's first frame) shows at once in a reserved space, so nothing jumps.
 * The video loads as the visitor approaches, plays muted while mostly in view, and pauses when scrolled past or
 * in a hidden tab; a visitor's own pause is respected. With reduced motion or data saving it waits for the play
 * button. At the end it offers the enquiry form. Without JavaScript the browser's own controls work.
 */
export default function FeatureVideo({ video, topic, context }) {
  const media = useRef(null)
  const frame = useRef(null)
  const wanted = useRef(false) // play whenever it is in view: false once the visitor pauses it, or it has ended
  const inView = useRef(false)
  const [enhanced, setEnhanced] = useState(false) // our controls replace the browser's once the page runs
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ended, setEnded] = useState(false)
  const [offerPlay, setOfferPlay] = useState(false) // the large button in the middle
  const [progress, setProgress] = useState(0)
  const { openConsultation } = useConsultation()
  const uid = useId()

  // If the browser refuses (autoplay rules), offer the play button instead.
  const start = () => media.current.play().catch(() => setOfferPlay(true))

  useEffect(() => {
    const element = media.current
    element.muted = true
    setEnhanced(true)
    const saving = Boolean(navigator.connection?.saveData)
    const calm = saving || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    wanted.current = !calm
    setOfferPlay(calm)

    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        approach.disconnect()
        if (!saving) element.preload = 'auto'
      },
      { rootMargin: LOAD_MARGIN },
    )
    const watch = new IntersectionObserver(
      ([entry]) => {
        const mostly = entry.intersectionRatio >= PLAY_ABOVE || entry.intersectionRect.height >= window.innerHeight * 0.6
        if (mostly) {
          inView.current = true
          if (wanted.current && element.paused && !document.hidden) start()
        } else if (entry.intersectionRatio < PAUSE_BELOW) {
          inView.current = false
          if (!element.paused) element.pause() // sound never follows the visitor down the page
        }
      },
      { threshold: [0, PAUSE_BELOW, PLAY_ABOVE, 0.8, 1] },
    )
    approach.observe(element)
    watch.observe(element)
    const onVisibility = () => {
      if (document.hidden) element.pause()
      else if (inView.current && wanted.current && element.paused) start()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      approach.disconnect()
      watch.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const togglePlay = () => {
    const element = media.current
    if (element.paused || element.ended) {
      if (element.ended) element.currentTime = 0
      wanted.current = true
      start()
    } else {
      wanted.current = false
      element.pause()
      setOfferPlay(true)
    }
  }
  const toggleSound = () => {
    const element = media.current
    element.muted = !element.muted
    if (!element.muted && element.paused && !element.ended) {
      wanted.current = true
      start()
    }
  }
  const fullScreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else if (frame.current.requestFullscreen) frame.current.requestFullscreen().catch(() => {})
    else media.current.webkitEnterFullscreen?.() // iPhone
  }

  return (
    <section id="watch" aria-labelledby={`${uid}-title`} className="pb-14 lg:pb-20">
      <div className="container-page">
        <SectionHeader id={`${uid}-title`} eyebrow={video.eyebrow} title={video.title} description={video.description} />
        <SectionReveal className="relative isolate mx-auto mt-8 max-w-5xl">
          <div aria-hidden="true" className="accent-glow absolute -inset-x-4 -inset-y-4 -z-10 rounded-[2.5rem] blur-3xl sm:-inset-x-6" />
          <figure ref={frame} className="feature-video relative overflow-hidden rounded-panel border border-edge bg-black shadow-lift">
            <video
              ref={media}
              className="block aspect-[1280/548] h-auto w-full object-contain"
              width={video.width}
              height={video.height}
              poster={video.poster}
              preload="none"
              playsInline
              controls={!enhanced}
              aria-label={video.title}
              aria-describedby={`${uid}-story`}
              onClick={enhanced ? togglePlay : undefined}
              onPlay={() => {
                setPlaying(true)
                setEnded(false)
                setOfferPlay(false)
              }}
              onPause={() => setPlaying(false)}
              onWaiting={() => setBuffering(true)}
              onPlaying={() => setBuffering(false)}
              onEnded={() => {
                wanted.current = false
                setEnded(true)
              }}
              onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
              onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime / (event.currentTarget.duration || 1))}
            >
              <source src={video.src} type="video/mp4" />
              <a href={video.src}>Download the video</a>
            </video>

            {enhanced && !ended && offerPlay && !playing && (
              <button type="button" onClick={togglePlay} className="feature-video-big" aria-label="Play video">
                <Play aria-hidden="true" className="h-7 w-7 translate-x-0.5 fill-current" />
              </button>
            )}
            {buffering && playing && <span aria-hidden="true" className="feature-video-spinner" />}

            {enhanced && ended && (
              <div className="rise absolute inset-0 grid place-content-center justify-items-center gap-3 bg-black/80 p-4 text-center text-white">
                <p className="text-sm font-semibold sm:text-xl">{video.endLine}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button size="sm" arrow onClick={() => openConsultation({ topic, context })}>{enquiryLabel}</Button>
                  <button type="button" onClick={togglePlay} className="inline-flex min-h-9 items-center gap-2 rounded-control border border-white/40 px-4 text-sm font-semibold text-white transition hover:bg-white/15 focus-visible:outline-white">
                    <RotateCcw aria-hidden="true" className="h-4 w-4" /> Watch again
                  </button>
                </div>
              </div>
            )}

            {enhanced && (
              // Stays visible while muted, so the sound is easy to find; with sound on it fades while you watch.
              // At the end it is hidden but keeps its space (on phones it sits under the picture).
              <div className={`feature-video-bar ${ended ? 'invisible' : ''}`} data-autohide={playing && !muted ? '' : undefined}>
                <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'}>
                  {playing ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
                </button>
                <button type="button" onClick={toggleSound}>
                  {muted ? <VolumeX aria-hidden="true" className="h-4 w-4" /> : <Volume2 aria-hidden="true" className="h-4 w-4" />}
                  {muted ? 'Unmute' : 'Mute'}
                </button>
                <button type="button" onClick={fullScreen} aria-label="Full screen">
                  <Maximize2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            )}
            {enhanced && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/15">
                <div className="h-full origin-left bg-primary transition-transform duration-300 ease-linear" style={{ transform: `scaleX(${ended ? 1 : progress})` }} />
              </div>
            )}
          </figure>
          <details className="mt-3 text-center text-sm">
            <summary className="inline-block cursor-pointer py-1 font-semibold text-primary underline-offset-4 hover:underline">What happens in the video</summary>
            <p id={`${uid}-story`} className="mx-auto mt-2 max-w-3xl leading-6">{video.transcript}</p>
          </details>
        </SectionReveal>
      </div>
    </section>
  )
}
