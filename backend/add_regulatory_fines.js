const { pool } = require('./src/config/database');

// Real regulatory fine amounts based on actual laws
const regulatoryFines = {
  // GDPR - Higher tier (€20M or 4% of turnover)
  '87aa7301-4529-4a57-ab13-9afbf5f1c467': { // GDPR
    name: 'GDPR',
    maxFineAmount: 20000000, // €20M
    maxFineCurrency: 'EUR',
    description: 'GDPR Higher Tier - €20M or 4% of annual turnover'
  },
  
  // Kenya Data Protection Act - 5M KES or 1% of turnover
  'c113c8f4-fa02-47ac-a71b-aa115060584a': { // Kenya DPA
    name: 'Kenya Data Protection Act',
    maxFineAmount: 5000000, // 5M KES
    maxFineCurrency: 'KES',
    description: 'Kenya DPA - 5M KES or 1% of annual turnover'
  },
  
  // ISO 27001 - No direct fines, but compliance requirements
  'cebe2a09-c939-49de-916d-b5ccc27383e4': { // ISO 27001
    name: 'ISO 27001',
    maxFineAmount: 0, // No direct regulatory fines
    maxFineCurrency: 'EUR',
    description: 'ISO 27001 - No direct fines, but compliance requirements'
  },
  
  // HIPAA - $1.5M per violation per year
  'a8a1e219-1abb-4a58-8eca-e72da27cd65c': { // HIPAA
    name: 'HIPAA',
    maxFineAmount: 1500000, // $1.5M USD
    maxFineCurrency: 'USD',
    description: 'HIPAA - Up to $1.5M per violation per year'
  },
  
  // PCI DSS - $100K to $500K per month
  'ee1f994e-8081-441c-8032-58447dadc9ae': { // PCI DSS
    name: 'PCI DSS',
    maxFineAmount: 500000, // $500K USD
    maxFineCurrency: 'USD',
    description: 'PCI DSS - $100K to $500K per month'
  },
  
  // CCPA - $2,500 per violation, $7,500 per intentional violation
  'd98babbe-5d1f-4bc8-b55c-bf8d4c3d39fc': { // CCPA
    name: 'CCPA',
    maxFineAmount: 7500, // $7,500 USD per intentional violation
    maxFineCurrency: 'USD',
    description: 'CCPA - $2,500 per violation, $7,500 per intentional'
  }
};

async function addRegulatoryFines() {
  try {
    console.log('🚀 Adding regulatory fine amounts to frameworks...');
    
    // Get all frameworks
    const frameworksResult = await pool.query(`
      SELECT id, name, region, country, category
      FROM frameworks
      WHERE is_active = true
    `);
    
    console.log(`📊 Found ${frameworksResult.rows.length} active frameworks`);
    
    let updatedCount = 0;
    
    for (const framework of frameworksResult.rows) {
      // Find matching fine data by framework ID or name
      const fineData = regulatoryFines[framework.id] || 
                      Object.values(regulatoryFines).find(f => f.name === framework.name);
      
      if (fineData) {
        await pool.query(`
          UPDATE frameworks 
          SET max_fine_amount = $1, max_fine_currency = $2
          WHERE id = $3
        `, [fineData.maxFineAmount, fineData.maxFineCurrency, framework.id]);
        
        console.log(`✅ Updated ${framework.name}: ${fineData.maxFineCurrency} ${fineData.maxFineAmount.toLocaleString()}`);
        updatedCount++;
      } else {
        // Set default fine amount based on region/category
        let defaultFine = 0;
        let defaultCurrency = 'EUR';
        
        if (framework.region === 'Europe' || framework.category === 'Privacy') {
          defaultFine = 20000000; // €20M for European privacy laws
          defaultCurrency = 'EUR';
        } else if (framework.region === 'Americas' && framework.country === 'United States') {
          defaultFine = 1000000; // $1M for US laws
          defaultCurrency = 'USD';
        } else if (framework.region === 'Africa') {
          defaultFine = 5000000; // 5M KES for African laws
          defaultCurrency = 'KES';
        }
        
        await pool.query(`
          UPDATE frameworks 
          SET max_fine_amount = $1, max_fine_currency = $2
          WHERE id = $3
        `, [defaultFine, defaultCurrency, framework.id]);
        
        console.log(`⚠️  Set default fine for ${framework.name}: ${defaultCurrency} ${defaultFine.toLocaleString()}`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} frameworks with regulatory fine amounts`);
    
    // Show summary
    const summaryResult = await pool.query(`
      SELECT 
        COUNT(*) as total_frameworks,
        COUNT(max_fine_amount) as frameworks_with_fines,
        SUM(max_fine_amount) as total_exposure,
        AVG(max_fine_amount) as avg_fine,
        MIN(max_fine_amount) as min_fine,
        MAX(max_fine_amount) as max_fine,
        max_fine_currency,
        COUNT(*) as count_by_currency
      FROM frameworks
      WHERE is_active = true
      GROUP BY max_fine_currency
      ORDER BY total_exposure DESC
    `);
    
    console.log('\n📈 Regulatory Fine Summary by Currency:');
    summaryResult.rows.forEach(row => {
      console.log(`   ${row.max_fine_currency}: ${row.count_by_currency} frameworks, Total: ${row.max_fine_currency} ${row.total_exposure?.toLocaleString() || '0'}`);
    });
    
    // Show top frameworks by fine amount
    const topFrameworksResult = await pool.query(`
      SELECT name, max_fine_amount, max_fine_currency, region, country
      FROM frameworks
      WHERE is_active = true AND max_fine_amount > 0
      ORDER BY max_fine_amount DESC
      LIMIT 5
    `);
    
    console.log('\n🏆 Top 5 Frameworks by Fine Amount:');
    topFrameworksResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.name}: ${row.max_fine_currency} ${row.max_fine_amount.toLocaleString()} (${row.region})`);
    });
    
  } catch (error) {
    console.error('❌ Error adding regulatory fines:', error);
  } finally {
    await pool.end();
  }
}

addRegulatoryFines();
