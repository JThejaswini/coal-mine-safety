import { useEffect, useRef, useState } from 'react'

const VIOLATION_CONFIG = {
  no_helmet: {
    type: 'No Helmet',
    severity: 'High',
    label: 'No Helmet',
  },
  no_gloves: {
    type: 'No Gloves',
    severity: 'Medium',
    label: 'No Gloves',
  },
  no_vest: {
    type: 'No Vest',
    severity: 'Medium',
    label: 'No Safety Vest',
  },
}

function SafetyMonitoring() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const intervalRef = useRef(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [detections, setDetections] = useState([])
  const [status, setStatus] = useState('Camera stopped')
  const [error, setError] = useState('')
  const [lastViolation, setLastViolation] = useState(null)

  const token = localStorage.getItem('token')

  const startCamera = async () => {
    try {
      setError('')

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setCameraActive(true)
      setStatus('Camera active')
    } catch (error) {
      console.error(error)

      setError(
        'Unable to access camera. Please allow camera permission.'
      )
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop())

      streamRef.current = null
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setCameraActive(false)
    setStatus('Camera stopped')
    setDetections([])
  }

  const createViolation = async (
    detectionClass
  ) => {
    const config =
      VIOLATION_CONFIG[detectionClass]

    if (!config) return

    try {
      const response = await fetch(
        'http://localhost:5000/api/violations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: config.type,
            zoneId: 1,
            severity: config.severity,
            source: 'AI CCTV',
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Failed to create violation'
        )
      }

      setLastViolation(data.violation)
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const detectFrame = async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      videoRef.current.readyState < 2
    ) {
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    )

    canvas.toBlob(
      async (blob) => {
        if (!blob) return

        try {
          const formData = new FormData()

          formData.append(
            'file',
            blob,
            'frame.jpg'
          )

          const response = await fetch(
            'http://127.0.0.1:8000/predict',
            {
              method: 'POST',
              body: formData,
            }
          )

          const data = await response.json()

          if (!response.ok) {
            throw new Error(
              data.message ||
              'AI detection failed'
            )
          }

          const currentDetections =
            data.detections || []

          setDetections(currentDetections)
          setStatus('AI monitoring active')

          const violationDetections =
            currentDetections.filter(
              (item) =>
                VIOLATION_CONFIG[item.class] &&
                item.confidence >= 0.5
            )

          for (const detection of violationDetections) {
            const now = Date.now()

            const storageKey =
              `lastViolation_${detection.class}`

            const lastTime =
              Number(
                sessionStorage.getItem(
                  storageKey
                )
              ) || 0

            if (now - lastTime > 30000) {
              sessionStorage.setItem(
                storageKey,
                now.toString()
              )

              await createViolation(
                detection.class
              )
            }
          }
        } catch (error) {
          console.error(error)

          setStatus('AI server unavailable')

          setError(
            'Unable to connect to AI detection server'
          )
        }
      },
      'image/jpeg',
      0.8
    )
  }

  useEffect(() => {
    if (cameraActive) {
      intervalRef.current = setInterval(
        detectFrame,
        2000
      )
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [cameraActive])

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop())
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const getDetectionLabel = (className) => {
    return (
      VIOLATION_CONFIG[className]?.label ||
      className
    )
  }

  const violationCount = detections.filter(
    (detection) =>
      Boolean(
        VIOLATION_CONFIG[detection.class]
      )
  ).length

  return (
    <div className="space-y-7">

      {/* Page introduction */}
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#d6a84f]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c857f]">
              AI safety operations
            </span>
          </div>

          <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#202823]">
            Live Safety Monitoring
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737b76]">
            Monitor the Entry Checkpoint through AI-assisted
            CCTV analysis and automatically record detected PPE
            violations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-[#dfe3de] bg-white px-4 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8b938e]">
              Camera
            </p>

            <p className="mt-1 text-xs font-semibold text-[#303a34]">
              CCTV 01 · Entry Checkpoint
            </p>
          </div>

          <div className="border border-[#dfe3de] bg-white px-4 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8b938e]">
              Detection
            </p>

            <p className="mt-1 text-xs font-semibold text-[#303a34]">
              {cameraActive
                ? 'Running'
                : 'Standby'}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 border border-[#e4caca] bg-[#fff7f7] px-5 py-4">
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 shrink-0 text-[#a33a3a]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>

          <p className="text-sm text-[#963d3d]">
            {error}
          </p>
        </div>
      )}

      {/* Main monitoring area */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_380px]">

        {/* CCTV */}
        <section className="border border-[#dfe3de] bg-white">

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e8e5] px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#202823]">
                  Live CCTV Feed
                </span>

                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#929a95]">
                  / Camera 01
                </span>
              </div>

              <p className="mt-1 text-xs text-[#7f8882]">
                Entry Checkpoint · PPE compliance zone
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`relative flex h-2 w-2 ${cameraActive
                    ? 'text-emerald-500'
                    : 'text-[#9aa19c]'
                  }`}
              >
                {cameraActive && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                )}

                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${cameraActive
                      ? 'bg-emerald-500'
                      : 'bg-[#9aa19c]'
                    }`}
                />
              </span>

              <span
                className={`text-[10px] font-bold uppercase tracking-[0.13em] ${cameraActive
                    ? 'text-emerald-700'
                    : 'text-[#7c857f]'
                  }`}
              >
                {cameraActive
                  ? 'Live'
                  : 'Offline'}
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="relative overflow-hidden bg-[#151b18]">

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="aspect-video w-full object-cover"
              />

              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#4b554f] bg-[#202823]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-[#d6a84f]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="m15 10 4.5-2.5v9L15 14" />
                        <rect
                          x="3"
                          y="6"
                          width="12"
                          height="12"
                          rx="1"
                        />
                      </svg>
                    </div>

                    <p className="mt-4 text-sm font-medium text-white">
                      CCTV feed offline
                    </p>

                    <p className="mt-1 text-xs text-[#89928c]">
                      Start the camera to begin AI analysis
                    </p>
                  </div>
                </div>
              )}

              {cameraActive && (
                <>
                  <div className="absolute left-4 top-4 flex items-center gap-2 bg-[#101512]/85 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                      CCTV 01 · LIVE
                    </span>
                  </div>

                  <div className="absolute right-4 top-4 bg-[#101512]/85 px-3 py-2">
                    <span className="text-[10px] font-medium text-[#d6a84f]">
                      AI ANALYSIS
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-[#101512]/85 px-3 py-2">
                    <span className="text-[10px] text-white">
                      {status}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-[#101512]/85 px-3 py-2">
                    <span className="text-[10px] text-[#c5cdc7]">
                      2s analysis interval
                    </span>
                  </div>
                </>
              )}
            </div>

            <canvas
              ref={canvasRef}
              className="hidden"
            />

            <div className="mt-5 flex flex-col gap-4 border-t border-[#e5e8e5] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8b938e]">
                  Monitoring status
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${cameraActive
                        ? 'bg-emerald-500'
                        : 'bg-[#9aa19c]'
                      }`}
                  />

                  <p className="text-sm font-medium text-[#303a34]">
                    {status}
                  </p>
                </div>
              </div>

              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="flex items-center justify-center gap-2 bg-[#202823] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#2c3730]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-[#d6a84f]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="m15 10 4.5-2.5v9L15 14" />
                    <rect
                      x="3"
                      y="6"
                      width="12"
                      height="12"
                      rx="1"
                    />
                  </svg>

                  Start CCTV
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="border border-[#d1d7d2] bg-white px-5 py-3 text-xs font-semibold text-[#59635d] transition hover:bg-[#f3f5f2]"
                >
                  Stop CCTV
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Detection panel */}
        <section className="border border-[#dfe3de] bg-white">

          <div className="border-b border-[#e5e8e5] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#202823]">
                  AI Detection
                </p>

                <p className="mt-1 text-xs text-[#7f8882]">
                  Current frame analysis
                </p>
              </div>

              <div className="flex items-center gap-2 border border-[#e2e5e2] px-2.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c857f]">
                  Local AI
                </span>
              </div>
            </div>
          </div>

          <div className="p-5">

            {/* Detection summary */}
            <div className="grid grid-cols-2 border border-[#e2e6e2]">
              <div className="border-r border-[#e2e6e2] p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8c948f]">
                  Objects
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#202823]">
                  {detections.length}
                </p>
              </div>

              <div className="p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8c948f]">
                  Violations
                </p>

                <p
                  className={`mt-2 text-2xl font-semibold ${violationCount > 0
                      ? 'text-[#a33a3a]'
                      : 'text-[#202823]'
                    }`}
                >
                  {violationCount}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8c948f]">
                Current detections
              </p>

              <div className="mt-3 space-y-2.5">
                {detections.length === 0 ? (
                  <div className="border border-dashed border-[#d5dbd6] px-5 py-8 text-center">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center border border-[#dce1dd]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-[#909892]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="12" r="8" />
                        <path d="M8.5 12h7" />
                      </svg>
                    </div>

                    <p className="mt-3 text-xs font-medium text-[#59635d]">
                      No detections
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-[#929a95]">
                      Start CCTV to begin AI analysis
                    </p>
                  </div>
                ) : (
                  detections.map(
                    (detection, index) => {
                      const isViolation =
                        Boolean(
                          VIOLATION_CONFIG[
                          detection.class
                          ]
                        )

                      return (
                        <div
                          key={`${detection.class}-${index}`}
                          className={`flex items-center justify-between border px-4 py-3 ${isViolation
                              ? 'border-[#e5caca] bg-[#fff8f8]'
                              : 'border-[#e0e4e1] bg-[#f8f9f7]'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`h-2 w-2 rounded-full ${isViolation
                                  ? 'bg-[#b54848]'
                                  : 'bg-emerald-500'
                                }`}
                            />

                            <div>
                              <p
                                className={`text-xs font-semibold ${isViolation
                                    ? 'text-[#983d3d]'
                                    : 'text-[#303a34]'
                                  }`}
                              >
                                {getDetectionLabel(
                                  detection.class
                                )}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#8b938e]">
                                {isViolation
                                  ? 'PPE violation'
                                  : 'Detected object'}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`text-xs font-bold ${isViolation
                                ? 'text-[#a33a3a]'
                                : 'text-[#59635d]'
                              }`}
                          >
                            {(
                              detection.confidence *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                      )
                    }
                  )
                )}
              </div>
            </div>

            {lastViolation && (
              <div className="mt-5 border-l-[3px] border-[#b54848] bg-[#fff7f7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a33a3a]">
                    Violation recorded
                  </p>

                  <span className="h-1.5 w-1.5 rounded-full bg-[#b54848]" />
                </div>

                <p className="mt-2 text-base font-semibold text-[#7f3030]">
                  {lastViolation.type}
                </p>

                <p className="mt-1 text-[10px] text-[#a15b5b]">
                  {lastViolation.violation_code}
                </p>

                <p className="mt-3 text-[10px] leading-4 text-[#a15b5b]">
                  Automatically recorded from AI CCTV.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* System information */}
      <section className="border border-[#dfe3de] bg-[#202823]">
        <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#aeb7b0]">
                Automated safety monitoring
              </p>
            </div>

            <p className="mt-2 max-w-3xl text-xs leading-5 text-[#89938c]">
              CCTV frames are analysed by the local AI service.
              Detected PPE violations above the confidence
              threshold are automatically recorded in the safety
              system.
            </p>
          </div>

          <div className="shrink-0 border border-[#465049] px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#7f8982]">
              Detection engine
            </p>

            <p className="mt-1 text-xs font-semibold text-[#d6a84f]">
              Local AI Service · Connected
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SafetyMonitoring