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
      <div className="flex min-h-[280px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#dfe3de] border-t-[#9b6f21]" />

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#858e88]">
            Loading inspection records
          </p>
        </div>
      </div>
    )
  }

  const inspectionChecks = [
    {
      label: 'Helmet compliance',
      value: helmetOk,
      setValue: setHelmetOk,
      code: 'PPE-01',
    },
    {
      label: 'Gloves compliance',
      value: glovesOk,
      setValue: setGlovesOk,
      code: 'PPE-02',
    },
    {
      label: 'Goggles compliance',
      value: gogglesOk,
      setValue: setGogglesOk,
      code: 'PPE-03',
    },
    {
      label: 'Equipment safety',
      value: equipmentOk,
      setValue: setEquipmentOk,
      code: 'OPS-01',
    },
    {
      label: 'Environment compliance',
      value: environmentOk,
      setValue: setEnvironmentOk,
      code: 'ENV-01',
    },
  ]

  return (
    <div className="space-y-7">

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#d6a84f]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c857f]">
              Safety operations
            </span>
          </div>

          <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#202823]">
            Inspections
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737b76]">
            Conduct structured safety inspections and record
            compliance findings across mine operating zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="border border-[#dfe3de] bg-white px-4 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8b938e]">
              Zones
            </p>

            <p className="mt-1 text-sm font-semibold text-[#303a34]">
              {zones.length}
            </p>
          </div>

          <div className="border border-[#dfe3de] bg-white px-4 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8b938e]">
              Recorded
            </p>

            <p className="mt-1 text-sm font-semibold text-[#303a34]">
              {inspections.length}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
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

      {message && (
        <div className="flex items-start gap-3 border border-[#cfe0d5] bg-[#f4faf6] px-5 py-4">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

          <p className="text-sm text-[#39704c]">
            {message}
          </p>
        </div>
      )}

      {/* Inspection form */}
      <section className="border border-[#dfe3de] bg-white">

        <div className="flex flex-col justify-between gap-3 border-b border-[#e5e8e5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#202823]">
                New Safety Inspection
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#949c97]">
                / Field checklist
              </span>
            </div>

            <p className="mt-1 text-xs text-[#7f8882]">
              Record the current safety condition of a mine zone.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#7d857f]">
              Manual inspection
            </span>
          </div>
        </div>

        <form
          onSubmit={submitInspection}
          className="p-5 sm:p-6"
        >
          {/* Zone */}
          <div className="max-w-xl">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#59635d]">
              Inspection zone
            </label>

            <select
              value={zoneId}
              onChange={(e) =>
                setZoneId(e.target.value)
              }
              className="mt-2.5 w-full appearance-none border border-[#d3d8d4] bg-[#fafbf9] px-4 py-3 text-sm font-medium text-[#303a34] outline-none transition focus:border-[#9b6f21] focus:ring-1 focus:ring-[#d6a84f]/40"
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

          {/* Checklist */}
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b938e]">
                Safety checklist
              </p>

              <p className="text-[10px] text-[#9aa19c]">
                Green = compliant
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {inspectionChecks.map(
                (check) => (
                  <label
                    key={check.code}
                    className={`group flex cursor-pointer items-center justify-between border px-4 py-4 transition ${check.value
                      ? 'border-[#dfe5e0] bg-[#f8faf8]'
                      : 'border-[#e5caca] bg-[#fff8f8]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center ${check.value
                          ? 'bg-[#e8f2eb] text-emerald-700'
                          : 'bg-[#f8e8e8] text-[#a33a3a]'
                          }`}
                      >
                        {check.value ? (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="m5 12 4 4L19 6" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="m7 7 10 10M17 7 7 17" />
                          </svg>
                        )}
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-[#303a34]">
                          {check.label}
                        </p>

                        <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-[#949c97]">
                          {check.code}
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={check.value}
                      onChange={(e) =>
                        check.setValue(
                          e.target.checked
                        )
                      }
                      className="peer sr-only"
                    />

                    <span
                      className={`relative h-5 w-9 rounded-full transition ${check.value
                        ? 'bg-[#334039]'
                        : 'bg-[#c7ceca]'
                        }`}
                    >
                      <span
                        className={`absolute top-1 h-3 w-3 rounded-full bg-white transition ${check.value
                          ? 'left-5'
                          : 'left-1'
                          }`}
                      />
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-7 flex flex-col justify-between gap-4 border-t border-[#e5e8e5] pt-5 sm:flex-row sm:items-center">
            <p className="max-w-xl text-[10px] leading-5 text-[#8b938e]">
              Findings are recorded against the selected zone
              and become part of the inspection history.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-3 bg-[#202823] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#2c3730] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Submitting inspection...'
                : 'Submit inspection'}

              {!submitting && (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-[#d6a84f]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 12h13" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* History */}
      <section className="border border-[#dfe3de] bg-white">

        <div className="flex flex-col justify-between gap-3 border-b border-[#e5e8e5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="text-sm font-semibold text-[#202823]">
              Inspection History
            </p>

            <p className="mt-1 text-xs text-[#7f8882]">
              Recorded safety checks and their compliance status.
            </p>
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#929a95]">
            {inspections.length} records
          </span>
        </div>

        {inspections.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center border border-dashed border-[#cfd6d1]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-[#929a95]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M7 3h10v18H7z" />
                <path d="M9 7h6M9 11h6M9 15h4" />
              </svg>
            </div>

            <p className="mt-4 text-sm font-medium text-[#59635d]">
              No inspections recorded yet
            </p>

            <p className="mt-1 text-xs text-[#929a95]">
              Submitted inspections will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead>
                <tr className="border-b border-[#e5e8e5] bg-[#f7f8f6]">
                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    ID
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    Zone
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    Inspector
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    Helmet
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    Gloves
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    Goggles
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    Equipment
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    Environment
                  </th>

                  <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.13em] text-[#858e88]">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {inspections.map(
                  (inspection) => (
                    <tr
                      key={inspection.id}
                      className="border-b border-[#eef0ee] transition hover:bg-[#fafbf9]"
                    >
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-[#303a34]">
                          INS-{inspection.id}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-[#59635d]">
                        {inspection.zone}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#737b76]">
                        {inspection.inspector}
                      </td>

                      <td className="px-5 py-4">
                        <CheckMark
                          value={inspection.helmet_ok}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <CheckMark
                          value={inspection.gloves_ok}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <CheckMark
                          value={inspection.goggles_ok}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <CheckMark
                          value={inspection.equipment_ok}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <CheckMark
                          value={inspection.environment_ok}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] ${inspection.status ===
                            'Passed'
                            ? 'border-[#cfe0d5] bg-[#f3faf5] text-[#39704c]'
                            : 'border-[#e5caca] bg-[#fff7f7] text-[#9b3d3d]'
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${inspection.status ===
                              'Passed'
                              ? 'bg-emerald-500'
                              : 'bg-[#b54848]'
                              }`}
                          />

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
      </section>
    </div>
  )
}

function CheckMark({ value }) {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center ${value
        ? 'bg-[#e8f2eb] text-emerald-700'
        : 'bg-[#f8e8e8] text-[#a33a3a]'
        }`}
    >
      {value ? (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <path d="m7 7 10 10M17 7 7 17" />
        </svg>
      )}
    </span>
  )
}

export default Inspections