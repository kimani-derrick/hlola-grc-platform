const fs = require('fs');
const path = require('path');
const Framework = require('../models/Framework');
const { pool } = require('../config/database');

const query = (text, params) => pool.query(text, params);

// African countries data
const africanCountries = [
  { code: 'AGO', name: 'Angola', slug: 'angola' },
  { code: 'BDI', name: 'Burundi', slug: 'burundi' },
  { code: 'BEN', name: 'Benin', slug: 'benin' },
  { code: 'BFA', name: 'Burkina Faso', slug: 'burkina-faso' },
  { code: 'BWA', name: 'Botswana', slug: 'botswana' },
  { code: 'CAF', name: 'Central African Republic', slug: 'central-african-republic' },
  { code: 'CIV', name: 'Cote d\'Ivoire', slug: 'cote-divoire' },
  { code: 'CMR', name: 'Cameroon', slug: 'cameroon' },
  { code: 'COD', name: 'Democratic Republic of Congo', slug: 'drc' },
  { code: 'COG', name: 'Congo', slug: 'congo' },
  { code: 'COM', name: 'Comoros', slug: 'comoros' },
  { code: 'CPV', name: 'Cabo Verde', slug: 'cabo-verde' },
  { code: 'DJI', name: 'Djibouti', slug: 'djibouti' },
  { code: 'DZA', name: 'Algeria', slug: 'algeria' },
  { code: 'EGY', name: 'Egypt', slug: 'egypt' },
  { code: 'EQG', name: 'Equatorial Guinea', slug: 'equatorial-guinea' },
  { code: 'ERI', name: 'Eritrea', slug: 'eritrea' },
  { code: 'ETH', name: 'Ethiopia', slug: 'ethiopia' },
  { code: 'GAB', name: 'Gabon', slug: 'gabon' },
  { code: 'GHA', name: 'Ghana', slug: 'ghana' },
  { code: 'GIN', name: 'Guinea', slug: 'guinea' },
  { code: 'GMB', name: 'Gambia', slug: 'gambia' },
  { code: 'GNB', name: 'Guinea-Bissau', slug: 'guinea-bissau' },
  { code: 'KEN', name: 'Kenya', slug: 'kenya' },
  { code: 'LBR', name: 'Liberia', slug: 'liberia' },
  { code: 'LBY', name: 'Libya', slug: 'libya' },
  { code: 'LSO', name: 'Lesotho', slug: 'lesotho' },
  { code: 'MAR', name: 'Morocco', slug: 'morocco' },
  { code: 'MDG', name: 'Madagascar', slug: 'madagascar' },
  { code: 'MLI', name: 'Mali', slug: 'mali' },
  { code: 'MLI2', name: 'Somalia', slug: 'somalia' },
  { code: 'MOZ', name: 'Mozambique', slug: 'mozambique' },
  { code: 'MRT', name: 'Mauritania', slug: 'mauritania' },
  { code: 'MUS', name: 'Mauritius', slug: 'mauritius' },
  { code: 'MWI', name: 'Malawi', slug: 'malawi' },
  { code: 'NAM', name: 'Namibia', slug: 'namibia' },
  { code: 'NER', name: 'Niger', slug: 'niger' },
  { code: 'NGA', name: 'Nigeria', slug: 'nigeria' },
  { code: 'RWA', name: 'Rwanda', slug: 'rwanda' },
  { code: 'SDN', name: 'Sudan', slug: 'sudan' },
  { code: 'SEN', name: 'Senegal', slug: 'senegal' },
  { code: 'SLE', name: 'Sierra Leone', slug: 'sierra-leone' },
  { code: 'SSD', name: 'South Sudan', slug: 'south-sudan' },
  { code: 'STP', name: 'Sao Tome and Principe', slug: 'sao-tome' },
  { code: 'SWZ', name: 'Eswatini', slug: 'eswatini' },
  { code: 'SYC', name: 'Seychelles', slug: 'seychelles' },
  { code: 'TCD', name: 'Chad', slug: 'chad' },
  { code: 'TGO', name: 'Togo', slug: 'togo' },
  { code: 'TUN', name: 'Tunisia', slug: 'tunisia' },
  { code: 'TZA', name: 'Tanzania', slug: 'tanzania' },
  { code: 'UGA', name: 'Uganda', slug: 'uganda' },
  { code: 'ZAF', name: 'South Africa', slug: 'south-africa' },
  { code: 'ZMB', name: 'Zambia', slug: 'zambia' },
  { code: 'ZWE', name: 'Zimbabwe', slug: 'zimbabwe' }
];

