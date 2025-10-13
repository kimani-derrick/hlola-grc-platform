#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps developers set up their local environment
 */

const fs = require('fs');
const path = require('path');

const ENV_FILES = {
  development: 'env.development',
  production: 'env.production',
  staging: 'env.staging',
  example: 'env.example'
};

function createEnvFile(envType) {
  const sourceFile = ENV_FILES[envType];
  const targetFile = '.env.local';
  
  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ Source file ${sourceFile} not found`);
    return false;
  }
  
  if (fs.existsSync(targetFile)) {
    console.log(`⚠️  ${targetFile} already exists. Skipping...`);
    return false;
  }
  
  try {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Created ${targetFile} from ${sourceFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${targetFile}:`, error.message);
    return false;
  }
}

function validateEnvironment() {
  const requiredVars = [
    'NEXT_PUBLIC_API_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];
  
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🔧 Environment Setup Script\n');
  
  switch (command) {
    case 'dev':
    case 'development':
      createEnvFile('development');
      break;
      
    case 'prod':
    case 'production':
      createEnvFile('production');
      break;
      
    case 'staging':
      createEnvFile('staging');
      break;
      
    case 'validate':
      validateEnvironment();
      break;
      
    case 'help':
    default:
      console.log('Usage: node scripts/setup-env.js <command>');
      console.log('');
      console.log('Commands:');
      console.log('  dev, development  - Create .env.local from env.development');
      console.log('  prod, production  - Create .env.local from env.production');
      console.log('  staging          - Create .env.local from env.staging');
      console.log('  validate         - Validate current environment variables');
      console.log('  help             - Show this help message');
      console.log('');
      console.log('Examples:');
      console.log('  node scripts/setup-env.js dev');
      console.log('  node scripts/setup-env.js validate');
      break;
  }
}

main();
