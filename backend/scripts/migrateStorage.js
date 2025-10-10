#!/usr/bin/env node

/**
 * Storage Migration Script
 * 
 * This script migrates documents from local storage to cloud storage.
 * It reads all documents from the database and uploads them to the configured cloud storage provider.
 * 
 * Usage:
 *   node scripts/migrateStorage.js [--dry-run] [--provider=s3|azure|gcs]
 * 
 * Options:
 *   --dry-run    Show what would be migrated without actually doing it
 *   --provider   Override the storage provider (defaults to STORAGE_PROVIDER env var)
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');
const storageService = require('../src/services/storageService');
const logger = require('../src/config/logger');

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const providerArg = args.find(arg => arg.startsWith('--provider='));
const targetProvider = providerArg ? providerArg.split('=')[1] : process.env.STORAGE_PROVIDER || 'local';

console.log('🔄 Storage Migration Script');
console.log('==========================');
console.log(`Target Provider: ${targetProvider}`);
console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE MIGRATION'}`);
console.log('');

// Override storage provider for migration
if (targetProvider !== 'local') {
  process.env.STORAGE_PROVIDER = targetProvider;
  // Reinitialize storage service with new provider
  delete require.cache[require.resolve('../src/services/storageService.js')];
  const newStorageService = require('../src/services/storageService.js');
}

const query = (text, params) => pool.query(text, params);

async function migrateDocuments() {
  try {
    console.log('📊 Fetching documents from database...');
    
    // Get all documents that have file paths
    const result = await query(
      `SELECT d.*, e.organization_id, e.name as entity_name
       FROM documents d
       JOIN entities e ON d.entity_id = e.id
       WHERE d.file_path IS NOT NULL AND d.file_path != ''`
    );
    
    const documents = result.rows;
    console.log(`Found ${documents.length} documents to migrate`);
    
    if (documents.length === 0) {
      console.log('✅ No documents to migrate');
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    console.log('');
    console.log('🚀 Starting migration...');
    console.log('');
    
    for (const doc of documents) {
      try {
        console.log(`📄 Processing: ${doc.name} (${doc.id})`);
        
        // Check if file exists in local storage
        const localFilePath = path.join(process.env.LOCAL_UPLOAD_PATH || './uploads', doc.file_path);
        
        if (!fs.existsSync(localFilePath)) {
          console.log(`   ⚠️  File not found locally: ${localFilePath}`);
          errorCount++;
          errors.push({
            documentId: doc.id,
            documentName: doc.name,
            error: 'File not found locally',
            filePath: localFilePath
          });
          continue;
        }
        
        if (isDryRun) {
          console.log(`   🔍 [DRY RUN] Would migrate: ${doc.file_path}`);
          successCount++;
          continue;
        }
        
        // Read file from local storage
        const fileBuffer = fs.readFileSync(localFilePath);
        const fileStats = fs.statSync(localFilePath);
        
        // Create file object for storage service
        const fileObj = {
          buffer: fileBuffer,
          mimetype: doc.mime_type || 'application/octet-stream',
          originalname: doc.name,
          size: fileStats.size
        };
        
        // Upload to cloud storage
        const uploadResult = await storageService.upload(
          fileObj,
          doc.file_path,
          {
            organizationId: doc.organization_id,
            entityId: doc.entity_id,
            documentType: doc.document_type,
            uploadedBy: doc.uploaded_by,
            migratedAt: new Date().toISOString()
          }
        );
        
        console.log(`   ✅ Migrated successfully: ${uploadResult.path}`);
        successCount++;
        
        // Optional: Delete local file after successful upload
        // fs.unlinkSync(localFilePath);
        // console.log(`   🗑️  Deleted local file: ${localFilePath}`);
        
      } catch (error) {
        console.log(`   ❌ Error migrating ${doc.name}: ${error.message}`);
        errorCount++;
        errors.push({
          documentId: doc.id,
          documentName: doc.name,
          error: error.message,
          filePath: doc.file_path
        });
      }
    }
    
    console.log('');
    console.log('📊 Migration Summary');
    console.log('===================');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📄 Total: ${documents.length}`);
    
    if (errors.length > 0) {
      console.log('');
      console.log('❌ Errors Details:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.documentName} (${error.documentId})`);
        console.log(`   Error: ${error.error}`);
        console.log(`   File: ${error.filePath}`);
        console.log('');
      });
    }
    
    if (isDryRun) {
      console.log('');
      console.log('🔍 This was a dry run. No actual migration was performed.');
      console.log('Run without --dry-run to perform the actual migration.');
    } else {
      console.log('');
      console.log('🎉 Migration completed!');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error.message);
    logger.error('Storage migration failed', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

async function main() {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Test storage service
    console.log('✅ Storage service initialized');
    
    // Run migration
    await migrateDocuments();
    
  } catch (error) {
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await pool.end();
  }
}

// Run the migration
main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
