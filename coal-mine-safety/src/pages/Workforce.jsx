import { useState } from 'react'

const initialWorkers = [
  {
    id: 'W-001',
    name: 'Arun Kumar',
    role: 'Mining Operator',
    training: 'Completed',
    expiry: '20 Dec 2026',
  },
  {
    id: 'W-002',
    name: 'Suresh B',
    role: 'Safety Supervisor',
    training: 'Completed',
    expiry: '15 Jan 2027',
  },
  {
    id: 'W-003',
    name: 'Ravi Kumar',
    role: 'Equipment Operator',
    training: 'Pending',
    expiry: '—',
  },
  {
    id: 'W-004',
    name: 'Manoj P',
    role: 'Mining Operator',
    training: 'Expired',
    expiry: '10 Aug 2026',
  },
  {
    id: 'W-005',
    name: 'Vijay S',
    role: 'Maintenance Worker',
    training: 'Completed',
    expiry: '05 Mar 2027',
  },
]

function Metric({
  label,
  value,
  detail,
  emphasis = 'normal',
}) {
  const valueClass =
    emphasis === 'success'
      ? 'text-[#27734a]'
      : emphasis === 'attention'
        ? 'text-[#9b6f21]'
        : emphasis === 'danger'
          ? 'text-[#b04438]'
          : 'text-[#202823]'

  return (
    <div className="border-l border-[#d8ddd8] pl-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#858e88]">
        {label}
      </p>

      <p
        className={`mt-1 text-2xl font-semibold tracking-[-0.03em] ${valueClass}`}
      >
        {value}
      </p>

      <p className="mt-1 text-xs text-[#7a837d]">
        {detail}
      </p>
    </div>
  )
}

function TrainingBadge({ status }) {
  const config = {
    Completed: {
      dot: 'bg-[#3b9a67]',
      text: 'text-[#27734a]',
    },
    Pending: {
      dot: 'bg-[#d6a84f]',
      text: 'text-[#9b6f21]',
    },
    Expired: {
      dot: 'bg-[#c95b4e]',
      text: 'text-[#b04438]',
    },
  }

  const style =
    config[status] || config.Pending

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${style.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
      />

      {status}
    </span>
  )
}

function WorkerInitials({ name }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#334039] text-[10px] font-semibold text-[#d6a84f]">
      {initials}
    </div>
  )
}

function Workforce() {
  const [workers, setWorkers] =
    useState(initialWorkers)

  const completed = workers.filter(
    (worker) =>
      worker.training === 'Completed'
  ).length

  const pending = workers.filter(
    (worker) =>
      worker.training === 'Pending'
  ).length

  const expired = workers.filter(
    (worker) =>
      worker.training === 'Expired'
  ).length

  const totalWorkers = workers.length

  const trainingCoverage =
    totalWorkers === 0
      ? 100
      : Math.round(
        (completed / totalWorkers) * 100
      )

  const updateTraining = (id) => {
    setWorkers(
      workers.map((worker) =>
        worker.id === id
          ? {
            ...worker,
            training: 'Completed',
            expiry: '15 Sep 2027',
          }
          : worker
      )
    )
  }

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <section className="border-b border-[#dfe3de] pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9b6f21]">
              Governance / Workforce
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#202823] sm:text-[28px]">
              Workforce
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f7972]">
              Monitor workforce safety training,
              certification status, and training validity.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-[#d9ded9] bg-white px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#3b9a67]" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#59635d]">
              Workforce register active
            </span>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 gap-6 border-y border-[#dfe3de] bg-[#f8f9f6] px-1 py-5 sm:grid-cols-4">
        <Metric
          label="Workforce"
          value={totalWorkers}
          detail="Registered workers"
        />

        <Metric
          label="Training completed"
          value={completed}
          detail={`${trainingCoverage}% coverage`}
          emphasis="success"
        />

        <Metric
          label="Pending training"
          value={pending}
          detail="Requires completion"
          emphasis="attention"
        />

        <Metric
          label="Expired training"
          value={expired}
          detail="Requires renewal"
          emphasis="danger"
        />
      </section>

      {/* Training position */}
      <section className="border-y border-[#dfe3de] bg-white">
        <div className="grid lg:grid-cols-[1fr_300px]">
          <div className="border-b border-[#e3e6e3] px-5 py-6 lg:border-b-0 lg:border-r lg:px-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
                Training position
              </p>

              <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
                Workforce certification coverage
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-[#7a837d]">
                Current training completion across the
                registered workforce.
              </p>
            </div>

            <div className="mt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-4xl font-semibold tracking-[-0.05em] text-[#202823]">
                    {trainingCoverage}%
                  </span>

                  <span className="ml-2 text-xs text-[#7a837d]">
                    certified
                  </span>
                </div>

                <span className="text-xs text-[#7a837d]">
                  {completed} of {totalWorkers}{' '}
                  workers
                </span>
              </div>

              <div className="mt-4 h-3 w-full bg-[#e5e8e5]">
                <div
                  className="h-full bg-[#3b9a67] transition-all"
                  style={{
                    width: `${trainingCoverage}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.1em] text-[#8a938d]">
                <span>0</span>
                <span>50</span>
                <span>80</span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f7f8f5] px-5 py-6 lg:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#858e88]">
              Training exposure
            </p>

            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between border-b border-[#dfe3de] pb-4">
                <span className="text-xs text-[#69736c]">
                  Completed
                </span>

                <span className="text-lg font-semibold text-[#27734a]">
                  {completed}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#dfe3de] pb-4">
                <span className="text-xs text-[#69736c]">
                  Pending
                </span>

                <span className="text-lg font-semibold text-[#9b6f21]">
                  {pending}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#69736c]">
                  Expired
                </span>

                <span className="text-lg font-semibold text-[#b04438]">
                  {expired}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workforce register */}
      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
              Workforce register
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
              Safety Training
            </h2>
          </div>

          <p className="text-xs text-[#7a837d]">
            {totalWorkers} registered workers
          </p>
        </div>

        <div className="overflow-hidden border-y border-[#dfe3de] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="border-b border-[#dfe3de] bg-[#f6f7f4]">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Worker
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Role
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Training
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Valid Until
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {workers.map((worker) => (
                  <tr
                    key={worker.id}
                    className="border-b border-[#edf0ed] last:border-b-0 hover:bg-[#fafbf9]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <WorkerInitials
                          name={worker.name}
                        />

                        <div>
                          <p className="text-xs font-semibold text-[#303a34]">
                            {worker.name}
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#8a938d]">
                            {worker.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-[#59635d]">
                        {worker.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <TrainingBadge
                        status={worker.training}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`text-xs ${worker.training === 'Expired'
                            ? 'font-semibold text-[#b04438]'
                            : worker.training === 'Pending'
                              ? 'text-[#8a938d]'
                              : 'text-[#59635d]'
                          }`}
                      >
                        {worker.expiry}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {worker.training !==
                        'Completed' && (
                          <button
                            type="button"
                            onClick={() =>
                              updateTraining(
                                worker.id
                              )
                            }
                            className="border border-[#334039] bg-[#334039] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#202823]"
                          >
                            Mark Trained
                          </button>
                        )}

                      {worker.training ===
                        'Completed' && (
                          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9aa19c]">
                            Up to date
                          </span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Governance note */}
      <section className="border-t border-[#dfe3de] pt-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Training control
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Track completion status for workers operating
              within mine activities.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Certification validity
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Valid-until dates provide visibility into
              upcoming and expired training requirements.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Governance
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Workforce readiness contributes to the
              mine-wide safety compliance position.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Workforce