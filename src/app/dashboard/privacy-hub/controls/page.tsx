'use client';

import { useState } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import ControlDetailModal from '../../../../components/ControlDetailModal';
import { formatDate } from '../../../../utils/dateUtils';
import { useActiveFrameworks } from '../../../../context/ActiveFrameworksContext';
import { frameworks } from '../../../../data/frameworks';

// Control status types
type ControlStatus = 'completed' | 'in-progress' | 'not-started' | 'needs-review';
type ControlPriority = 'high' | 'medium' | 'low';

interface Control {
  id: string;
  title: string;
  description: string;
  country: string;
  framework: string;
  status: ControlStatus;
  priority: ControlPriority;
  category: string;
  dueDate: string;
  assignee: string;
  completionRate: number;
  estimatedHours: number;
  businessImpact: string;
}

const controls: Control[] = [
  // Kenya Controls
  {
    id: '1',
    title: 'Appoint Data Protection Officer',
    description: 'Designate a qualified Data Protection Officer as required by Kenya\'s DPA 2019',
    country: 'Kenya',
    framework: 'Data Protection Act 2019',
    status: 'completed',
    priority: 'high',
    category: 'Governance',
    dueDate: '2024-02-01',
    assignee: 'Legal Team',
    completionRate: 100,
    estimatedHours: 8,
    businessImpact: 'Avoid KSh 3 million penalty for non-compliance'
  },
  {
    id: '2',
    title: 'Implement Consent Management',
    description: 'Set up systems to collect, record, and manage customer consent for data processing',
    country: 'Kenya',
    framework: 'Data Protection Act 2019',
    status: 'in-progress',
    priority: 'high',
    category: 'Data Processing',
    dueDate: '2024-02-15',
    assignee: 'Tech Team',
    completionRate: 65,
    estimatedHours: 24,
    businessImpact: 'Enable lawful data processing and customer trust'
  },
  {
    id: '3',
    title: 'Create Privacy Policy',
    description: 'Draft and publish comprehensive privacy policy compliant with Kenyan law',
    country: 'Kenya',
    framework: 'Data Protection Act 2019',
    status: 'completed',
    priority: 'high',
    category: 'Documentation',
    dueDate: '2024-01-20',
    assignee: 'Legal Team',
    completionRate: 100,
    estimatedHours: 16,
    businessImpact: 'Legal requirement for customer-facing operations'
  },
  {
    id: '4',
    title: 'Data Breach Response Plan',
    description: 'Establish procedures for detecting, reporting, and responding to data breaches within 72 hours',
    country: 'Kenya',
    framework: 'Data Protection Act 2019',
    status: 'not-started',
    priority: 'medium',
    category: 'Security',
    dueDate: '2024-03-01',
    assignee: 'Security Team',
    completionRate: 0,
    estimatedHours: 20,
    businessImpact: 'Avoid additional penalties during breach incidents'
  },

  // Ghana Controls
  {
    id: '5',
    title: 'Register with Data Protection Commission',
    description: 'Complete registration process with Ghana\'s Data Protection Commission',
    country: 'Ghana',
    framework: 'Data Protection Act 2012',
    status: 'in-progress',
    priority: 'high',
    category: 'Governance',
    dueDate: '2024-02-10',
    assignee: 'Compliance Team',
    completionRate: 40,
    estimatedHours: 12,
    businessImpact: 'Legal requirement to operate in Ghana'
  },
  {
    id: '6',
    title: 'Data Processing Impact Assessment',
    description: 'Conduct DPIA for high-risk data processing activities',
    country: 'Ghana',
    framework: 'Data Protection Act 2012',
    status: 'not-started',
    priority: 'medium',
    category: 'Risk Assessment',
    dueDate: '2024-02-25',
    assignee: 'Risk Team',
    completionRate: 0,
    estimatedHours: 32,
    businessImpact: 'Identify and mitigate privacy risks'
  },

  // Nigeria Controls
  {
    id: '7',
    title: 'NDPA Compliance Audit',
    description: 'Conduct comprehensive audit of data processing activities under NDPA 2023',
    country: 'Nigeria',
    framework: 'Nigeria Data Protection Act 2023',
    status: 'in-progress',
    priority: 'high',
    category: 'Audit',
    dueDate: '2024-02-20',
    assignee: 'Audit Team',
    completionRate: 75,
    estimatedHours: 40,
    businessImpact: 'Avoid ₦10 billion penalties'
  },
  {
    id: '8',
    title: 'Cross-Border Data Transfer Agreements',
    description: 'Establish adequate safeguards for international data transfers',
    country: 'Nigeria',
    framework: 'Nigeria Data Protection Act 2023',
    status: 'not-started',
    priority: 'medium',
    category: 'Data Transfer',
    dueDate: '2024-03-15',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 28,
    businessImpact: 'Enable international business operations'
  },

  // South Africa Controls
  {
    id: '9',
    title: 'POPIA Information Officer',
    description: 'Appoint and register Information Officer with Information Regulator',
    country: 'South Africa',
    framework: 'POPIA',
    status: 'completed',
    priority: 'high',
    category: 'Governance',
    dueDate: '2024-01-15',
    assignee: 'Executive Team',
    completionRate: 100,
    estimatedHours: 6,
    businessImpact: 'Mandatory for POPIA compliance'
  },
  {
    id: '10',
    title: 'Data Subject Rights Portal',
    description: 'Implement system for handling data subject access, correction, and deletion requests',
    country: 'South Africa',
    framework: 'POPIA',
    status: 'in-progress',
    priority: 'high',
    category: 'Data Rights',
    dueDate: '2024-02-28',
    assignee: 'Tech Team',
    completionRate: 85,
    estimatedHours: 36,
    businessImpact: 'Enable customer data rights and avoid complaints'
  },

  // Uganda Controls
  {
    id: '11',
    title: 'Data Controller Registration',
    description: 'Register as data controller with Uganda\'s data protection authority',
    country: 'Uganda',
    framework: 'Data Protection and Privacy Act 2019',
    status: 'not-started',
    priority: 'medium',
    category: 'Governance',
    dueDate: '2024-03-30',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 10,
    businessImpact: 'Establish legal basis for data processing'
  },

  // Ethiopia Controls
  {
    id: '12',
    title: 'Data Protection Framework Preparation',
    description: 'Prepare for upcoming Ethiopian data protection regulations',
    country: 'Ethiopia',
    framework: 'Data Protection Proclamation (Draft)',
    status: 'not-started',
    priority: 'low',
    category: 'Preparation',
    dueDate: '2024-06-30',
    assignee: 'Strategy Team',
    completionRate: 0,
    estimatedHours: 16,
    businessImpact: 'Stay ahead of emerging regulations'
  },

  // Morocco Controls
  {
    id: '13',
    title: 'Data Processing Records Maintenance',
    description: 'Maintain comprehensive records of data processing activities under Law 09-08',
    country: 'Morocco',
    framework: 'Law 09-08 on Personal Data Protection',
    status: 'completed',
    priority: 'high',
    category: 'Documentation',
    dueDate: '2024-01-01',
    assignee: 'Legal Team',
    completionRate: 100,
    estimatedHours: 6,
    businessImpact: 'Avoid MAD 300,000 penalty for non-compliance'
  },
  {
    id: '14',
    title: 'Data Subject Rights Implementation',
    description: 'Implement procedures for handling data subject access, rectification, and deletion requests',
    country: 'Morocco',
    framework: 'Law 09-08 on Personal Data Protection',
    status: 'in-progress',
    priority: 'high',
    category: 'Rights Management',
    dueDate: '2024-03-15',
    assignee: 'Tech Team',
    completionRate: 70,
    estimatedHours: 20,
    businessImpact: 'Enable customer data rights and build trust'
  },
  {
    id: '15',
    title: 'Cross-Border Data Transfer Safeguards',
    description: 'Establish adequate safeguards for international data transfers',
    country: 'Morocco',
    framework: 'Law 09-08 on Personal Data Protection',
    status: 'not-started',
    priority: 'medium',
    category: 'Data Transfer',
    dueDate: '2024-04-30',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 16,
    businessImpact: 'Enable international business operations'
  },

  // Egypt Controls
  {
    id: '16',
    title: 'Data Subject Rights Procedures',
    description: 'Implement comprehensive data subject rights procedures under PDP Law 2020',
    country: 'Egypt',
    framework: 'Personal Data Protection Law 2020',
    status: 'in-progress',
    priority: 'high',
    category: 'Rights Management',
    dueDate: '2024-03-15',
    assignee: 'Legal Team',
    completionRate: 60,
    estimatedHours: 16,
    businessImpact: 'Avoid EGP 2 million penalty and build customer trust'
  },
  {
    id: '17',
    title: 'Data Protection Impact Assessment',
    description: 'Conduct DPIA for high-risk data processing activities',
    country: 'Egypt',
    framework: 'Personal Data Protection Law 2020',
    status: 'not-started',
    priority: 'medium',
    category: 'Assessment',
    dueDate: '2024-05-31',
    assignee: 'Risk Team',
    completionRate: 0,
    estimatedHours: 24,
    businessImpact: 'Identify and mitigate privacy risks'
  },

  // Tanzania Controls
  {
    id: '18',
    title: 'Privacy Policy Update',
    description: 'Update privacy policy to comply with Personal Data Protection Act 2022',
    country: 'Tanzania',
    framework: 'Personal Data Protection Act 2022',
    status: 'not-started',
    priority: 'medium',
    category: 'Documentation',
    dueDate: '2024-04-01',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 8,
    businessImpact: 'Legal requirement for customer-facing operations'
  },
  {
    id: '19',
    title: 'Data Controller Registration',
    description: 'Register as data controller with Tanzania Data Protection Authority',
    country: 'Tanzania',
    framework: 'Personal Data Protection Act 2022',
    status: 'not-started',
    priority: 'high',
    category: 'Governance',
    dueDate: '2024-03-31',
    assignee: 'Compliance Team',
    completionRate: 0,
    estimatedHours: 12,
    businessImpact: 'Legal requirement to operate in Tanzania'
  },

  // Rwanda Controls
  {
    id: '20',
    title: 'Data Protection Impact Assessment',
    description: 'Complete DPIA for high-risk processing under Law on Data Protection 2021',
    country: 'Rwanda',
    framework: 'Law on Data Protection and Privacy 2021',
    status: 'in-progress',
    priority: 'high',
    category: 'Assessment',
    dueDate: '2024-02-28',
    assignee: 'Risk Team',
    completionRate: 45,
    estimatedHours: 12,
    businessImpact: 'Identify and mitigate privacy risks'
  },
  {
    id: '21',
    title: 'Data Breach Notification Procedures',
    description: 'Establish data breach notification processes within 72 hours',
    country: 'Rwanda',
    framework: 'Law on Data Protection and Privacy 2021',
    status: 'not-started',
    priority: 'high',
    category: 'Security',
    dueDate: '2024-04-15',
    assignee: 'Security Team',
    completionRate: 0,
    estimatedHours: 14,
    businessImpact: 'Avoid RWF 5 million penalty during breach incidents'
  },

  // Mauritius Controls
  {
    id: '22',
    title: 'Data Breach Notification Procedures',
    description: 'Establish data breach notification processes under Data Protection Act 2017',
    country: 'Mauritius',
    framework: 'Data Protection Act 2017',
    status: 'completed',
    priority: 'high',
    category: 'Security',
    dueDate: '2024-01-01',
    assignee: 'Security Team',
    completionRate: 100,
    estimatedHours: 8,
    businessImpact: 'Avoid MUR 200,000 penalty and maintain financial hub credibility'
  },
  {
    id: '23',
    title: 'Data Subject Rights Portal',
    description: 'Implement system for handling data subject access requests',
    country: 'Mauritius',
    framework: 'Data Protection Act 2017',
    status: 'in-progress',
    priority: 'medium',
    category: 'Rights Management',
    dueDate: '2024-03-31',
    assignee: 'Tech Team',
    completionRate: 80,
    estimatedHours: 20,
    businessImpact: 'Enable customer data rights and avoid complaints'
  },

  // Botswana Controls
  {
    id: '24',
    title: 'Data Protection Officer Training',
    description: 'Train designated DPO on Botswana Data Protection Act 2018 requirements',
    country: 'Botswana',
    framework: 'Data Protection Act 2018',
    status: 'not-started',
    priority: 'medium',
    category: 'Training',
    dueDate: '2024-04-30',
    assignee: 'HR Team',
    completionRate: 0,
    estimatedHours: 12,
    businessImpact: 'Ensure competent data protection oversight'
  },
  {
    id: '25',
    title: 'Privacy Impact Assessment',
    description: 'Conduct privacy impact assessment for high-risk processing',
    country: 'Botswana',
    framework: 'Data Protection Act 2018',
    status: 'not-started',
    priority: 'medium',
    category: 'Assessment',
    dueDate: '2024-06-30',
    assignee: 'Risk Team',
    completionRate: 0,
    estimatedHours: 16,
    businessImpact: 'Identify and mitigate privacy risks'
  },

  // Senegal Controls
  {
    id: '26',
    title: 'Data Protection Authority Registration',
    description: 'Register with Commission de Protection des Données Personnelles',
    country: 'Senegal',
    framework: 'Loi sur la Protection des Données Personnelles 2016',
    status: 'in-progress',
    priority: 'high',
    category: 'Registration',
    dueDate: '2024-03-31',
    assignee: 'Compliance Team',
    completionRate: 30,
    estimatedHours: 6,
    businessImpact: 'Legal requirement to operate in Senegal'
  },
  {
    id: '27',
    title: 'Data Processing Inventory',
    description: 'Create comprehensive inventory of data processing activities',
    country: 'Senegal',
    framework: 'Loi sur la Protection des Données Personnelles 2016',
    status: 'not-started',
    priority: 'medium',
    category: 'Documentation',
    dueDate: '2024-05-15',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 10,
    businessImpact: 'Ensure transparency and accountability'
  },

  // Ivory Coast Controls
  {
    id: '28',
    title: 'Data Processing Inventory',
    description: 'Create comprehensive inventory of data processing activities under Law 2013',
    country: 'Ivory Coast',
    framework: 'Loi sur la Protection des Données Personnelles 2013',
    status: 'not-started',
    priority: 'high',
    category: 'Documentation',
    dueDate: '2024-04-15',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 12,
    businessImpact: 'Legal requirement for WAEMU compliance'
  },
  {
    id: '29',
    title: 'Data Subject Rights Implementation',
    description: 'Implement data subject rights procedures for Ivorian operations',
    country: 'Ivory Coast',
    framework: 'Loi sur la Protection des Données Personnelles 2013',
    status: 'not-started',
    priority: 'medium',
    category: 'Rights Management',
    dueDate: '2024-06-30',
    assignee: 'Tech Team',
    completionRate: 0,
    estimatedHours: 18,
    businessImpact: 'Enable customer data rights and build trust'
  },

  // Algeria Controls
  {
    id: '30',
    title: 'Data Protection Authority Notification',
    description: 'Notify Autorité de Protection des Données Personnelles of processing activities',
    country: 'Algeria',
    framework: 'Loi sur la Protection des Données Personnelles 2018',
    status: 'in-progress',
    priority: 'high',
    category: 'Registration',
    dueDate: '2024-04-30',
    assignee: 'Compliance Team',
    completionRate: 40,
    estimatedHours: 6,
    businessImpact: 'Legal requirement to operate in Algeria'
  },
  {
    id: '31',
    title: 'Data Security Implementation',
    description: 'Implement technical and organizational security measures',
    country: 'Algeria',
    framework: 'Loi sur la Protection des Données Personnelles 2018',
    status: 'not-started',
    priority: 'high',
    category: 'Security',
    dueDate: '2024-06-30',
    assignee: 'Security Team',
    completionRate: 0,
    estimatedHours: 24,
    businessImpact: 'Protect personal data and avoid DZD 1 million penalty'
  },

  // Tunisia Controls
  {
    id: '32',
    title: 'Data Processing Impact Assessment',
    description: 'Conduct DPIA for high-risk processing activities under Law 2004',
    country: 'Tunisia',
    framework: 'Loi sur la Protection des Données Personnelles 2004',
    status: 'in-progress',
    priority: 'high',
    category: 'Assessment',
    dueDate: '2024-05-31',
    assignee: 'Risk Team',
    completionRate: 55,
    estimatedHours: 16,
    businessImpact: 'Identify risks and prepare for EU adequacy'
  },
  {
    id: '33',
    title: 'Cross-Border Data Transfer Agreements',
    description: 'Establish adequate safeguards for EU data transfers',
    country: 'Tunisia',
    framework: 'Loi sur la Protection des Données Personnelles 2004',
    status: 'not-started',
    priority: 'medium',
    category: 'Data Transfer',
    dueDate: '2024-07-31',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 20,
    businessImpact: 'Enable EU market access and partnerships'
  },

  // Zambia Controls
  {
    id: '34',
    title: 'Data Protection Officer Appointment',
    description: 'Appoint qualified Data Protection Officer under Data Protection Act 2021',
    country: 'Zambia',
    framework: 'Data Protection Act 2021',
    status: 'not-started',
    priority: 'high',
    category: 'Governance',
    dueDate: '2024-06-30',
    assignee: 'Executive Team',
    completionRate: 0,
    estimatedHours: 8,
    businessImpact: 'Legal requirement for Zambian operations'
  },
  {
    id: '35',
    title: 'Data Processing Records',
    description: 'Maintain comprehensive data processing records',
    country: 'Zambia',
    framework: 'Data Protection Act 2021',
    status: 'not-started',
    priority: 'medium',
    category: 'Documentation',
    dueDate: '2024-08-31',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 12,
    businessImpact: 'Ensure transparency and accountability'
  },

  // Zimbabwe Controls
  {
    id: '36',
    title: 'Privacy Policy Development',
    description: 'Develop comprehensive privacy policy for Data Protection Act 2021 compliance',
    country: 'Zimbabwe',
    framework: 'Data Protection Act 2021',
    status: 'not-started',
    priority: 'medium',
    category: 'Documentation',
    dueDate: '2024-07-31',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 10,
    businessImpact: 'Legal requirement for customer-facing operations'
  },
  {
    id: '37',
    title: 'Data Security Measures',
    description: 'Implement technical and organizational security measures',
    country: 'Zimbabwe',
    framework: 'Data Protection Act 2021',
    status: 'not-started',
    priority: 'high',
    category: 'Security',
    dueDate: '2024-09-30',
    assignee: 'Security Team',
    completionRate: 0,
    estimatedHours: 20,
    businessImpact: 'Protect personal data and avoid USD 200,000 penalty'
  },

  // Angola Controls
  {
    id: '38',
    title: 'Data Subject Rights Implementation',
    description: 'Implement data subject rights procedures under Lei de Proteção de Dados Pessoais 2020',
    country: 'Angola',
    framework: 'Lei de Proteção de Dados Pessoais 2020',
    status: 'in-progress',
    priority: 'high',
    category: 'Rights Management',
    dueDate: '2024-04-30',
    assignee: 'Tech Team',
    completionRate: 35,
    estimatedHours: 16,
    businessImpact: 'Enable customer data rights and build trust'
  },
  {
    id: '39',
    title: 'Data Processing Impact Assessment',
    description: 'Conduct DPIA for high-risk processing activities',
    country: 'Angola',
    framework: 'Lei de Proteção de Dados Pessoais 2020',
    status: 'not-started',
    priority: 'medium',
    category: 'Assessment',
    dueDate: '2024-06-30',
    assignee: 'Risk Team',
    completionRate: 0,
    estimatedHours: 18,
    businessImpact: 'Identify and mitigate privacy risks'
  },

  // Namibia Controls
  {
    id: '40',
    title: 'Data Breach Notification Procedures',
    description: 'Establish data breach notification processes under Data Protection Act 2019',
    country: 'Namibia',
    framework: 'Data Protection Act 2019',
    status: 'not-started',
    priority: 'medium',
    category: 'Security',
    dueDate: '2024-07-31',
    assignee: 'Security Team',
    completionRate: 0,
    estimatedHours: 10,
    businessImpact: 'Avoid NAD 200,000 penalty during breach incidents'
  },
  {
    id: '41',
    title: 'Data Controller Registration',
    description: 'Register as data controller with Namibian data protection authority',
    country: 'Namibia',
    framework: 'Data Protection Act 2019',
    status: 'not-started',
    priority: 'high',
    category: 'Governance',
    dueDate: '2024-05-31',
    assignee: 'Compliance Team',
    completionRate: 0,
    estimatedHours: 8,
    businessImpact: 'Legal requirement to operate in Namibia'
  },

  // GDPR Controls
  {
    id: '42',
    title: 'Data Protection Impact Assessment (DPIA)',
    description: 'Conduct comprehensive DPIA for high-risk processing activities under GDPR',
    country: 'European Union',
    framework: 'General Data Protection Regulation',
    status: 'in-progress',
    priority: 'high',
    category: 'Assessment',
    dueDate: '2024-03-01',
    assignee: 'Risk Team',
    completionRate: 45,
    estimatedHours: 24,
    businessImpact: 'Avoid €20 million penalty and identify privacy risks'
  },
  {
    id: '43',
    title: 'Data Subject Rights Portal',
    description: 'Implement comprehensive system for handling GDPR data subject requests',
    country: 'European Union',
    framework: 'General Data Protection Regulation',
    status: 'in-progress',
    priority: 'high',
    category: 'Rights Management',
    dueDate: '2024-02-28',
    assignee: 'Tech Team',
    completionRate: 75,
    estimatedHours: 40,
    businessImpact: 'Enable customer data rights and avoid complaints'
  },
  {
    id: '44',
    title: 'Data Protection Officer (DPO) Appointment',
    description: 'Appoint qualified DPO as required by GDPR Article 37',
    country: 'European Union',
    framework: 'General Data Protection Regulation',
    status: 'completed',
    priority: 'high',
    category: 'Governance',
    dueDate: '2024-01-01',
    assignee: 'Executive Team',
    completionRate: 100,
    estimatedHours: 12,
    businessImpact: 'Legal requirement for GDPR compliance'
  },
  {
    id: '45',
    title: 'Privacy by Design Implementation',
    description: 'Implement privacy by design principles in all systems and processes',
    country: 'European Union',
    framework: 'General Data Protection Regulation',
    status: 'in-progress',
    priority: 'high',
    category: 'Implementation',
    dueDate: '2024-04-30',
    assignee: 'Tech Team',
    completionRate: 60,
    estimatedHours: 48,
    businessImpact: 'Ensure compliance from system design stage'
  },
  {
    id: '46',
    title: 'Cross-Border Data Transfer Mechanisms',
    description: 'Establish Standard Contractual Clauses and adequacy decisions for international transfers',
    country: 'European Union',
    framework: 'General Data Protection Regulation',
    status: 'not-started',
    priority: 'high',
    category: 'Data Transfer',
    dueDate: '2024-05-31',
    assignee: 'Legal Team',
    completionRate: 0,
    estimatedHours: 32,
    businessImpact: 'Enable international business operations'
  },
  {
    id: '47',
    title: 'Data Breach Notification System',
    description: 'Implement 72-hour breach notification system to supervisory authority',
    country: 'European Union',
    framework: 'General Data Protection Regulation',
    status: 'completed',
    priority: 'high',
    category: 'Security',
    dueDate: '2024-01-01',
    assignee: 'Security Team',
    completionRate: 100,
    estimatedHours: 16,
    businessImpact: 'Avoid additional penalties during breach incidents'
  },
  {
    id: '48',
    title: 'Consent Management System',
    description: 'Implement granular consent management with easy withdrawal options',
    country: 'European Union',
    framework: 'General Data Protection Regulation',
    status: 'in-progress',
    priority: 'high',
    category: 'Data Processing',
    dueDate: '2024-03-15',
    assignee: 'Tech Team',
    completionRate: 80,
    estimatedHours: 36,
    businessImpact: 'Enable lawful data processing and customer trust'
  },
  {
    id: '49',
    title: 'Data Processing Records',
    description: 'Maintain comprehensive records of processing activities under Article 30',
    country: 'European Union',
    framework: 'General Data Protection Regulation',
    status: 'completed',
    priority: 'high',
    category: 'Documentation',
    dueDate: '2024-01-01',
    assignee: 'Legal Team',
    completionRate: 100,
    estimatedHours: 20,
    businessImpact: 'Legal requirement for GDPR compliance'
  },

  // ISO 27701 Controls
  {
    id: '50',
    title: 'Privacy Information Management System (PIMS)',
    description: 'Implement comprehensive PIMS based on ISO/IEC 27701 requirements',
    country: 'International',
    framework: 'ISO/IEC 27701',
    status: 'in-progress',
    priority: 'high',
    category: 'Implementation',
    dueDate: '2024-06-30',
    assignee: 'Compliance Team',
    completionRate: 35,
    estimatedHours: 40,
    businessImpact: 'Achieve international privacy management certification'
  },
  {
    id: '51',
    title: 'Privacy Risk Management Framework',
    description: 'Establish privacy risk management processes and procedures',
    country: 'International',
    framework: 'ISO/IEC 27701',
    status: 'in-progress',
    priority: 'high',
    category: 'Risk Management',
    dueDate: '2024-05-31',
    assignee: 'Risk Team',
    completionRate: 50,
    estimatedHours: 24,
    businessImpact: 'Systematic approach to privacy risk management'
  },
  {
    id: '52',
    title: 'Privacy Policy and Procedures Documentation',
    description: 'Develop comprehensive privacy policies and procedures documentation',
    country: 'International',
    framework: 'ISO/IEC 27701',
    status: 'in-progress',
    priority: 'medium',
    category: 'Documentation',
    dueDate: '2024-04-30',
    assignee: 'Legal Team',
    completionRate: 70,
    estimatedHours: 28,
    businessImpact: 'Ensure clear privacy governance framework'
  },
  {
    id: '53',
    title: 'Privacy Training Program',
    description: 'Implement comprehensive privacy training for all staff',
    country: 'International',
    framework: 'ISO/IEC 27701',
    status: 'not-started',
    priority: 'medium',
    category: 'Training',
    dueDate: '2024-07-31',
    assignee: 'HR Team',
    completionRate: 0,
    estimatedHours: 16,
    businessImpact: 'Ensure staff awareness of privacy requirements'
  },
  {
    id: '54',
    title: 'Privacy Incident Management',
    description: 'Establish privacy incident management and response procedures',
    country: 'International',
    framework: 'ISO/IEC 27701',
    status: 'not-started',
    priority: 'high',
    category: 'Security',
    dueDate: '2024-06-15',
    assignee: 'Security Team',
    completionRate: 0,
    estimatedHours: 20,
    businessImpact: 'Effective response to privacy incidents'
  },
  {
    id: '55',
    title: 'Third-Party Privacy Management',
    description: 'Implement privacy management for third-party processors and controllers',
    country: 'International',
    framework: 'ISO/IEC 27701',
    status: 'not-started',
    priority: 'medium',
    category: 'Vendor Management',
    dueDate: '2024-08-31',
    assignee: 'Procurement Team',
    completionRate: 0,
    estimatedHours: 24,
    businessImpact: 'Ensure third-party privacy compliance'
  },
  {
    id: '56',
    title: 'Privacy Performance Monitoring',
    description: 'Establish privacy performance monitoring and measurement processes',
    country: 'International',
    framework: 'ISO/IEC 27701',
    status: 'not-started',
    priority: 'medium',
    category: 'Monitoring',
    dueDate: '2024-09-30',
    assignee: 'Compliance Team',
    completionRate: 0,
    estimatedHours: 18,
    businessImpact: 'Continuous improvement of privacy management'
  },
  {
    id: '57',
    title: 'Privacy Management System Audit',
    description: 'Conduct internal audit of privacy management system',
    country: 'International',
    framework: 'ISO/IEC 27701',
    status: 'not-started',
    priority: 'high',
    category: 'Audit',
    dueDate: '2024-10-31',
    assignee: 'Audit Team',
    completionRate: 0,
    estimatedHours: 32,
    businessImpact: 'Prepare for ISO 27701 certification audit'
  }
];

