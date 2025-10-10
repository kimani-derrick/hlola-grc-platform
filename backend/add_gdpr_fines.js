const { pool } = require('./src/config/database');

// Real GDPR fine amounts based on actual GDPR penalties
const gdprFines = {
  // Article 5 - Data Processing Principles (€20M or 4% of annual turnover)
  'a19602a3-23af-4a2d-8acb-a11bbf6e96c2': {
    title: 'Right to Access',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for violations of data subject rights'
  },
  
  // Article 6 - Lawfulness of Processing (€20M or 4% of annual turnover)
  'abbf58f0-21d3-495e-97ac-f5bdbbe2719c': {
    title: 'Right to Access',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for unlawful processing'
  },
  
  // Article 7 - Consent (€20M or 4% of annual turnover)
  'c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6': {
    title: 'Consent Management',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for consent violations'
  },
  
  // Article 8 - Child Consent (€20M or 4% of annual turnover)
  'd2e3f4g5-h6i7-j8k9-l0m1-n2o3p4q5r6s7': {
    title: 'Child Data Protection',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for child data violations'
  },
  
  // Article 9 - Special Categories (€20M or 4% of annual turnover)
  'e3f4g5h6-i7j8-k9l0-m1n2-o3p4q5r6s7t8': {
    title: 'Special Category Data',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for special category data violations'
  },
  
  // Article 10 - Criminal Data (€20M or 4% of annual turnover)
  'f4g5h6i7-j8k9-l0m1-n2o3-p4q5r6s7t8u9': {
    title: 'Criminal Data Processing',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for criminal data violations'
  },
  
  // Article 12 - Transparent Information (€20M or 4% of annual turnover)
  'g5h6i7j8-k9l0-m1n2-o3p4-q5r6s7t8u9v0': {
    title: 'Transparent Information',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for transparency violations'
  },
  
  // Article 13 - Information for Data Collection (€20M or 4% of annual turnover)
  'h6i7j8k9-l0m1-n2o3-p4q5-r6s7t8u9v0w1': {
    title: 'Data Collection Information',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for information provision violations'
  },
  
  // Article 14 - Information for Indirect Collection (€20M or 4% of annual turnover)
  'i7j8k9l0-m1n2-o3p4-q5r6-s7t8u9v0w1x2': {
    title: 'Indirect Data Collection',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for indirect collection violations'
  },
  
  // Article 15 - Right of Access (€20M or 4% of annual turnover)
  'j8k9l0m1-n2o3-p4q5-r6s7-t8u9v0w1x2y3': {
    title: 'Right of Access',
    fineAmount: 20000000, // €20M
    fineCurrency: 'EUR',
    description: 'Maximum fine for access right violations'
  }
};

async function addGdprFines() {
  try {
    console.log('🚀 Adding GDPR fine amounts to controls...');
    
    // Get all GDPR controls
    const gdprResult = await pool.query(`
      SELECT c.id, c.title, c.control_id
      FROM controls c
      JOIN frameworks f ON c.framework_id = f.id
      WHERE f.name = 'GDPR'
    `);
    
    console.log(`📊 Found ${gdprResult.rows.length} GDPR controls`);
    
    let updatedCount = 0;
    
    for (const control of gdprResult.rows) {
      // Find matching fine data by control_id or title
      const fineData = gdprFines[control.control_id] || 
                      Object.values(gdprFines).find(f => f.title === control.title);
      
      if (fineData) {
        await pool.query(`
          UPDATE controls 
          SET fine_amount = $1, fine_currency = $2
          WHERE id = $3
        `, [fineData.fineAmount, fineData.fineCurrency, control.id]);
        
        console.log(`✅ Updated ${control.title}: €${fineData.fineAmount.toLocaleString()}`);
        updatedCount++;
      } else {
        // Set default fine amount for GDPR controls
        await pool.query(`
          UPDATE controls 
          SET fine_amount = $1, fine_currency = $2
          WHERE id = $3
        `, [10000000, 'EUR', control.id]); // €10M default
        
        console.log(`⚠️  Set default fine for ${control.title}: €10,000,000`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} GDPR controls with fine amounts`);
    
    // Show summary
    const summaryResult = await pool.query(`
      SELECT 
        COUNT(*) as total_controls,
        COUNT(fine_amount) as controls_with_fines,
        SUM(fine_amount) as total_exposure,
        AVG(fine_amount) as avg_fine,
        MIN(fine_amount) as min_fine,
        MAX(fine_amount) as max_fine
      FROM controls c
      JOIN frameworks f ON c.framework_id = f.id
      WHERE f.name = 'GDPR'
    `);
    
    const summary = summaryResult.rows[0];
    console.log('\n📈 GDPR Fine Summary:');
    console.log(`   Total Controls: ${summary.total_controls}`);
    console.log(`   Controls with Fines: ${summary.controls_with_fines}`);
    console.log(`   Total Exposure: €${summary.total_exposure?.toLocaleString() || '0'}`);
    console.log(`   Average Fine: €${summary.avg_fine?.toLocaleString() || '0'}`);
    console.log(`   Min Fine: €${summary.min_fine?.toLocaleString() || '0'}`);
    console.log(`   Max Fine: €${summary.max_fine?.toLocaleString() || '0'}`);
    
  } catch (error) {
    console.error('❌ Error adding GDPR fines:', error);
  } finally {
    await pool.end();
  }
}

addGdprFines();
