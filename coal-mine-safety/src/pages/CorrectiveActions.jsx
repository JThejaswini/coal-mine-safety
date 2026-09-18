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
    role === 'Safety Officer' ||
    role === 'Mine Manager'

  const fetchData = async () => {
    try {
      setLoading(true)

      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const [
        actionsRes,
        violationsRes,
        reinspectionsRes,
      ] = await Promise.all([
        fetch(`${API}/corrective-actions`, {
          headers,
        }),
        fetch(`${API}/violations`, {
          headers,
        }),
        fetch(`${API}/reinspections`, {
          headers,
        }),
      ])

      const actionsData =
        await actionsRes.json()

      const violationsData =
        await violationsRes.json()

      const reinspectionsData =
        await reinspectionsRes.json()

      if (actionsRes.ok) {
        setActions(actionsData)
      }

      if (violationsRes.ok) {
        setViolations(violationsData)
      }

      if (reinspectionsRes.ok) {
        setReinspections(
          reinspectionsData
        )
      }
    } catch (error) {
      console.error(error)
      setMessage(
        'Failed to load corrective actions'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openAssignForm = async (
    violation
  ) => {
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
        setMessage(
          data.message ||
          'Failed to load supervisors'
        )

        setSupervisors([])
        return
      }

      setSupervisors(data)
    } catch (error) {
      console.error(error)

      setMessage(
        'Failed to load supervisors'
      )

      setSupervisors([])
    }
  }

  const closeAssignForm = () => {
    setShowAssignForm(false)
    setSelectedViolation(null)
    setSelectedSupervisor('')
  }

  const createAction = async () => {
    if (
      !selectedViolation ||
      !selectedSupervisor
    ) {
      setMessage(
        'Please select an Area Supervisor'
      )
      return
    }

    try {
      const response = await fetch(
        `${API}/corrective-actions`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            violationId:
              selectedViolation.id,
            assignedTo:
              Number(selectedSupervisor),
            actionDescription:
              `Correct ${selectedViolation.type} at ${selectedViolation.zone}`,
            deadline: '2026-09-15',
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message ||
          'Failed to create action'
        )
        return
      }

      setMessage(
        'Corrective action assigned successfully'
      )

      closeAssignForm()

      await fetchData()
    } catch (error) {
      console.error(error)

      setMessage(
        'Failed to create corrective action'
      )
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
        setMessage(
          data.message ||
          'Failed to complete action'
        )
        return
      }

      setMessage(
        'Corrective action marked as Completed'
      )

      await fetchData()
    } catch (error) {
      console.error(error)

      setMessage(
        'Failed to complete corrective action'
      )
    }
  }

  const pendingActions =
    actions.filter(
      (action) =>
        action.status === 'Pending'
    )

  const completedActions =
    actions.filter(
      (action) =>
        action.status === 'Completed'
    )

  const violationHasAction = (
    violationId
  ) =>
    actions.some(
      (action) =>
        action.violation_id ===
        violationId
    )

  const failedReinspectionViolationIds =
    new Set(
      reinspections
        .filter(
          (item) =>
            item.result === 'Failed'
        )
        .map(
          (item) =>
            item.violation_id
        )
    )

  const violationsRequiringAction =
    violations.filter(
      (violation) =>
        violation.status !==
        'Resolved' &&
        !violationHasAction(
          violation.id
        )
    )

  const failedViolationsRequiringAction =
    violations.filter(
      (violation) =>
        failedReinspectionViolationIds.has(
          violation.id
        ) &&
        violation.status !==
        'Resolved' &&
        !violationHasAction(
          violation.id
        )
    )

  const completionRate =
    actions.length > 0
      ? Math.round(
        (completedActions.length /
          actions.length) *
        100
      )
      : 0

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#dfe3de] border-t-[#9b6f21]" />

          <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#858e88]">
            Loading corrective actions
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="border-b border-[#d9ddd8] pb-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9b6f21]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />
              Corrective response management
            </div>

            <h2 className="text-[28px] font-semibold tracking-[-0.035em] text-[#202823] sm:text-[32px]">
              Corrective Actions
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f7872]">
              {isSupervisor
                ? 'Review actions assigned to your operational area and update their completion status.'
                : 'Assign responsible personnel to safety violations and track corrective response through closure.'}
            </p>
          </div>

          <div className="border border-[#dfe3de] bg-white px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#89918c]">
              Response status
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-[#303a34]">
                Workflow active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Message */}
      {message && (
        <div className="border-l-4 border-[#9b6f21] bg-[#fffaf0] px-5 py-4">
          <p className="text-xs font-medium text-[#8c661f]">
            {message}
          </p>
        </div>
      )}

      {/* Summary */}
      <section>
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b938d]">
            Action register
          </p>

          <p className="mt-1 text-xs text-[#737c76]">
            Current corrective-action workload
          </p>
        </div>

        <div className="grid grid-cols-1 border border-[#dfe3de] bg-white sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Total actions"
            value={actions.length}
            detail="Recorded corrective actions"
            valueClass="text-[#202823]"
          />

          <Metric
            label="Pending"
            value={pendingActions.length}
            detail="Awaiting completion"
            valueClass="text-[#a66d16]"
            bordered
          />

          <Metric
            label="Completed"
            value={completedActions.length}
            detail="Closed actions"
            valueClass="text-[#3f7354]"
            bordered
          />

          <Metric
            label="Completion"
            value={`${completionRate}%`}
            detail="Overall action closure"
            valueClass="text-[#416b91]"
            bordered
          />
        </div>
      </section>

      {/* Workflow */}
      <section className="border border-[#303a34] bg-[#202823] px-5 py-5 sm:px-6">
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d6a84f]">
            Corrective response workflow
          </p>

          <p className="mt-1 text-xs text-[#8f9992]">
            Safety event lifecycle from identification to verification
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <WorkflowStep
            number="01"
            title="Violation"
            description="Safety issue is recorded"
            active
          />

          <WorkflowStep
            number="02"
            title="Assignment"
            description="Responsible supervisor selected"
            active
          />

          <WorkflowStep
            number="03"
            title="Correction"
            description="Action completed in the field"
            active
          />

          <WorkflowStep
            number="04"
            title="Re-inspection"
            description="Correction is verified"
          />
        </div>
      </section>

      {/* Main action register */}
      <section className="border border-[#dfe3de] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[#dfe3de] px-5 py-5 sm:px-6 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-[#d6a84f]" />

              <h3 className="text-sm font-semibold text-[#27312b]">
                {isSupervisor
                  ? 'My Assigned Actions'
                  : 'All Corrective Actions'}
              </h3>
            </div>

            <p className="mt-1.5 text-xs text-[#7d8680]">
              {isSupervisor
                ? 'Actions requiring your operational response'
                : 'Assignment and completion status across the mine'}
            </p>
          </div>

          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#8a938d]">
            {actions.length} record
            {actions.length !== 1
              ? 's'
              : ''}
          </div>
        </div>

        {actions.length === 0 ? (
          <EmptyState
            title="No corrective actions found"
            description="Actions assigned to responsible personnel will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full text-left">
              <thead>
                <tr className="border-b border-[#dfe3de] bg-[#f7f8f5]">
                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Action
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Violation
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Zone
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Assigned to
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Deadline
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Status
                  </th>

                  <th className="px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#858d88]">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody>
                {actions.map(
                  (action, index) => (
                    <tr
                      key={action.id}
                      className={`border-b border-[#ecefeb] transition hover:bg-[#fafbf8] ${index % 2 === 1
                          ? 'bg-[#fcfcfa]'
                          : 'bg-white'
                        }`}
                    >
                      <td className="max-w-[240px] px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6a84f]" />

                          <span className="text-xs font-semibold leading-5 text-[#354039]">
                            {
                              action.action_description
                            }
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-[#4a554e]">
                          {action.violation}
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-[#969d98]">
                          {action.violation_code}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-[#68726c]">
                        {action.zone}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-[#4a554e]">
                          {action.assigned_to}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs text-[#68726c]">
                          {action.deadline ||
                            '—'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <ActionStatus
                          status={
                            action.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        {isSupervisor &&
                          action.status !==
                          'Completed' ? (
                          <button
                            type="button"
                            onClick={() =>
                              completeAction(
                                action.id
                              )
                            }
                            className="border border-[#4e795d] bg-[#f2f8f3] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3f7354] transition hover:bg-[#e7f2e9]"
                          >
                            Mark completed
                          </button>
                        ) : action.status ===
                          'Completed' ? (
                          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#3f7354]">
                            Closed
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9aa19c]">
                            Assigned
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Assignment queue */}
      {canCreate && (
        <>
          <section className="border border-[#dfe3de] bg-white">
            <div className="flex flex-col justify-between gap-3 border-b border-[#dfe3de] px-5 py-5 sm:px-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-orange-500" />

                  <h3 className="text-sm font-semibold text-[#27312b]">
                    Violations Requiring Action
                  </h3>
                </div>

                <p className="mt-1.5 text-xs text-[#7d8680]">
                  Open violations without an active corrective action
                </p>
              </div>

              <span className="border border-orange-200 bg-[#fff8ef] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#a66d16]">
                {violationsRequiringAction.length}{' '}
                pending assignment
              </span>
            </div>

            {violationsRequiringAction.length ===
              0 ? (
              <EmptyState
                title="No violations require assignment"
                description="All currently open violations have a corrective action assigned."
                success
              />
            ) : (
              <div>
                {violationsRequiringAction.map(
                  (
                    violation,
                    index
                  ) => (
                    <ViolationQueueRow
                      key={violation.id}
                      violation={
                        violation
                      }
                      index={index}
                      onAssign={() =>
                        openAssignForm(
                          violation
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>

          {/* Failed re-inspections */}
          {failedViolationsRequiringAction.length >
            0 && (
              <section className="border border-[#e3d8d5] bg-white">
                <div className="border-b border-[#e3d8d5] bg-[#fff8f6] px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-red-500" />

                    <h3 className="text-sm font-semibold text-[#5b302b]">
                      Re-inspection Failed
                    </h3>
                  </div>

                  <p className="mt-1.5 text-xs text-[#8e706b]">
                    These violations require another corrective response after verification failed.
                  </p>
                </div>

                <div>
                  {failedViolationsRequiringAction.map(
                    (
                      violation,
                      index
                    ) => (
                      <ViolationQueueRow
                        key={violation.id}
                        violation={
                          violation
                        }
                        index={index}
                        failed
                        onAssign={() =>
                          openAssignForm(
                            violation
                          )
                        }
                      />
                    )
                  )}
                </div>
              </section>
            )}
        </>
      )}

      {/* Assignment modal */}
      {showAssignForm &&
        selectedViolation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18201c]/65 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-lg border border-[#dfe3de] bg-[#f8f9f6] shadow-2xl">
              {/* Modal header */}
              <div className="border-b border-[#dfe3de] bg-white px-6 py-5">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />
                      Action assignment
                    </div>

                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#202823]">
                      Assign Corrective Action
                    </h3>

                    <p className="mt-1.5 text-xs text-[#747d77]">
                      Assign responsibility for the selected safety violation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      closeAssignForm
                    }
                    className="flex h-8 w-8 items-center justify-center border border-[#dfe3de] bg-white text-lg text-[#747d77] transition hover:bg-[#f1f3ef] hover:text-[#202823]"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Violation context */}
              <div className="border-b border-[#dfe3de] bg-[#f2f4f0] px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 bg-red-500" />

                  <div>
                    <p className="text-sm font-semibold text-[#354039]">
                      {
                        selectedViolation.type
                      }
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.08em] text-[#818a84]">
                      <span>
                        {
                          selectedViolation.violation_code
                        }
                      </span>

                      <span className="text-[#c1c6c2]">
                        •
                      </span>

                      <span>
                        {
                          selectedViolation.zone
                        }
                      </span>

                      <span className="text-[#c1c6c2]">
                        •
                      </span>

                      <span
                        className={
                          selectedViolation.severity ===
                            'High'
                            ? 'font-semibold text-red-600'
                            : 'font-semibold text-[#9b6f21]'
                        }
                      >
                        {
                          selectedViolation.severity
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="px-6 py-6">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.13em] text-[#737c76]">
                  Responsible Area Supervisor
                </label>

                <select
                  value={
                    selectedSupervisor
                  }
                  onChange={(
                    event
                  ) =>
                    setSelectedSupervisor(
                      event.target.value
                    )
                  }
                  className="w-full border border-[#cfd5d0] bg-white px-3 py-3 text-sm text-[#354039] outline-none transition focus:border-[#9b6f21] focus:ring-1 focus:ring-[#d6a84f]"
                >
                  <option value="">
                    Select Area Supervisor
                  </option>

                  {supervisors.map(
                    (
                      supervisor
                    ) => (
                      <option
                        key={
                          supervisor.id
                        }
                        value={
                          supervisor.id
                        }
                      >
                        {
                          supervisor.name
                        }{' '}
                        —{' '}
                        {
                          supervisor.zone
                        }
                      </option>
                    )
                  )}
                </select>

                {supervisors.length ===
                  0 && (
                    <div className="mt-3 border-l-2 border-red-400 bg-[#fff7f5] px-3 py-2">
                      <p className="text-xs text-red-600">
                        No active Area Supervisor is assigned to this zone.
                      </p>
                    </div>
                  )}

                <div className="mt-5 border border-[#dfe3de] bg-white px-4 py-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#d6a84f]" />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#68726c]">
                        Generated action
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#858d88]">
                        Correct{' '}
                        {
                          selectedViolation.type
                        }{' '}
                        at{' '}
                        {
                          selectedViolation.zone
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal actions */}
              <div className="flex justify-end gap-3 border-t border-[#dfe3de] bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={
                    closeAssignForm
                  }
                  className="border border-[#d5dad6] bg-white px-4 py-2.5 text-xs font-medium text-[#59635d] transition hover:bg-[#f4f5f2]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    createAction
                  }
                  disabled={
                    !selectedSupervisor
                  }
                  className="border border-[#3e4d44] bg-[#26312b] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1e2822] disabled:cursor-not-allowed disabled:border-[#d6dad7] disabled:bg-[#d6dad7] disabled:text-[#8c938e]"
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

function Metric({
  label,
  value,
  detail,
  valueClass,
  bordered = false,
}) {
  return (
    <div
      className={`px-5 py-5 sm:px-6 ${bordered
          ? 'border-t border-[#e2e5e1] sm:border-l sm:border-t-0'
          : ''
        }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#89918c]">
        {label}
      </p>

      <p
        className={`mt-3 text-[30px] font-semibold tracking-[-0.04em] ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-1 text-[10px] text-[#919994]">
        {detail}
      </p>
    </div>
  )
}

function WorkflowStep({
  number,
  title,
  description,
  active = false,
}) {
  return (
    <div className="border border-[#3b4740] bg-[#26312b] px-4 py-4">
      <div className="flex items-center gap-3">
        <span
          className={`font-mono text-[10px] font-semibold ${active
              ? 'text-[#d6a84f]'
              : 'text-[#69756d]'
            }`}
        >
          {number}
        </span>

        <span className="h-px flex-1 bg-[#3d4942]" />
      </div>

      <p className="mt-4 text-xs font-semibold text-[#dfe4df]">
        {title}
      </p>

      <p className="mt-1.5 text-[10px] leading-4 text-[#7f8b83]">
        {description}
      </p>
    </div>
  )
}

function ActionStatus({ status }) {
  const completed =
    status === 'Completed'

  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${completed
          ? 'border-emerald-200 bg-[#f3faf5] text-[#3f7354]'
          : 'border-orange-200 bg-[#fff8ef] text-[#a66d16]'
        }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${completed
            ? 'bg-emerald-500'
            : 'bg-orange-500'
          }`}
      />

      {status}
    </span>
  )
}

function ViolationQueueRow({
  violation,
  index,
  failed = false,
  onAssign,
}) {
  return (
    <div
      className={`flex flex-col gap-4 px-5 py-5 transition hover:bg-[#fafbf8] sm:px-6 lg:flex-row lg:items-center lg:justify-between ${index > 0
          ? 'border-t border-[#ecefeb]'
          : ''
        }`}
    >
      <div className="flex min-w-0 items-start gap-4">
        <div
          className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center border ${failed
              ? 'border-red-200 bg-[#fff5f3]'
              : 'border-orange-200 bg-[#fff8ef]'
            }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${failed
                ? 'bg-red-500'
                : 'bg-orange-500'
              }`}
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#354039]">
              {violation.type}
            </p>

            <span className="font-mono text-[9px] text-[#9aa19c]">
              {violation.violation_code}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.08em] text-[#858d88]">
            <span>{violation.zone}</span>

            <span className="text-[#c3c8c4]">
              •
            </span>

            <span
              className={
                violation.severity ===
                  'High'
                  ? 'font-semibold text-red-600'
                  : 'font-semibold text-[#9b6f21]'
              }
            >
              {violation.severity}
            </span>

            {failed && (
              <>
                <span className="text-[#c3c8c4]">
                  •
                </span>

                <span className="font-semibold text-red-600">
                  Verification failed
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onAssign}
        className={`shrink-0 border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition ${failed
            ? 'border-red-300 bg-[#fff7f5] text-[#a53b31] hover:bg-[#fff0ed]'
            : 'border-[#d8c28f] bg-[#fffaf0] text-[#8e681f] hover:bg-[#fff5dd]'
          }`}
      >
        {failed
          ? 'Assign new action'
          : 'Assign corrective action'}
      </button>
    </div>
  )
}

function EmptyState({
  title,
  description,
  success = false,
}) {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center border border-[#dfe3de] bg-[#f6f7f4]">
        <span
          className={`h-2.5 w-2.5 rounded-full ${success
              ? 'bg-emerald-500'
              : 'bg-[#aab1ac]'
            }`}
        />
      </div>

      <p className="mt-5 text-sm font-semibold text-[#354039]">
        {title}
      </p>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#858d88]">
        {description}
      </p>
    </div>
  )
}

export default CorrectiveActions