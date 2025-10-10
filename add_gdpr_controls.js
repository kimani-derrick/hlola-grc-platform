const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'hlola_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hlola_grc_platform',
  password: process.env.DB_PASSWORD || 'hlola2025',
  port: process.env.DB_PORT || 5433,
});

// GDPR Framework ID
const GDPR_FRAMEWORK_ID = '87aa7301-4529-4a57-ab13-9afbf5f1c467';

// 10 Essential GDPR Controls
const gdprControls = [
  {
    control_id: 'GDPR-001',
    title: 'Lawful Basis for Processing',
    description: 'Establish and document lawful basis for all personal data processing activities under Article 6 GDPR',
    category: 'Data Protection Principles',
    subcategory: 'Lawfulness',
    priority: 'high',
    implementation_level: 'basic',
    business_impact: 'Legal requirement for all data processing activities',
    technical_requirements: 'Data processing register, consent management system',
    legal_requirements: 'Article 6 GDPR - Lawfulness of processing',
    implementation_guidance: 'Document the lawful basis for each processing activity in your data processing register. Ensure consent is freely given, specific, informed, and unambiguous.',
    testing_procedures: 'Review data processing register, verify consent mechanisms, check documentation completeness',
    evidence_requirements: [
      'Data processing register',
      'Consent forms and mechanisms',
      'Legitimate interest assessments',
      'Contractual necessity documentation'
    ]
  },
  {
    control_id: 'GDPR-002',
    title: 'Data Subject Rights - Right to Access',
    description: 'Implement procedures to handle data subject access requests within 30 days',
    category: 'Data Subject Rights',
    subcategory: 'Access Rights',
    priority: 'high',
    implementation_level: 'intermediate',
    business_impact: 'Legal requirement with potential fines for non-compliance',
    technical_requirements: 'Data discovery tools, automated response systems',
    legal_requirements: 'Article 15 GDPR - Right of access by the data subject',
    implementation_guidance: 'Create a process for verifying identity and responding to access requests within 30 days. Provide clear, transparent information about data processing.',
    testing_procedures: 'Test access request process, verify response times, check data completeness',
    evidence_requirements: [
      'Access request procedure document',
      'Request handling logs',
      'Response templates',
      'Identity verification process'
    ]
  },
  {
    control_id: 'GDPR-003',
    title: 'Data Subject Rights - Right to Rectification',
    description: 'Enable data subjects to correct inaccurate personal data',
    category: 'Data Subject Rights',
    subcategory: 'Rectification Rights',
    priority: 'high',
    implementation_level: 'intermediate',
    business_impact: 'Legal requirement to maintain data accuracy',
    technical_requirements: 'Data correction workflows, audit trails',
    legal_requirements: 'Article 16 GDPR - Right to rectification',
    implementation_guidance: 'Implement processes for data subjects to request corrections and ensure data accuracy across all systems.',
    testing_procedures: 'Test rectification requests, verify data updates, check notification processes',
    evidence_requirements: [
      'Rectification request procedure',
      'Data correction workflows',
      'Audit trails of changes',
      'Notification processes'
    ]
  },
  {
    control_id: 'GDPR-004',
    title: 'Data Subject Rights - Right to Erasure',
    description: 'Implement right to be forgotten procedures for personal data deletion',
    category: 'Data Subject Rights',
    subcategory: 'Erasure Rights',
    priority: 'high',
    implementation_level: 'advanced',
    business_impact: 'Legal requirement with complex technical implementation',
    technical_requirements: 'Data deletion tools, backup management, third-party notifications',
    legal_requirements: 'Article 17 GDPR - Right to erasure',
    implementation_guidance: 'Develop comprehensive data deletion procedures including backups, third-party systems, and legal obligations.',
    testing_procedures: 'Test deletion processes, verify complete removal, check third-party notifications',
    evidence_requirements: [
      'Erasure request procedure',
      'Data deletion workflows',
      'Backup management procedures',
      'Third-party notification logs'
    ]
  },
  {
    control_id: 'GDPR-005',
    title: 'Data Protection by Design and Default',
    description: 'Implement technical and organizational measures to ensure data protection by design and by default',
    category: 'Technical and Organizational Measures',
    subcategory: 'Privacy by Design',
    priority: 'high',
    implementation_level: 'advanced',
    business_impact: 'Fundamental requirement for all new systems and processes',
    technical_requirements: 'Privacy impact assessments, technical safeguards, data minimization tools',
    legal_requirements: 'Article 25 GDPR - Data protection by design and by default',
    implementation_guidance: 'Integrate data protection principles into all new systems, processes, and services from the design stage.',
    testing_procedures: 'Review system designs, conduct privacy impact assessments, verify technical safeguards',
    evidence_requirements: [
      'Privacy impact assessments',
      'System design documentation',
      'Technical safeguard implementations',
      'Data minimization procedures'
    ]
  },
  {
    control_id: 'GDPR-006',
    title: 'Data Protection Impact Assessment (DPIA)',
    description: 'Conduct DPIAs for high-risk processing activities',
    category: 'Risk Management',
    subcategory: 'Impact Assessment',
    priority: 'high',
    implementation_level: 'intermediate',
    business_impact: 'Legal requirement for high-risk processing with potential supervisory authority consultation',
    technical_requirements: 'Risk assessment tools, documentation systems',
    legal_requirements: 'Article 35 GDPR - Data protection impact assessment',
    implementation_guidance: 'Conduct DPIAs for processing likely to result in high risk to individuals, especially new technologies.',
    testing_procedures: 'Review DPIA documentation, verify risk assessments, check supervisory authority consultations',
    evidence_requirements: [
      'DPIA documentation',
      'Risk assessment reports',
      'Mitigation measures',
      'Supervisory authority consultations'
    ]
  },
  {
    control_id: 'GDPR-007',
    title: 'Data Breach Notification',
    description: 'Implement procedures for detecting, investigating, and reporting personal data breaches',
    category: 'Incident Management',
    subcategory: 'Breach Response',
    priority: 'critical',
    implementation_level: 'intermediate',
    business_impact: 'Legal requirement with strict timelines and potential fines',
    technical_requirements: 'Breach detection systems, incident response tools, notification systems',
    legal_requirements: 'Articles 33-34 GDPR - Notification of personal data breach',
    implementation_guidance: 'Establish breach detection, investigation, and notification procedures within 72 hours of awareness.',
    testing_procedures: 'Test breach response procedures, verify notification timelines, check documentation',
    evidence_requirements: [
      'Breach response procedure',
      'Incident response plan',
      'Notification templates',
      'Breach investigation reports'
    ]
  },
  {
    control_id: 'GDPR-008',
    title: 'Data Processing Records',
    description: 'Maintain comprehensive records of processing activities',
    category: 'Documentation',
    subcategory: 'Processing Records',
    priority: 'high',
    implementation_level: 'basic',
    business_impact: 'Legal requirement for accountability and transparency',
    technical_requirements: 'Documentation systems, data mapping tools',
    legal_requirements: 'Article 30 GDPR - Records of processing activities',
    implementation_guidance: 'Maintain detailed records of all processing activities including purposes, categories, recipients, and retention periods.',
    testing_procedures: 'Review processing records, verify completeness, check accuracy',
    evidence_requirements: [
      'Processing activity records',
      'Data mapping documentation',
      'Purpose limitation records',
      'Retention period documentation'
    ]
  },
  {
    control_id: 'GDPR-009',
    title: 'Data Protection Officer (DPO)',
    description: 'Appoint and support a Data Protection Officer where required',
    category: 'Governance',
    subcategory: 'Data Protection Officer',
    priority: 'medium',
    implementation_level: 'basic',
    business_impact: 'Legal requirement for certain organizations and processing activities',
    technical_requirements: 'DPO contact systems, reporting mechanisms',
    legal_requirements: 'Articles 37-39 GDPR - Data protection officer',
    implementation_guidance: 'Appoint a DPO where required and ensure they have appropriate resources and independence.',
    testing_procedures: 'Verify DPO appointment, check independence, review reporting mechanisms',
    evidence_requirements: [
      'DPO appointment documentation',
      'DPO contact information',
      'Reporting procedures',
      'DPO independence documentation'
    ]
  },
  {
    control_id: 'GDPR-010',
    title: 'Cross-Border Data Transfers',
    description: 'Implement appropriate safeguards for international data transfers',
    category: 'International Transfers',
    subcategory: 'Transfer Safeguards',
    priority: 'high',
    implementation_level: 'advanced',
    business_impact: 'Legal requirement for transfers outside the EEA with potential restrictions',
    technical_requirements: 'Transfer impact assessments, contractual safeguards, technical measures',
    legal_requirements: 'Articles 44-49 GDPR - Transfers of personal data to third countries',
    implementation_guidance: 'Implement appropriate safeguards for international transfers including adequacy decisions, standard contractual clauses, or binding corporate rules.',
    testing_procedures: 'Review transfer mechanisms, verify safeguards, check adequacy decisions',
    evidence_requirements: [
      'Transfer impact assessments',
      'Standard contractual clauses',
      'Adequacy decision documentation',
      'Binding corporate rules'
    ]
  }
];

