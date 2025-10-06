'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export default function AIAssistantPage() {
  const [showGuidedTour, setShowGuidedTour] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<{
    name?: string;
    company?: string;
    role?: string;
    email?: string;
    countries?: string[];
    industry?: string;
    consent?: boolean;
  } | null>(null);
  // Removed unused userProfile state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [plannedFrameworks, setPlannedFrameworks] = useState<string[]>(['PCI DSS', 'ISO 27001', 'SOC 2', 'AML/KYC']);

  // Load onboarding data on component mount (non-blocking)
  useEffect(() => {
    const savedOnboardingData = localStorage.getItem('onboardingData');
    console.log('Onboarding data from localStorage:', savedOnboardingData);
    if (savedOnboardingData) {
      try {
        const parsed = JSON.parse(savedOnboardingData);
        console.log('Parsed onboarding data:', parsed);
        setOnboardingData(parsed);
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, []);

  // Initialize planned frameworks based on onboarding data (EU -> include GDPR)
  useEffect(() => {
    const base = ['PCI DSS', 'ISO 27001', 'SOC 2', 'AML/KYC'];
    const euCountries = ['United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland', 'Ireland', 'Portugal', 'Greece'];
    const addGDPR = onboardingData?.countries?.some((c: string) => euCountries.includes(c));
    const initialList = addGDPR ? [...base, 'GDPR'] : base;
    setPlannedFrameworks(initialList);
  }, [onboardingData]);

  // Removed loading timeout to ensure guided flow always starts

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getGuidedTourSteps = () => {
    const name = onboardingData?.name || 'there';
    const company = onboardingData?.company || 'your organization';
    return [
      {
        id: 'bank-welcome',
        title: `Welcome ${name}! Let’s set up Banking Compliance`,
        content: `Hi ${name} from ${company}! 👋\n\nI’ll guide you through a pre-configured banking compliance path. We’ll handle scope, activate required frameworks (PCI DSS, ISO 27001, SOC 2, AML/KYC, and GDPR if applicable), install baseline controls, seed risks, provision policies, and enable evidence tracking.\n\nYou just confirm each step — I’ll do the heavy lifting.`,
        type: 'guide',
        options: ['Begin Banking Guided Setup']
      },
      {
        id: 'scope-readiness',
        title: 'Step 1: Establish Scope & Readiness',
        content: 'I will preconfigure scope for a bank: cardholder data, PII, transactions, internal systems, third parties; environments and regions. You can refine later.',
        type: 'guide',
        options: ['Do it for me', 'Skip and use defaults']
      },
      {
        id: 'frameworks-auto',
        title: 'Step 2: Activate Required Frameworks',
        content: `I will activate the following frameworks now: ${plannedFrameworks.join(', ')}. You can say \'remove PCI DSS\' or \'add ISO 27701\' at any time.`,
        type: 'guide',
        options: ['Activate frameworks now']
      },
      {
        id: 'controls-pack',
        title: 'Step 3: Install Baseline Controls Pack',
        content: 'I will install curated baseline controls: access control, encryption, logging/monitoring, change management, vendor risk, incident response, business continuity, AML/KYC checks, and PCI DSS required controls.',
        type: 'guide',
        options: ['Install baseline controls']
      },
      {
        id: 'data-inventory',
        title: 'Step 4: Create Data Inventory & Flows',
        content: 'I will generate starter records for data inventory (customer PII, transactions, auth logs, card data tokens) and a default data flow map (web → API → core banking → data warehouse).',
        type: 'guide',
        options: ['Generate starter inventory']
      },
      {
        id: 'risk-seed',
        title: 'Step 5: Seed Risk Register',
        content: 'I will add predefined banking risks (card data breach, insider fraud, vendor outage, AML false negatives) with likelihood/impact and suggested treatments.',
        type: 'guide',
        options: ['Seed risks']
      },
      {
        id: 'policy-kit',
        title: 'Step 6: Provision Policy Kit',
        content: 'I will create editable policy templates (Information Security, Access Control, Encryption, Incident Response, Vendor Management, AML/KYC, Privacy).',
        type: 'guide',
        options: ['Create policy templates']
      },
      {
        id: 'evidence-automation',
        title: 'Step 7: Enable Evidence & Monitoring',
        content: 'I will enable evidence placeholders and scheduled checks (access reviews, log retention, encryption key rotation, AML sampling) so you can upload proof or connect integrations later.',
        type: 'guide',
        options: ['Enable evidence tracking']
      },
      {
        id: 'roadmap',
        title: 'Step 8: Your Initial Roadmap',
        content: 'All set. I created your initial banking roadmap: finalize scope, assign control owners, upload key policies, connect SIEM, schedule quarterly reviews, and prepare PCI DSS readiness. We can walk through each milestone or jump to chat.',
        type: 'guide',
        options: ['Finish setup and continue to Assistant']
      }
    ];
  };

  const guidedTourSteps = getGuidedTourSteps();

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Setup New Framework',
      description: 'Guide me through setting up a new compliance framework',
      icon: '🛡️',
      action: () => handleQuickAction('Setup New Framework')
    },
    {
      id: '2',
      title: 'GDPR Compliance',
      description: 'Help me understand GDPR requirements and controls',
      icon: '📋',
      action: () => handleQuickAction('GDPR Compliance')
    },
    {
      id: '3',
      title: 'Create Audit',
      description: 'Walk me through creating a new audit',
      icon: '🔍',
      action: () => handleQuickAction('Create Audit')
    },
    {
      id: '4',
      title: 'Risk Assessment',
      description: 'Help me conduct a risk assessment',
      icon: '⚠️',
      action: () => handleQuickAction('Risk Assessment')
    },
    {
      id: '5',
      title: 'Document Management',
      description: 'Show me how to manage compliance documents',
      icon: '📄',
      action: () => handleQuickAction('Document Management')
    },
    {
      id: '6',
      title: 'Compliance Status',
      description: 'Give me an overview of my compliance status',
      icon: '📊',
      action: () => handleQuickAction('Compliance Status')
    }
  ];

  const handleGuidedTourOption = (option: string) => {
    const currentStepData = guidedTourSteps[currentStep];

    if (currentStepData.id === 'bank-welcome') {
      if (option === 'Begin Banking Guided Setup') {
        // Proceed to scope configuration
        setCurrentStep(1);
      }
      return;
    }

    if (currentStepData.id === 'scope-readiness') {
      // Simulate scope configuration
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '✅ Scope configured: data domains, environments, regions, and third parties set with banking defaults.',
        timestamp: new Date()
      }]);
      setCurrentStep(2);
      return;
    }

    if (currentStepData.id === 'frameworks-auto') {
      // Simulate framework activation
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '✅ Activated frameworks: PCI DSS, ISO 27001, SOC 2, AML/KYC, and GDPR (if EU).',
        timestamp: new Date()
      }]);
      setCurrentStep(3);
      return;
    }

    if (currentStepData.id === 'controls-pack') {
      // Simulate installing controls
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '✅ Installed baseline controls pack for banking (access, encryption, logs, change mgmt, vendor risk, IR, BCP, AML/KYC, PCI).',
        timestamp: new Date()
      }]);
      setCurrentStep(4);
      return;
    }

    if (currentStepData.id === 'data-inventory') {
      // Simulate data inventory generation
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '✅ Generated starter data inventory and default data flow map for banking operations.',
        timestamp: new Date()
      }]);
      setCurrentStep(5);
      return;
    }

    if (currentStepData.id === 'risk-seed') {
      // Simulate risk register seeding
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '✅ Seeded risk register with predefined banking risks and treatments.',
        timestamp: new Date()
      }]);
      setCurrentStep(6);
      return;
    }

    if (currentStepData.id === 'policy-kit') {
      // Simulate policy templates creation
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '✅ Provisioned editable policy templates (InfoSec, Access Control, Encryption, IR, Vendor, AML/KYC, Privacy).',
        timestamp: new Date()
      }]);
      setCurrentStep(7);
      return;
    }

    if (currentStepData.id === 'evidence-automation') {
      // Simulate evidence tracking enablement
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '✅ Enabled evidence placeholders and scheduled checks (access reviews, log retention, key rotation, AML sampling).',
        timestamp: new Date()
      }]);
      setCurrentStep(8);
      return;
    }

    if (currentStepData.id === 'roadmap') {
      // Finish and open assistant with a kickoff message
      setShowGuidedTour(false);
      setMessages([{
        id: '1',
        type: 'assistant',
        content: "Your Banking Guided Setup is complete. I've configured scope, activated frameworks (PCI DSS, ISO 27001, SOC 2, AML/KYC, GDPR if applicable), installed baseline controls, seeded risks, created policy templates, and enabled evidence tracking. What would you like to do next?",
        timestamp: new Date(),
        suggestions: [
          'Review my banking roadmap',
          'Assign control owners',
          'Upload key policies',
          'Connect SIEM / evidence integrations'
        ]
      }]);
      return;
    }
  };

  // Removed unused functions

  const getRecommendedFrameworks = (industry: string, countries: string[]) => {
    const frameworks = [];
    
    // EU countries - GDPR
    if (countries.some((country: string) => ['United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland'].includes(country))) {
      frameworks.push({
        name: 'GDPR',
        reason: 'Required for EU operations and data processing'
      });
    }
    
    // US - CCPA
    if (countries.includes('United States')) {
      frameworks.push({
        name: 'CCPA',
        reason: 'Required for California residents and US operations'
      });
    }
    
    // Industry-specific
    if (industry === 'Healthcare') {
      frameworks.push({
        name: 'HIPAA',
        reason: 'Required for healthcare organizations handling patient data'
      });
    }
    
    if (industry === 'Technology' || industry === 'Software') {
      frameworks.push({
        name: 'SOC 2',
        reason: 'Industry standard for technology companies'
      });
      frameworks.push({
        name: 'ISO 27001',
        reason: 'International standard for information security management'
      });
    }
    
    if (industry === 'Finance' || industry === 'Banking') {
      frameworks.push({
        name: 'PCI DSS',
        reason: 'Required for handling payment card data'
      });
    }
    
    // Default recommendations
    if (frameworks.length === 0) {
      frameworks.push({
        name: 'ISO 27001',
        reason: 'Good starting point for information security'
      });
    }
    
    return frameworks;
  };

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: action,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(action);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (query: string) => {
    // Intercept intents for adding/removing frameworks during guided setup
    const lower = query.trim().toLowerCase();
    if (lower.startsWith('remove ')) {
      const toRemove = query.slice(7).trim();
      if (toRemove) {
        setPlannedFrameworks(prev => prev.filter(f => f.toLowerCase() !== toRemove.toLowerCase()))
      }
      return {
        content: `Okay, I won't include '${toRemove}' in the activation list. Current plan: ${plannedFrameworks.filter(f => f.toLowerCase() !== toRemove.toLowerCase()).join(', ')}`,
        suggestions: ['Proceed with activation', 'Add ISO 27701', 'Add NIST CSF', 'Show planned frameworks']
      };
    }
    if (lower.startsWith('add ')) {
      const toAdd = query.slice(4).trim();
      if (toAdd && !plannedFrameworks.some(f => f.toLowerCase() === toAdd.toLowerCase())) {
        setPlannedFrameworks(prev => [...prev, toAdd]);
      }
      return {
        content: `Got it. I've added '${toAdd}' to the activation list. Current plan: ${[...plannedFrameworks, ...(plannedFrameworks.some(f => f.toLowerCase() === toAdd.toLowerCase()) ? [] : [toAdd])].join(', ')}`,
        suggestions: ['Proceed with activation', 'Remove PCI DSS', 'Remove SOC 2', 'Show planned frameworks']
      };
    }

    const responses: Record<string, { content: string; suggestions: string[] }> = {
      'Setup New Framework': {
        content: "Great! Let's set up a new compliance framework. Here's how to get started:\n\n1. **Go to Privacy Hub → Frameworks**\n2. **Click 'Add New Framework'**\n3. **Select your framework type** (GDPR, CCPA, ISO 27001, etc.)\n4. **Configure framework settings**\n5. **Map your data processing activities**\n6. **Set up compliance controls**\n\nWould you like me to walk you through any specific step in detail?",
        suggestions: [
          "Show me how to configure GDPR settings",
          "What controls should I enable?",
          "How do I map data activities?",
          "Take me to the Frameworks page"
        ]
      },
      'GDPR Compliance': {
        content: "GDPR compliance is crucial for data protection. Here's what you need to know:\n\n**Key GDPR Requirements:**\n• **Data Subject Rights** - Right to access, rectification, erasure\n• **Consent Management** - Clear, specific, informed consent\n• **Data Protection Impact Assessments** - For high-risk processing\n• **Breach Notification** - 72-hour notification requirement\n• **Privacy by Design** - Built-in data protection\n\n**Essential Controls:**\n• Data inventory and mapping\n• Consent management system\n• Data subject request handling\n• Privacy impact assessments\n• Breach response procedures\n\nWould you like me to help you implement any of these?",
        suggestions: [
          "Set up consent management",
          "Create data inventory",
          "Configure breach procedures",
          "Show me GDPR controls"
        ]
      },
      'Create Audit': {
        content: "Let's create a comprehensive audit for your compliance program:\n\n**Step 1: Planning**\n• Define audit scope and objectives\n• Select audit team and timeline\n• Prepare audit checklist\n\n**Step 2: Execution**\n• Review policies and procedures\n• Interview key personnel\n• Test controls and processes\n• Document findings\n\n**Step 3: Reporting**\n• Analyze results\n• Identify gaps and risks\n• Create action plan\n• Present findings to management\n\n**Pro Tip:** Start with a risk-based approach focusing on high-impact areas.\n\nReady to begin?",
        suggestions: [
          "Start with GDPR audit",
          "Show me audit templates",
          "Configure audit schedule",
          "Take me to Audit Center"
        ]
      },
      'Risk Assessment': {
        content: "Risk assessment is the foundation of effective compliance. Here's your step-by-step guide:\n\n**1. Identify Assets**\n• Data assets (personal data, sensitive data)\n• IT systems and infrastructure\n• Business processes\n• Third-party relationships\n\n**2. Threat Analysis**\n• Internal threats (human error, malicious insiders)\n• External threats (cyber attacks, natural disasters)\n• Regulatory threats (compliance violations)\n\n**3. Vulnerability Assessment**\n• Technical vulnerabilities\n• Process gaps\n• Control weaknesses\n\n**4. Risk Calculation**\n• Likelihood × Impact = Risk Score\n• Categorize as Low, Medium, High, Critical\n\n**5. Risk Treatment**\n• Accept, Avoid, Mitigate, or Transfer\n• Implement controls\n• Monitor and review\n\nLet's start with identifying your key assets!",
        suggestions: [
          "Start asset identification",
          "Show me risk templates",
          "Configure risk scoring",
          "Take me to Risk Management"
        ]
      },
      'Document Management': {
        content: "Effective document management is key to compliance success. Here's how to organize your compliance documents:\n\n**Document Categories:**\n• **Policies** - Data protection, security, privacy policies\n• **Procedures** - Step-by-step operational procedures\n• **Records** - Audit logs, consent records, breach reports\n• **Templates** - Standardized forms and checklists\n• **Training Materials** - Employee training content\n\n**Best Practices:**\n• Version control and approval workflows\n• Regular review and updates\n• Secure storage and access controls\n• Document retention policies\n• Searchable metadata and tags\n\n**Document Lifecycle:**\n1. Create → 2. Review → 3. Approve → 4. Publish → 5. Monitor → 6. Update\n\nReady to organize your documents?",
        suggestions: [
          "Upload new documents",
          "Set up document workflows",
          "Configure retention policies",
          "Take me to Documents"
        ]
      },
      'Compliance Status': {
        content: "Let me give you a comprehensive overview of your compliance status:\n\n**Overall Compliance Score: 78%** 🟡\n\n**Framework Status:**\n• **GDPR**: 85% Complete ✅\n• **CCPA**: 60% Complete 🟡\n• **ISO 27001**: 45% Complete 🔴\n• **SOC 2**: 90% Complete ✅\n\n**Key Metrics:**\n• **Active Controls**: 156/200\n• **Overdue Tasks**: 12\n• **Upcoming Deadlines**: 8\n• **Risk Items**: 5 High, 12 Medium\n\n**Priority Actions:**\n1. Complete ISO 27001 implementation\n2. Update CCPA privacy notices\n3. Conduct Q4 risk assessment\n4. Review vendor contracts\n\n**Next Steps:**\nWould you like me to help you tackle any of these priority items?",
        suggestions: [
          "Focus on ISO 27001",
          "Update CCPA notices",
          "Schedule risk assessment",
          "Review vendor contracts"
        ]
      }
    };

    return responses[query] || {
      content: "I understand you're asking about: " + query + ". Let me help you with that. Could you provide more specific details about what you'd like to know?",
      suggestions: [
        "Can you be more specific?",
        "Show me examples",
        "Take me to the relevant section",
        "Start over"
      ]
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#26558e] to-[#41c3d6] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-600">Your intelligent compliance copilot</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>

        {/* Guided Tour Interface */}
        {showGuidedTour && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Step {currentStep + 1} of {guidedTourSteps.length}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(((currentStep + 1) / guidedTourSteps.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#26558e] to-[#41c3d6] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / guidedTourSteps.length) * 100}%` }}
                    ></div>
                  </div>
              </div>

              {/* Current Step Content */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {guidedTourSteps[currentStep].title}
                </h2>
                <div className="text-lg text-gray-700 whitespace-pre-line max-w-3xl mx-auto">
                  {guidedTourSteps[currentStep].content}
                </div>
                
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {guidedTourSteps[currentStep].options.map((option, index) => {
                  const isSelected = false;
                  const isContinueButton = option.includes('Continue with');
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleGuidedTourOption(option)}
                      className={`p-6 text-left border-2 rounded-xl transition-all duration-200 group ${
                        isSelected 
                          ? 'border-[#41c3d6] bg-[#41c3d6]/10' 
                          : isContinueButton
                          ? 'border-[#26558e] bg-[#26558e]/10 hover:bg-[#26558e]/20'
                          : 'border-gray-200 hover:border-[#41c3d6] hover:bg-[#41c3d6]/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'bg-[#41c3d6] text-white' 
                            : isContinueButton
                            ? 'bg-[#26558e] text-white'
                            : 'bg-[#26558e]/10 group-hover:bg-[#41c3d6]/20'
                        }`}>
                          {isSelected ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-[#26558e] font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <span className={`font-medium group-hover:text-[#26558e] ${
                          isSelected ? 'text-[#26558e]' : 'text-gray-900'
                        }`}>
                          {option}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* In-Guide Chat Box */}
              <div className="mt-8 border-t pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Ask or adjust while we set things up</h4>
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., remove PCI DSS, add ISO 27701, why do we need SOC 2?"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#41c3d6] focus:border-[#41c3d6] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="px-5 py-3 bg-gradient-to-r from-[#26558e] to-[#41c3d6] text-white rounded-xl font-medium hover:from-[#1e4470] hover:to-[#2dd4da] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Send
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2">Current plan: {plannedFrameworks.join(', ')}</p>
              </div>

              
            </div>
          </div>
        )}

        {/* Main Chat Interface - Only show when guided tour is complete */}
        {!showGuidedTour && (
          <div className="flex-1 flex gap-6">
            {/* Quick Actions Sidebar */}
            <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-[#41c3d6] hover:bg-[#41c3d6]/5 transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{action.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-[#26558e]">{action.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto max-h-[600px]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-[#26558e] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-sm opacity-75">Suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="border-t border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about compliance, frameworks, or how to use the platform..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#41c3d6] focus:border-[#41c3d6] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-[#26558e] to-[#41c3d6] text-white rounded-xl font-medium hover:from-[#1e4470] hover:to-[#2dd4da] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
