import { useEffect, useState } from 'react'

const API = 'http://localhost:5000/api'

function CorrectiveActions() {
  const [actions, setActions] = useState([])
  const [violations, setViolations] = useState([])
  const [reinspections, setReinspections] = useState([])

  const [supervisors, setSupervisors] = useState([])
  const [selectedViolation, setSelectedViolation] = useState(null)
  const [selectedSupervisor, setSelectedSupervisor] = useState('')
  const [showAssignForm, setShowAssignForm] = useState(false)

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')

  const isSupervisor = role === 'Area Supervisor'
  const canCreate =
    role === 'Safety Officer' || role === 'Mine Manager'

  const fetchData = async () => {
    try {
      setLoading(true)

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [actionsRes, violationsRes, reinspectionsRes] =
        await Promise.all([
          fetch(`${API}/corrective-actions`, { headers }),
          fetch(`${API}/violations`, { headers }),
          fetch(`${API}/reinspections`, { headers }),
        ])

      const actionsData = await actionsRes.json()
      const violationsData = await violationsRes.json()
      const reinspectionsData = await reinspectionsRes.json()

      if (actionsRes.ok) {
        setActions(actionsData)
      }

      if (violationsRes.ok) {
        setViolations(violationsData)
      }

      if (reinspectionsRes.ok) {
        setReinspections(reinspectionsData)
      }
    } catch (error) {
      console.error(error)
      setMessage('Failed to load corrective actions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openAssignForm = async (violation) => {
    try {
      setMessage('')
      setSelectedViolation(violation)
      setSelectedSupervisor('')
      setShowAssignForm(true)

      const response = await fetch(
        `${API}/corrective-actions/supervisors?violationId=${violation.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Failed to load supervisors')
        setSupervisors([])
        return
      }

      setSupervisors(data)
    } catch (error) {
      console.error(error)
      setMessage('Failed to load supervisors')
      setSupervisors([])
    }
  }

  const createAction = async () => {
    if (!selectedViolation || !selectedSupervisor) {
      setMessage('Please select an Area Supervisor')
      return
    }

    try {
      const response = await fetch(
        `${API}/corrective-actions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            violationId: selectedViolation.id,
            assignedTo: Number(selectedSupervisor),
            actionDescription:
              `Correct ${selectedViolation.type} at ${selectedViolation.zone}`,
            deadline: '2026-09-15',
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Failed to create action')
        return
      }

      setMessage('Corrective action assigned successfully')
      setShowAssignForm(false)
      setSelectedViolation(null)
      setSelectedSupervisor('')

      await fetchData()
    } catch (error) {
      console.error(error)
      setMessage('Failed to create corrective action')
    }
  }

  const completeAction = async (id) => {
    try {
      const response = await fetch(
        `${API}/corrective-actions/${id}/complete`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Failed to complete action')
        return
      }

      setMessage('Corrective action marked as Completed')
      await fetchData()
    } catch (error) {
      console.error(error)
      setMessage('Failed to complete corrective action')
    }
  }

  const pendingActions = actions.filter(
    (action) => action.status === 'Pending'
  )

  const completedActions = actions.filter(
    (action) => action.status === 'Completed'
  )

  const violationHasAction = (violationId) =>
    actions.some(
      (action) => action.violation_id === violationId
    )

  const failedReinspectionViolationIds = new Set(
    reinspections
      .filter((item) => item.result === 'Failed')
      .map((item) => item.violation_id)
  )

  const violationsRequiringAction = violations.filter(
    (violation) =>
      violation.status !== 'Resolved' &&
      !violationHasAction(violation.id)
  )

  const failedViolationsRequiringAction = violations.filter(
    (violation) =>
      failedReinspectionViolationIds.has(violation.id) &&
      violation.status !== 'Resolved' &&
      !violationHasAction(violation.id)
  )

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading corrective actions...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Corrective Actions
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          {isSupervisor
            ? 'Corrective actions assigned to you'
            : 'Manage corrective actions and responsible personnel'}
        </p>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Total Actions
          </p>
          <p className="text-3xl font-bold mt-2">
            {actions.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Pending
          </p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {pendingActions.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Completed
          </p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {completedActions.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-800">
            {isSupervisor
              ? 'My Assigned Corrective Actions'
              : 'All Corrective Actions'}
          </h2>
        </div>

        {actions.length === 0 ? (
          <div className="p-6 text-gray-500">
            No corrective actions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3">
                    Action
                  </th>
                  <th className="text-left px-6 py-3">
                    Violation
                  </th>
                  <th className="text-left px-6 py-3">
                    Zone
                  </th>
                  <th className="text-left px-6 py-3">
                    Assigned To
                  </th>
                  <th className="text-left px-6 py-3">
                    Deadline
                  </th>
                  <th className="text-left px-6 py-3">
                    Status
                  </th>
                  <th className="text-left px-6 py-3">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {actions.map((action) => (
                  <tr key={action.id}>
                    <td className="px-6 py-4">
                      {action.action_description}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        {action.violation}
                      </div>
                      <div className="text-xs text-gray-400">
                        {action.violation_code}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {action.zone}
                    </td>

                    <td className="px-6 py-4">
                      {action.assigned_to}
                    </td>

                    <td className="px-6 py-4">
                      {action.deadline || '—'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          action.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {action.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {isSupervisor &&
                      action.status !== 'Completed' ? (
                        <button
                          onClick={() =>
                            completeAction(action.id)
                          }
                          className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700"
                        >
                          Mark Completed
                        </button>
                      ) : action.status === 'Completed' ? (
                        <span className="text-green-600 text-xs">
                          Completed
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Assigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {canCreate && (
        <>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">
                Violations Requiring Action
              </h2>
            </div>

            {violationsRequiringAction.length === 0 ? (
              <div className="p-6 text-gray-500">
                No violations currently require a corrective action.
              </div>
            ) : (
              <div className="divide-y">
                {violationsRequiringAction.map((violation) => (
                  <div
                    key={violation.id}
                    className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {violation.type}
                      </p>

                      <p className="text-sm text-gray-500">
                        {violation.violation_code} ·{' '}
                        {violation.zone} ·{' '}
                        {violation.severity}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        openAssignForm(violation)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Assign Corrective Action
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {failedViolationsRequiringAction.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="font-semibold text-gray-800">
                  Re-inspection Failed
                </h2>
              </div>

              <div className="divide-y">
                {failedViolationsRequiringAction.map(
                  (violation) => (
                    <div
                      key={violation.id}
                      className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {violation.type}
                        </p>

                        <p className="text-sm text-gray-500">
                          {violation.violation_code} ·{' '}
                          {violation.zone}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          openAssignForm(violation)
                        }
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700"
                      >
                        Assign New Action
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}

      {showAssignForm && selectedViolation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Assign Corrective Action
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedViolation.type} —{' '}
                  {selectedViolation.zone}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAssignForm(false)
                  setSelectedViolation(null)
                  setSelectedSupervisor('')
                }}
                className="text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsible Area Supervisor
              </label>

              <select
                value={selectedSupervisor}
                onChange={(event) =>
                  setSelectedSupervisor(event.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">
                  Select Area Supervisor
                </option>

                {supervisors.map((supervisor) => (
                  <option
                    key={supervisor.id}
                    value={supervisor.id}
                  >
                    {supervisor.name} — {supervisor.zone}
                  </option>
                ))}
              </select>

              {supervisors.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  No active Area Supervisor is assigned to this zone.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAssignForm(false)
                  setSelectedViolation(null)
                  setSelectedSupervisor('')
                }}
                className="px-4 py-2 rounded-lg border text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={createAction}
                disabled={!selectedSupervisor}
                className="bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium"
              >
                Create & Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CorrectiveActions