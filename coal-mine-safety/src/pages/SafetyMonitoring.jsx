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

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-slate-500">
          AI Safety System
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Safety Monitoring
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          AI-powered CCTV monitoring for PPE compliance
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Live CCTV Feed
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Entry Checkpoint
              </p>
            </div>

            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                cameraActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  cameraActive
                    ? 'bg-green-500'
                    : 'bg-slate-400'
                }`}
              />

              {cameraActive
                ? 'LIVE'
                : 'OFFLINE'}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-slate-950">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="aspect-video w-full object-cover"
            />

            {cameraActive && (
              <div className="absolute left-4 top-4 rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                ● CCTV 01
              </div>
            )}

            {cameraActive && (
              <div className="absolute bottom-4 left-4 rounded-md bg-black/60 px-3 py-1.5 text-xs text-white">
                {status}
              </div>
            )}
          </div>

          <canvas
            ref={canvasRef}
            className="hidden"
          />

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Monitoring Status
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {status}
              </p>
            </div>

            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Start CCTV
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Stop CCTV
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                AI Detection
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Live PPE analysis
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              AI
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Current Detections
            </p>

            <div className="mt-3 space-y-3">
              {detections.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center">
                  <p className="text-sm text-slate-500">
                    No detections
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
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
                        className={`flex items-center justify-between rounded-lg p-4 ${
                          isViolation
                            ? 'border border-red-200 bg-red-50'
                            : 'border border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isViolation
                                ? 'text-red-700'
                                : 'text-slate-700'
                            }`}
                          >
                            {getDetectionLabel(
                              detection.class
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Confidence
                          </p>
                        </div>

                        <span
                          className={`text-sm font-bold ${
                            isViolation
                              ? 'text-red-700'
                              : 'text-slate-700'
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
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                  Violation Detected
                </p>
              </div>

              <p className="mt-3 text-lg font-bold text-red-800">
                {lastViolation.type}
              </p>

              <p className="mt-1 text-sm text-red-700">
                {lastViolation.violation_code}
              </p>

              <p className="mt-3 text-xs text-red-600">
                Automatically recorded from AI CCTV
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Automated Safety Monitoring
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              CCTV frames are analysed by the local AI service and detected safety violations are automatically recorded.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />

            <span className="text-xs font-medium text-green-700">
              Local AI Service
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SafetyMonitoring