import { useEffect, useState } from 'react'

function Inspections() {
  const [zones, setZones] = useState([])
  const [inspections, setInspections] = useState([])

  const [zoneId, setZoneId] = useState('')

  const [helmetOk, setHelmetOk] = useState(true)
  const [glovesOk, setGlovesOk] = useState(true)
  const [gogglesOk, setGogglesOk] = useState(true)
  const [equipmentOk, setEquipmentOk] = useState(true)
  const [environmentOk, setEnvironmentOk] =
    useState(true)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] =
    useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')

  const fetchData = async () => {
    try {
      setLoading(true)

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [
        zonesResponse,
        inspectionsResponse,
      ] = await Promise.all([
        fetch(
          'http://localhost:5000/api/inspections/zones',
          { headers }
        ),
        fetch(
          'http://localhost:5000/api/inspections',
          { headers }
        ),
      ])

      const zonesData =
        await zonesResponse.json()

      const inspectionsData =
        await inspectionsResponse.json()

      if (
        !zonesResponse.ok ||
        !inspectionsResponse.ok
      ) {
        throw new Error(
          'Failed to load inspection data'
        )
      }

      setZones(zonesData)
      setInspections(inspectionsData)

      if (
        !zoneId &&
        zonesData.length > 0
      ) {
        setZoneId(
          zonesData[0].id.toString()
        )
      }
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const submitInspection = async (e) => {
    e.preventDefault()

    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      const response = await fetch(
        'http://localhost:5000/api/inspections',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            zoneId: Number(zoneId),
            helmetOk,
            glovesOk,
            gogglesOk,
            equipmentOk,
            environmentOk,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to submit inspection'
        )
      }

      setMessage(data.message)

      setHelmetOk(true)
      setGlovesOk(true)
      setGogglesOk(true)
      setEquipmentOk(true)
      setEnvironmentOk(true)

      await fetchData()
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-slate-500">
        Loading inspections...
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Inspections
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Conduct safety inspections and record compliance findings
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          New Safety Inspection
        </h2>

        <form
          onSubmit={submitInspection}
          className="mt-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Inspection Zone
            </label>

            <select
              value={zoneId}
              onChange={(e) =>
                setZoneId(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5"
              required
            >
              {zones.map((zone) => (
                <option
                  key={zone.id}
                  value={zone.id}
                >
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <span className="text-sm font-medium text-slate-700">
                Helmet Compliance
              </span>

              <input
                type="checkbox"
                checked={helmetOk}
                onChange={(e) =>
                  setHelmetOk(e.target.checked)
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <span className="text-sm font-medium text-slate-700">
                Gloves Compliance
              </span>

              <input
                type="checkbox"
                checked={glovesOk}
                onChange={(e) =>
                  setGlovesOk(e.target.checked)
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <span className="text-sm font-medium text-slate-700">
                Goggles Compliance
              </span>

              <input
                type="checkbox"
                checked={gogglesOk}
                onChange={(e) =>
                  setGogglesOk(e.target.checked)
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <span className="text-sm font-medium text-slate-700">
                Equipment Safety
              </span>

              <input
                type="checkbox"
                checked={equipmentOk}
                onChange={(e) =>
                  setEquipmentOk(e.target.checked)
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex items-center justify-between rounded-lg bg-slate-50 p-4 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">
                Environment Compliance
              </span>

              <input
                type="checkbox"
                checked={environmentOk}
                onChange={(e) =>
                  setEnvironmentOk(
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting
              ? 'Submitting...'
              : 'Submit Inspection'}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Inspection History
          </h2>
        </div>

        {inspections.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No inspections recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">
                    ID
                  </th>

                  <th className="px-6 py-4">
                    Zone
                  </th>

                  <th className="px-6 py-4">
                    Inspector
                  </th>

                  <th className="px-6 py-4">
                    Helmet
                  </th>

                  <th className="px-6 py-4">
                    Gloves
                  </th>

                  <th className="px-6 py-4">
                    Goggles
                  </th>

                  <th className="px-6 py-4">
                    Equipment
                  </th>

                  <th className="px-6 py-4">
                    Environment
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {inspections.map(
                  (inspection) => (
                    <tr
                      key={inspection.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        INS-{inspection.id}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {inspection.zone}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {inspection.inspector}
                      </td>

                      <td className="px-6 py-4">
                        {inspection.helmet_ok
                          ? '✓'
                          : '✗'}
                      </td>

                      <td className="px-6 py-4">
                        {inspection.gloves_ok
                          ? '✓'
                          : '✗'}
                      </td>

                      <td className="px-6 py-4">
                        {inspection.goggles_ok
                          ? '✓'
                          : '✗'}
                      </td>

                      <td className="px-6 py-4">
                        {inspection.equipment_ok
                          ? '✓'
                          : '✗'}
                      </td>

                      <td className="px-6 py-4">
                        {inspection.environment_ok
                          ? '✓'
                          : '✗'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            inspection.status ===
                            'Passed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {inspection.status}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inspections