// Control templates for each country
const controlTemplates = [
  {
    domain: 'Data Protection Principles',
    title: 'Lawful Basis for Processing',
    description: 'Organizations must establish and document lawful basis for all personal data processing activities',
    implementationGuidance: 'Document the lawful basis for processing in your data processing register',
    evidenceRequirements: ['Processing register', 'data mapping documentation'],
    legalProvision: 'Art. 6'
  },
  {
    domain: 'Data Subject Rights',
    title: 'Right to Access',
    description: 'Organizations must provide data subjects with access to their personal data upon request',
    implementationGuidance: 'Create a process for verifying identity and responding to access requests within required timeframes',
    evidenceRequirements: ['DSR procedure document', 'request logs', 'response templates'],
    legalProvision: 'Art. 15'
  }
];

// Special cases for countries with specific legal provisions
const specialLegalProvisions = {
  'KEN': {
    'KEN-001': 'Data Protection Act Section 30',
    'KEN-002': 'Data Protection Act Section 26'
  },
  'NGA': {
    'NGA-001': 'Art. 6',
    'NGA-002': 'Art. 15'
  }
};

async function seedFrameworks() {
  console.log('🌍 Starting African frameworks seeding...');
  
  try {
    // Create frameworks for each African country
    for (const country of africanCountries) {
      const frameworkData = {
        name: `${country.name} Data Protection Act`,
        description: `Data protection framework for ${country.name} based on local data protection legislation`,
        region: 'Africa',
        country: country.name,
        category: 'Privacy',
        type: 'Legal',
        icon: 'shield-check',
        color: '#3B82F6',
        priority: 'high',
        riskLevel: 'high',
        status: 'active',
        requirementsCount: 2,
        applicableCountries: [country.name],
        industryScope: 'All'
      };

      const framework = await Framework.create(frameworkData);
      console.log(`✅ Created framework for ${country.name} (ID: ${framework.id})`);
    }

    console.log('🎉 African frameworks seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding frameworks:', error);
    throw error;
  }
}

