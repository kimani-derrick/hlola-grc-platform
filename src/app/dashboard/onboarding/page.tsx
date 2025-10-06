'use client';

import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { frameworks } from '../../../data/frameworks';
import { useActiveFrameworks } from '../../../context/ActiveFrameworksContext';

type StepKey = 'org' | 'scope' | 'frameworks' | 'data' | 'roles' | 'risk' | 'integrations' | 'review';

interface OrgProfile {
  orgName: string;
  industry: string;
  employees: string;
}

interface Scope {
  markets: string[];
  processes: string[];
}

export default function OnboardingPage() {
  const { activeFrameworkIds, setActiveFrameworkIds } = useActiveFrameworks();

  const [step, setStep] = useState<StepKey>('org');
  const [org, setOrg] = useState<OrgProfile>({ orgName: '', industry: '', employees: '1-50' });
  const [scope, setScope] = useState<Scope>({ markets: [], processes: [] });
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(activeFrameworkIds ?? []);
  const [dataInfo, setDataInfo] = useState({ hasInventory: false, locations: [] as string[], categories: [] as string[] });
  const [roles, setRoles] = useState({ dpo: '', securityLead: '', businessOwner: '' });
  const [risk, setRisk] = useState({ scale: '1-5', appetite: 'moderate' });
  const [integrations, setIntegrations] = useState({ jira: false, azureAd: false, okta: false });

  useEffect(() => {
    const saved = localStorage.getItem('onboarding');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStep(parsed.step ?? 'org');
        setOrg(parsed.org ?? org);
        setScope(parsed.scope ?? scope);
        setSelectedFrameworks(parsed.selectedFrameworks ?? selectedFrameworks);
        setDataInfo(parsed.dataInfo ?? dataInfo);
        setRoles(parsed.roles ?? roles);
        setRisk(parsed.risk ?? risk);
        setIntegrations(parsed.integrations ?? integrations);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onboarding', JSON.stringify({ step, org, scope, selectedFrameworks, dataInfo, roles, risk, integrations }));
  }, [step, org, scope, selectedFrameworks, dataInfo, roles, risk, integrations]);

  const stepOrder: StepKey[] = useMemo(() => ['org', 'scope', 'frameworks', 'data', 'roles', 'risk', 'integrations', 'review'], []);
  const index = stepOrder.indexOf(step);

  const next = () => setStep(stepOrder[Math.min(index + 1, stepOrder.length - 1)]);
  const back = () => setStep(stepOrder[Math.max(index - 1, 0)]);

  const finish = () => {
    setActiveFrameworkIds(selectedFrameworks);
    localStorage.removeItem('onboarding');
    window.location.href = '/dashboard';
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button type="button" onClick={onChange} className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}>
      <span className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`}></span>
    </button>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm6 13v-2a4 4 0 00-4-4H10a4 4 0 00-4 4v2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Organization Onboarding</h1>
                <p className="text-sm text-gray-600">Set up your GRC workspace in a few guided steps.</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">Step {index + 1} of {stepOrder.length}</div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {step === 'org' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Organization Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Organization Name</label>
                    <input value={org.orgName} onChange={(e) => setOrg({ ...org, orgName: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Acme Inc." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Industry</label>
                    <input value={org.industry} onChange={(e) => setOrg({ ...org, industry: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Fintech" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Employees</label>
                    <select value={org.employees} onChange={(e) => setOrg({ ...org, employees: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option>1-50</option>
                      <option>51-250</option>
                      <option>251-1000</option>
                      <option>1000+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 'scope' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Regulatory Scope</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">Target Markets</label>
                    <input placeholder="e.g., Kenya, Nigeria, EU" className="w-full border border-gray-300 rounded-lg px-3 py-2" onChange={(e) => setScope({ ...scope, markets: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                    <p className="text-xs text-gray-500">Used to suggest relevant frameworks.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">Key Processing Activities</label>
                    <input placeholder="e.g., HR, Marketing, Payments" className="w-full border border-gray-300 rounded-lg px-3 py-2" onChange={(e) => setScope({ ...scope, processes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                  </div>
                </div>
              </div>
            )}

            {step === 'frameworks' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Select Frameworks</h2>
                <p className="text-sm text-gray-600">Choose frameworks you want to activate. You can modify this later.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {frameworks.map(fw => (
                    <button
                      key={fw.id}
                      onClick={() => setSelectedFrameworks(prev => prev.includes(fw.id) ? prev.filter(id => id !== fw.id) : [...prev, fw.id])}
                      className={`text-left border rounded-xl p-4 hover:shadow transition ${selectedFrameworks.includes(fw.id) ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-gray-200'}`}
                    >
                      <div className="font-semibold text-gray-900">{fw.name}</div>
                      <div className="text-sm text-gray-600">{fw.region}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'data' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Data Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">Maintain Inventory</label>
                    <Toggle checked={dataInfo.hasInventory} onChange={() => setDataInfo({ ...dataInfo, hasInventory: !dataInfo.hasInventory })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Data Locations</label>
                    <input placeholder="e.g., EU, Kenya" className="w-full border border-gray-300 rounded-lg px-3 py-2" onChange={(e) => setDataInfo({ ...dataInfo, locations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Data Categories</label>
                    <input placeholder="e.g., PII, HR, Payments" className="w-full border border-gray-300 rounded-lg px-3 py-2" onChange={(e) => setDataInfo({ ...dataInfo, categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                  </div>
                </div>
              </div>
            )}

            {step === 'roles' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Roles & Responsibilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Data Protection Officer</label>
                    <input value={roles.dpo} onChange={(e) => setRoles({ ...roles, dpo: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Name or email" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Security Lead</label>
                    <input value={roles.securityLead} onChange={(e) => setRoles({ ...roles, securityLead: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Name or email" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Business Owner</label>
                    <input value={roles.businessOwner} onChange={(e) => setRoles({ ...roles, businessOwner: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Name or email" />
                  </div>
                </div>
              </div>
            )}

            {step === 'risk' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Risk Appetite</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Scoring Scale</label>
                    <select value={risk.scale} onChange={(e) => setRisk({ ...risk, scale: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="1-3">1-3</option>
                      <option value="1-5">1-5</option>
                      <option value="1-10">1-10</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Appetite</label>
                    <select value={risk.appetite} onChange={(e) => setRisk({ ...risk, appetite: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 'integrations' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {([
                    { key: 'jira', label: 'Jira' },
                    { key: 'azureAd', label: 'Azure AD' },
                    { key: 'okta', label: 'Okta' },
                  ] as const).map(i => (
                    <div key={i.key} className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                      <div className="text-gray-900 font-medium">{i.label}</div>
                      <Toggle checked={integrations[i.key]} onChange={() => setIntegrations({ ...integrations, [i.key]: !integrations[i.key] })} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Placeholders only – configure later in Settings.</p>
              </div>
            )}

            {step === 'review' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Review & Initialize</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Organization</h3>
                    <p className="text-sm text-gray-700">{org.orgName || '—'} · {org.industry || '—'} · {org.employees}</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Frameworks</h3>
                    <p className="text-sm text-gray-700">{selectedFrameworks.length} selected</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Data Inventory</h3>
                    <p className="text-sm text-gray-700">{dataInfo.hasInventory ? 'Enabled' : 'Not yet'}; {dataInfo.locations.length} locations</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Roles</h3>
                    <p className="text-sm text-gray-700">DPO: {roles.dpo || '—'}, Security: {roles.securityLead || '—'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between rounded-b-2xl">
            <button onClick={back} disabled={index === 0} className={`px-4 py-2 rounded-lg border ${index === 0 ? 'border-gray-200 text-gray-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Back</button>
            {step !== 'review' ? (
              <button onClick={next} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Next</button>
            ) : (
              <button onClick={finish} className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">Finish Setup</button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