async function addGDPRControls() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting to add GDPR controls...');
    
    // Check if GDPR framework exists
    const frameworkCheck = await client.query(
      'SELECT id, name FROM frameworks WHERE id = $1',
      [GDPR_FRAMEWORK_ID]
    );
    
    if (frameworkCheck.rows.length === 0) {
      throw new Error('GDPR framework not found!');
    }
    
    console.log(`✅ Found framework: ${frameworkCheck.rows[0].name}`);
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const control of gdprControls) {
      try {
        // Check if control already exists
        const existingControl = await client.query(
          'SELECT id FROM controls WHERE control_id = $1 AND framework_id = $2',
          [control.control_id, GDPR_FRAMEWORK_ID]
        );
        
        if (existingControl.rows.length > 0) {
          console.log(`⏭️  Skipping ${control.control_id} - already exists`);
          skippedCount++;
          continue;
        }
        
        // Insert the control
        const result = await client.query(`
          INSERT INTO controls (
            framework_id, control_id, title, description, category, subcategory,
            priority, implementation_level, business_impact, technical_requirements,
            legal_requirements, implementation_guidance, testing_procedures,
            evidence_requirements, created_at, updated_at, is_active
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW(), true
          ) RETURNING id, control_id, title
        `, [
          GDPR_FRAMEWORK_ID,
          control.control_id,
          control.title,
          control.description,
          control.category,
          control.subcategory,
          control.priority,
          control.implementation_level,
          control.business_impact,
          control.technical_requirements,
          control.legal_requirements,
          control.implementation_guidance,
          control.testing_procedures,
          JSON.stringify(control.evidence_requirements)
        ]);
        
        console.log(`✅ Added: ${result.rows[0].control_id} - ${result.rows[0].title}`);
        addedCount++;
        
      } catch (error) {
        console.error(`❌ Error adding ${control.control_id}:`, error.message);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Added: ${addedCount} controls`);
    console.log(`⏭️  Skipped: ${skippedCount} controls`);
    console.log(`📋 Total processed: ${gdprControls.length} controls`);
    
    // Verify the addition
    const verifyQuery = await client.query(
      'SELECT COUNT(*) as count FROM controls WHERE framework_id = $1',
      [GDPR_FRAMEWORK_ID]
    );
    
    console.log(`\n🔍 Verification: GDPR framework now has ${verifyQuery.rows[0].count} controls`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
addGDPRControls()
  .then(() => {
    console.log('\n🎉 GDPR controls addition completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error.message);
    process.exit(1);
  });