async function seedControls() {
  console.log('📋 Starting controls seeding...');
  
  try {
    // Get all African frameworks
    const frameworks = await Framework.findAll({ region: 'Africa' });
    console.log(`Found ${frameworks.length} African frameworks`);

    let totalControls = 0;

    for (const framework of frameworks) {
      // Extract country code from framework name
      const countryName = framework.country;
      const country = africanCountries.find(c => c.name === countryName);
      
      if (!country) {
        console.warn(`⚠️  Country not found for framework: ${framework.name}`);
        continue;
      }

      // Create controls for this framework
      for (let i = 0; i < controlTemplates.length; i++) {
        const template = controlTemplates[i];
        const controlId = `${country.code}-${String(i + 1).padStart(3, '0')}`;
        
        // Check for special legal provisions
        const legalProvision = specialLegalProvisions[country.code]?.[controlId] || template.legalProvision;

        const controlData = {
          framework_id: framework.id,
          control_id: controlId,
          title: template.title,
          description: template.description,
          category: template.domain,
          subcategory: null,
          priority: 'high',
          implementation_level: 'basic',
          business_impact: `Compliance with ${country.name} data protection requirements`,
          technical_requirements: null,
          legal_requirements: legalProvision,
          implementation_guidance: template.implementationGuidance,
          testing_procedures: null,
          evidence_requirements: template.evidenceRequirements
        };

        await query(
          `INSERT INTO controls (framework_id, control_id, title, description, category, subcategory, priority, implementation_level, business_impact, technical_requirements, legal_requirements, implementation_guidance, testing_procedures, evidence_requirements)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            controlData.framework_id,
            controlData.control_id,
            controlData.title,
            controlData.description,
            controlData.category,
            controlData.subcategory,
            controlData.priority,
            controlData.implementation_level,
            controlData.business_impact,
            controlData.technical_requirements,
            controlData.legal_requirements,
            controlData.implementation_guidance,
            controlData.testing_procedures,
            controlData.evidence_requirements
          ]
        );

        totalControls++;
      }

      console.log(`✅ Created controls for ${country.name} (${controlTemplates.length} controls)`);
    }

    console.log(`🎉 Controls seeding completed! Created ${totalControls} controls across ${frameworks.length} frameworks`);
  } catch (error) {
    console.error('❌ Error seeding controls:', error);
    throw error;
  }
}

async function seedInternationalFrameworks() {
  console.log('🌐 Starting international frameworks seeding...');
  
  try {
    const internationalFrameworks = [
      {
        name: 'GDPR',
        description: 'General Data Protection Regulation - EU data protection law',
        region: 'Europe',
        country: 'European Union',
        category: 'Privacy',
        type: 'Legal',
        icon: 'shield-check',
        color: '#10B981',
        priority: 'high',
        riskLevel: 'critical',
        status: 'active',
        requirementsCount: 99,
        applicableCountries: ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'],
        industryScope: 'All'
      },
      {
        name: 'CCPA',
        description: 'California Consumer Privacy Act - California data protection law',
        region: 'Americas',
        country: 'United States',
        category: 'Privacy',
        type: 'Legal',
        icon: 'shield-check',
        color: '#F59E0B',
        priority: 'high',
        riskLevel: 'high',
        status: 'active',
        requirementsCount: 12,
        applicableCountries: ['United States'],
        industryScope: 'All'
      },
      {
        name: 'ISO 27001',
        description: 'Information Security Management System - International standard',
        region: 'Global',
        country: null,
        category: 'Security',
        type: 'Standards',
        icon: 'lock-closed',
        color: '#8B5CF6',
        priority: 'high',
        riskLevel: 'high',
        status: 'active',
        requirementsCount: 114,
        applicableCountries: [],
        industryScope: 'All'
      },
      {
        name: 'SOC 2',
        description: 'Service Organization Control 2 - Security, availability, and confidentiality',
        region: 'Global',
        country: null,
        category: 'Security',
        type: 'Standards',
        icon: 'lock-closed',
        color: '#EF4444',
        priority: 'high',
        riskLevel: 'high',
        status: 'active',
        requirementsCount: 64,
        applicableCountries: [],
        industryScope: 'Technology'
      },
      {
        name: 'HIPAA',
        description: 'Health Insurance Portability and Accountability Act - US healthcare data protection',
        region: 'Americas',
        country: 'United States',
        category: 'Healthcare',
        type: 'Legal',
        icon: 'heart',
        color: '#EC4899',
        priority: 'high',
        riskLevel: 'critical',
        status: 'active',
        requirementsCount: 18,
        applicableCountries: ['United States'],
        industryScope: 'Healthcare'
      },
      {
        name: 'PCI DSS',
        description: 'Payment Card Industry Data Security Standard - Payment card data protection',
        region: 'Global',
        country: null,
        category: 'Financial',
        type: 'Standards',
        icon: 'credit-card',
        color: '#06B6D4',
        priority: 'high',
        riskLevel: 'critical',
        status: 'active',
        requirementsCount: 12,
        applicableCountries: [],
        industryScope: 'Financial'
      }
    ];

    for (const frameworkData of internationalFrameworks) {
      const framework = await Framework.create(frameworkData);
      console.log(`✅ Created international framework: ${framework.name} (ID: ${framework.id})`);
    }

    console.log('🎉 International frameworks seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding international frameworks:', error);
    throw error;
  }
}

async function runSeeder() {
  console.log('🚀 Starting Framework Seeder...');
  
  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');

    // Clear existing data (optional - uncomment if you want to reset)
    // console.log('🧹 Clearing existing framework data...');
    // await query('DELETE FROM controls WHERE framework_id IN (SELECT id FROM frameworks WHERE region = $1)', ['Africa']);
    // await query('DELETE FROM frameworks WHERE region = $1', ['Africa']);
    // console.log('✅ Existing data cleared');

    // Seed African frameworks
    await seedFrameworks();
    
    // Seed controls for African frameworks
    await seedControls();
    
    // Seed international frameworks
    await seedInternationalFrameworks();

    console.log('🎉 Framework seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run seeder if called directly
if (require.main === module) {
  runSeeder();
}

module.exports = {
  runSeeder,
  seedFrameworks,
  seedControls,
  seedInternationalFrameworks
};
