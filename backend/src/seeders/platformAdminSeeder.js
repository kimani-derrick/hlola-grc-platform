const { pool } = require('../config/database');
const PlatformAdmin = require('../models/PlatformAdmin');

async function seedPlatformAdmin() {
  try {
    console.log('🌱 Starting platform admin seeder...');

    // Check if any platform admins already exist
    const existingAdmins = await pool.query('SELECT COUNT(*) FROM platform_admins');
    const adminCount = parseInt(existingAdmins.rows[0].count);

    if (adminCount > 0) {
      console.log(`✅ Platform admins already exist (${adminCount} found). Skipping seeder.`);
      return;
    }

    // Create initial platform admin
    const adminData = {
      email: 'admin@platform.com',
      first_name: 'Platform',
      last_name: 'Administrator',
      password: 'Admin@123' // This should be changed on first login
    };

    const admin = await PlatformAdmin.create(adminData);
    
    console.log('✅ Platform admin created successfully:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.first_name} ${admin.last_name}`);
    console.log(`   ID: ${admin.id}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the default password on first login!');
    console.log('   Default credentials: admin@platform.com / Admin@123');

  } catch (error) {
    console.error('❌ Error seeding platform admin:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedPlatformAdmin()
    .then(() => {
      console.log('🎉 Platform admin seeder completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Platform admin seeder failed:', error);
      process.exit(1);
    });
}

module.exports = seedPlatformAdmin;
