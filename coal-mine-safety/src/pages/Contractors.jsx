import { useState } from 'react'

const initialContractors = [
  {
    id: 'CTR-001',
    company: 'ABC Mining Services',
    workers: 42,
    safetyStatus: 'Compliant',
    contract: 'Active',
  },
  {
    id: 'CTR-002',
    company: 'Eastern Equipment Works',
    workers: 18,
    safetyStatus: 'Compliant',
    contract: 'Active',
  },
  {
    id: 'CTR-003',
    company: 'SafeHaul Logistics',
    workers: 25,
    safetyStatus: 'Pending Review',
    contract: 'Active',
  },
  {
    id: 'CTR-004',
    company: 'Prime Industrial Services',
    workers: 31,
    safetyStatus: 'Non-Compliant',
    contract: 'Active',
  },
  {
    id: 'CTR-005',
    company: 'Southern Mining Support',
    workers: 14,
    safetyStatus: 'Compliant',
    contract: 'Expired',
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

function SafetyBadge({ status }) {
  const config = {
    Compliant: {
      dot: 'bg-[#3b9a67]',
      text: 'text-[#27734a]',
    },
    'Pending Review': {
      dot: 'bg-[#d6a84f]',
      text: 'text-[#9b6f21]',
    },
    'Non-Compliant': {
      dot: 'bg-[#c95b4e]',
      text: 'text-[#b04438]',
    },
  }

  const style =
    config[status] || config['Pending Review']

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

function ContractBadge({ status }) {
  const active = status === 'Active'

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
        active
          ? 'text-[#59635d]'
          : 'text-[#9a6a5f]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active
            ? 'bg-[#6d7770]'
            : 'bg-[#c95b4e]'
        }`}
      />

      {status}
    </span>
  )
}

function CompanyMark({ company }) {
  const initials = company
    .split(' ')
    .filter((word) => word.length > 2)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#334039] text-[10px] font-semibold text-[#d6a84f]">
      {initials}
    </div>
  )
}

function Contractors() {
  const [contractors, setContractors] =
    useState(initialContractors)

  const compliant = contractors.filter(
    (contractor) =>
      contractor.safetyStatus ===
      'Compliant'
  ).length

  const pending = contractors.filter(
    (contractor) =>
      contractor.safetyStatus ===
      'Pending Review'
  ).length

  const nonCompliant = contractors.filter(
    (contractor) =>
      contractor.safetyStatus ===
      'Non-Compliant'
  ).length

  const totalWorkers = contractors.reduce(
    (total, contractor) =>
      total + contractor.workers,
    0
  )

  const activeContracts = contractors.filter(
    (contractor) =>
      contractor.contract === 'Active'
  ).length

  const safetyCoverage =
    contractors.length === 0
      ? 100
      : Math.round(
          (compliant / contractors.length) * 100
        )

  const updateStatus = (id) => {
    setContractors(
      contractors.map((contractor) =>
        contractor.id === id
          ? {
              ...contractor,
              safetyStatus: 'Compliant',
            }
          : contractor
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
              Governance / Contractors
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#202823] sm:text-[28px]">
              Contractors
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f7972]">
              Monitor contractor safety status, workforce
              coverage, and contract activity across the mine.
            </p>
          </div>

          <div className="flex items-center gap-2 border border-[#d9ded9] bg-white px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#3b9a67]" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#59635d]">
              Contractor register active
            </span>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-2 gap-6 border-y border-[#dfe3de] bg-[#f8f9f6] px-1 py-5 sm:grid-cols-5">
        <Metric
          label="Contractors"
          value={contractors.length}
          detail="Registered"
        />

        <Metric
          label="Compliant"
          value={compliant}
          detail={`${safetyCoverage}% coverage`}
          emphasis="success"
        />

        <Metric
          label="Pending review"
          value={pending}
          detail="Requires review"
          emphasis="attention"
        />

        <Metric
          label="Non-compliant"
          value={nonCompliant}
          detail="Requires action"
          emphasis="danger"
        />

        <Metric
          label="Contract workforce"
          value={totalWorkers}
          detail={`${activeContracts} active contracts`}
        />
      </section>

      {/* Contractor safety position */}
      <section className="border-y border-[#dfe3de] bg-white">
        <div className="grid lg:grid-cols-[1fr_300px]">
          <div className="border-b border-[#e3e6e3] px-5 py-6 lg:border-b-0 lg:border-r lg:px-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
                Contractor safety position
              </p>

              <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
                Safety compliance coverage
              </h2>

              <p className="mt-1 max-w-xl text-xs leading-5 text-[#7a837d]">
                Proportion of registered contractors currently
                recorded as compliant.
              </p>
            </div>

            <div className="mt-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="text-4xl font-semibold tracking-[-0.05em] text-[#202823]">
                    {safetyCoverage}%
                  </span>

                  <span className="ml-2 text-xs text-[#7a837d]">
                    compliant
                  </span>
                </div>

                <span className="text-xs text-[#7a837d]">
                  {compliant} of {contractors.length}{' '}
                  contractors
                </span>
              </div>

              <div className="mt-4 h-3 w-full bg-[#e5e8e5]">
                <div
                  className="h-full bg-[#3b9a67] transition-all"
                  style={{
                    width: `${safetyCoverage}%`,
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
              Contractor exposure
            </p>

            <div className="mt-5 space-y-5">
              <div className="flex items-center justify-between border-b border-[#dfe3de] pb-4">
                <span className="text-xs text-[#69736c]">
                  Compliant
                </span>

                <span className="text-lg font-semibold text-[#27734a]">
                  {compliant}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#dfe3de] pb-4">
                <span className="text-xs text-[#69736c]">
                  Pending review
                </span>

                <span className="text-lg font-semibold text-[#9b6f21]">
                  {pending}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#69736c]">
                  Non-compliant
                </span>

                <span className="text-lg font-semibold text-[#b04438]">
                  {nonCompliant}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contractor registry */}
      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9b6f21]">
              Contractor registry
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#202823]">
              Registered Contractors
            </h2>
          </div>

          <p className="text-xs text-[#7a837d]">
            {totalWorkers} contractor workers represented
          </p>
        </div>

        <div className="overflow-hidden border-y border-[#dfe3de] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[950px] w-full text-left text-sm">
              <thead className="border-b border-[#dfe3de] bg-[#f6f7f4]">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Contractor
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Workers
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Safety status
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Contract
                  </th>

                  <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7a837d]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {contractors.map(
                  (contractor) => (
                    <tr
                      key={contractor.id}
                      className="border-b border-[#edf0ed] last:border-b-0 hover:bg-[#fafbf9]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <CompanyMark
                            company={
                              contractor.company
                            }
                          />

                          <div>
                            <p className="text-xs font-semibold text-[#303a34]">
                              {contractor.company}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#8a938d]">
                              {contractor.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-[#59635d]">
                          {contractor.workers}
                        </span>

                        <span className="ml-1 text-[10px] text-[#8a938d]">
                          workers
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <SafetyBadge
                          status={
                            contractor.safetyStatus
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <ContractBadge
                          status={
                            contractor.contract
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        {contractor.safetyStatus !==
                          'Compliant' && (
                          <button
                            type="button"
                            onClick={() =>
                              updateStatus(
                                contractor.id
                              )
                            }
                            className="border border-[#334039] bg-[#334039] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#202823]"
                          >
                            Mark Compliant
                          </button>
                        )}

                        {contractor.safetyStatus ===
                          'Compliant' && (
                          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9aa19c]">
                            Up to date
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
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
              Contractor control
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Maintain visibility into safety standing for
              organizations operating within mine activities.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Workforce exposure
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Contractor worker counts provide context for
              the operational footprint of each company.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#858e88]">
              Governance
            </p>

            <p className="mt-1 text-xs leading-5 text-[#69736c]">
              Contractor safety status contributes to the
              broader mine compliance picture.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contractors