const statusConfig = {
  'completed': { color: 'text-green-700', bg: 'bg-green-100', dot: 'bg-green-500' },
  'in-progress': { color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-500' },
  'not-started': { color: 'text-gray-700', bg: 'bg-gray-100', dot: 'bg-gray-500' },
  'needs-review': { color: 'text-orange-700', bg: 'bg-orange-100', dot: 'bg-orange-500' }
};

const priorityConfig = {
  'high': { color: 'text-red-700', bg: 'bg-red-100' },
  'medium': { color: 'text-yellow-700', bg: 'bg-yellow-100' },
  'low': { color: 'text-green-700', bg: 'bg-green-100' }
};

export default function ControlsPage() {
  const { activeFrameworkIds, getActiveFrameworkCount } = useActiveFrameworks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredControls = controls.filter(control => {
    const matchesSearch = control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         control.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         control.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || control.country === selectedCountry;
    const matchesStatus = selectedStatus === 'all' || control.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || control.priority === selectedPriority;
    
    // Fix framework matching logic
    let matchesFramework = true;
    if (selectedFramework !== 'all') {
      // Find the framework by name and match by country
      const framework = frameworks.find(f => f.name === selectedFramework);
      if (framework) {
        matchesFramework = control.country === framework.region;
      } else {
        matchesFramework = control.framework === selectedFramework;
      }
    }
    
    return matchesSearch && matchesCountry && matchesStatus && matchesPriority && matchesFramework;
  });

  const getProgressColor = (rate: number) => {
    if (rate === 100) return 'bg-green-500';
    if (rate >= 50) return 'bg-blue-500';
    if (rate > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const countries = [...new Set(controls.map(c => c.country))];
  const completedControls = controls.filter(c => c.status === 'completed').length;
  const inProgressControls = controls.filter(c => c.status === 'in-progress').length;
  const overallProgress = Math.round((completedControls / controls.length) * 100);

  return (
    <DashboardLayout>
      <div className="px-2 py-4 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliance Controls</h1>
              <p className="text-gray-600 mt-2">Track and complete specific tasks required by each country&apos;s data protection laws</p>
              
              {/* What are controls explanation */}
              <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      <strong>What are controls?</strong> These are specific tasks your business must complete to comply with each country&apos;s data protection laws. 
                      Complete these tasks to protect customer data, avoid fines, and build trust.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{completedControls}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressControls}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Countries Covered</p>
                  <p className="text-2xl font-bold text-gray-900">{countries.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Frameworks Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Frameworks</h3>
                <p className="text-gray-600 text-sm">Controls organized by your active compliance frameworks</p>
                {/* Debug info - remove in production */}
                <div className="mt-2 text-xs text-gray-500">
                  Active Framework IDs: {activeFrameworkIds.join(', ')} (Count: {getActiveFrameworkCount()})
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {frameworks.filter(f => activeFrameworkIds.includes(f.id)).length} Active Frameworks
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {filteredControls.length} Controls
                </span>
              </div>
            </div>
            
            {/* Framework Cards - Only show active frameworks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frameworks
                .filter(framework => activeFrameworkIds.includes(framework.id))
                .map(framework => {
                  // Find controls that match this framework by country/region
                  const frameworkControls = controls.filter(c => 
                    c.country === framework.region
                  );
                  const completedCount = frameworkControls.filter(c => c.status === 'completed').length;
                  const progress = frameworkControls.length > 0 ? Math.round((completedCount / frameworkControls.length) * 100) : 0;
                  
                  return (
                    <div key={framework.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{framework.icon}</span>
                          <h4 className="font-semibold text-gray-900 text-sm">{framework.name}</h4>
                        </div>
                        <span className="text-xs text-gray-500">{frameworkControls.length} controls</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{completedCount} completed</span>
                          <span>{frameworkControls.length - completedCount} remaining</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFramework(framework.name)}
                        className="w-full mt-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                      >
                        View {framework.name} Controls
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search controls..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
            >
              <option value="all">All Active Frameworks</option>
              {frameworks
                .filter(framework => activeFrameworkIds.includes(framework.id))
                .map(framework => (
                  <option key={framework.id} value={framework.name}>{framework.name}</option>
                ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="all">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="not-started">Not Started</option>
              <option value="needs-review">Needs Review</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#26558e] focus:border-transparent"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Framework Filter Indicator */}
        {selectedFramework !== 'all' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Viewing {selectedFramework} Controls</h3>
                  <p className="text-sm text-gray-600">{filteredControls.length} controls found</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFramework('all')}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Show All Frameworks
              </button>
            </div>
          </div>
        )}

        {/* Controls List */}
        <div className="space-y-4">
          {filteredControls.map((control) => (
            <div
              key={control.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedControl(control);
                setIsDetailModalOpen(true);
              }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{control.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[control.status].bg} ${statusConfig[control.status].color}`}>
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${statusConfig[control.status].dot}`}></span>
                        {control.status.charAt(0).toUpperCase() + control.status.slice(1).replace('-', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig[control.priority].bg} ${priorityConfig[control.priority].color}`}>
                        {control.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{control.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {control.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                        </svg>
                        {control.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {control.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                        </svg>
                        Due {formatDate(control.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-6 text-right">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{control.completionRate}%</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(control.completionRate)}`}
                        style={{ width: `${control.completionRate}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-500">{control.estimatedHours}h estimated</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                  <p className="text-sm text-blue-700 font-medium">Business Impact:</p>
                  <p className="text-sm text-blue-600">{control.businessImpact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredControls.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2m-2 0v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2h2zm8-2V3a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No controls found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find controls.</p>
          </div>
        )}
      </div>

      {/* Control Detail Modal */}
      {selectedControl && (
        <ControlDetailModal
          control={selectedControl}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedControl(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}
