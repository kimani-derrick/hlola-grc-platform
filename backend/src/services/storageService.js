const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { BlobServiceClient } = require('@azure/storage-blob');
const { Storage } = require('@google-cloud/storage');
const logger = require('../config/logger');

class LocalStorageProvider {
  constructor() {
    this.basePath = process.env.LOCAL_UPLOAD_PATH || './uploads';
  }

  async upload(file, filePath, metadata = {}) {
    try {
      const fullPath = path.join(this.basePath, filePath);
      const dir = path.dirname(fullPath);
      
      // Create directory if it doesn't exist
      await fs.promises.mkdir(dir, { recursive: true });
      
      // Write file
      await fs.promises.writeFile(fullPath, file.buffer);
      
      logger.info('File uploaded to local storage', {
        filePath: filePath,
        size: file.buffer.length
      });
      
      return {
        path: filePath,
        url: `/uploads/${filePath}`,
        size: file.buffer.length
      };
    } catch (error) {
      logger.error('Error uploading file to local storage', {
        filePath: filePath,
        error: error.message
      });
      throw error;
    }
  }

  async download(filePath) {
    try {
      const fullPath = path.join(this.basePath, filePath);
      return fs.createReadStream(fullPath);
    } catch (error) {
      logger.error('Error downloading file from local storage', {
        filePath: filePath,
        error: error.message
      });
      throw error;
    }
  }

  async delete(filePath) {
    try {
      const fullPath = path.join(this.basePath, filePath);
      await fs.promises.unlink(fullPath);
      
      logger.info('File deleted from local storage', {
        filePath: filePath
      });
      
      return true;
    } catch (error) {
      logger.error('Error deleting file from local storage', {
        filePath: filePath,
        error: error.message
      });
      throw error;
    }
  }

  async getSignedUrl(filePath, expiresIn = 3600) {
    // For local storage, return a direct URL (in production, you might want to use a different approach)
    return `/uploads/${filePath}`;
  }

  async list(prefix = '') {
    try {
      const fullPath = path.join(this.basePath, prefix);
      const files = [];
      
      const readDir = async (dir, relativePath = '') => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullEntryPath = path.join(dir, entry.name);
          const relativeEntryPath = path.join(relativePath, entry.name);
          
          if (entry.isDirectory()) {
            await readDir(fullEntryPath, relativeEntryPath);
          } else {
            const stats = await fs.promises.stat(fullEntryPath);
            files.push({
              name: entry.name,
              path: relativeEntryPath,
              size: stats.size,
              lastModified: stats.mtime
            });
          }
        }
      };
      
      await readDir(fullPath, prefix);
      return files;
    } catch (error) {
      logger.error('Error listing files from local storage', {
        prefix: prefix,
        error: error.message
      });
      throw error;
    }
  }

  async move(oldPath, newPath) {
    try {
      const oldFullPath = path.join(this.basePath, oldPath);
      const newFullPath = path.join(this.basePath, newPath);
      const newDir = path.dirname(newFullPath);
      
      // Create new directory if it doesn't exist
      await fs.promises.mkdir(newDir, { recursive: true });
      
      // Move file
      await fs.promises.rename(oldFullPath, newFullPath);
      
      logger.info('File moved in local storage', {
        oldPath: oldPath,
        newPath: newPath
      });
      
      return true;
    } catch (error) {
      logger.error('Error moving file in local storage', {
        oldPath: oldPath,
        newPath: newPath,
        error: error.message
      });
      throw error;
    }
  }
}

class S3StorageProvider {
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    this.bucket = process.env.AWS_S3_BUCKET;
  }

  async upload(file, filePath, metadata = {}) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalName: file.originalname,
          ...metadata
        }
      });

      await this.client.send(command);
      
      logger.info('File uploaded to S3', {
        filePath: filePath,
        bucket: this.bucket,
        size: file.buffer.length
      });
      
      return {
        path: filePath,
        url: `s3://${this.bucket}/${filePath}`,
        size: file.buffer.length
      };
    } catch (error) {
      logger.error('Error uploading file to S3', {
        filePath: filePath,
        bucket: this.bucket,
        error: error.message
      });
      throw error;
    }
  }

  async download(filePath) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: filePath
      });
      
      const response = await this.client.send(command);
      return response.Body;
    } catch (error) {
      logger.error('Error downloading file from S3', {
        filePath: filePath,
        bucket: this.bucket,
        error: error.message
      });
      throw error;
    }
  }

  async delete(filePath) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: filePath
      });
      
      await this.client.send(command);
      
      logger.info('File deleted from S3', {
        filePath: filePath,
        bucket: this.bucket
      });
      
      return true;
    } catch (error) {
      logger.error('Error deleting file from S3', {
        filePath: filePath,
        bucket: this.bucket,
        error: error.message
      });
      throw error;
    }
  }

  async getSignedUrl(filePath, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: filePath
      });
      
      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      logger.error('Error generating signed URL for S3', {
        filePath: filePath,
        bucket: this.bucket,
        error: error.message
      });
      throw error;
    }
  }

  async list(prefix = '') {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix
      });
      
      const response = await this.client.send(command);
      
      return (response.Contents || []).map(item => ({
        name: path.basename(item.Key),
        path: item.Key,
        size: item.Size,
        lastModified: item.LastModified
      }));
    } catch (error) {
      logger.error('Error listing files from S3', {
        prefix: prefix,
        bucket: this.bucket,
        error: error.message
      });
      throw error;
    }
  }

  async move(oldPath, newPath) {
    try {
      // Copy to new location
      const copyCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: newPath,
        CopySource: `${this.bucket}/${oldPath}`
      });
      
      await this.client.send(copyCommand);
      
      // Delete old file
      await this.delete(oldPath);
      
      logger.info('File moved in S3', {
        oldPath: oldPath,
        newPath: newPath,
        bucket: this.bucket
      });
      
      return true;
    } catch (error) {
      logger.error('Error moving file in S3', {
        oldPath: oldPath,
        newPath: newPath,
        bucket: this.bucket,
        error: error.message
      });
      throw error;
    }
  }
}

class AzureStorageProvider {
  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    this.containerName = process.env.AZURE_STORAGE_CONTAINER;
  }

  async upload(file, filePath, metadata = {}) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(filePath);
      
      await blockBlobClient.upload(file.buffer, file.buffer.length, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype
        },
        metadata: {
          originalName: file.originalname,
          ...metadata
        }
      });
      
      logger.info('File uploaded to Azure Blob Storage', {
        filePath: filePath,
        container: this.containerName,
        size: file.buffer.length
      });
      
      return {
        path: filePath,
        url: blockBlobClient.url,
        size: file.buffer.length
      };
    } catch (error) {
      logger.error('Error uploading file to Azure Blob Storage', {
        filePath: filePath,
        container: this.containerName,
        error: error.message
      });
      throw error;
    }
  }

  async download(filePath) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(filePath);
      
      const downloadResponse = await blockBlobClient.download();
      return downloadResponse.readableStreamBody;
    } catch (error) {
      logger.error('Error downloading file from Azure Blob Storage', {
        filePath: filePath,
        container: this.containerName,
        error: error.message
      });
      throw error;
    }
  }

  async delete(filePath) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(filePath);
      
      await blockBlobClient.delete();
      
      logger.info('File deleted from Azure Blob Storage', {
        filePath: filePath,
        container: this.containerName
      });
      
      return true;
    } catch (error) {
      logger.error('Error deleting file from Azure Blob Storage', {
        filePath: filePath,
        container: this.containerName,
        error: error.message
      });
      throw error;
    }
  }

  async getSignedUrl(filePath, expiresIn = 3600) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(filePath);
      
      const url = await blockBlobClient.generateSasUrl({
        permissions: 'r',
        expiresOn: new Date(Date.now() + expiresIn * 1000)
      });
      
      return url;
    } catch (error) {
      logger.error('Error generating signed URL for Azure Blob Storage', {
        filePath: filePath,
        container: this.containerName,
        error: error.message
      });
      throw error;
    }
  }

  async list(prefix = '') {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobs = containerClient.listBlobsFlat({ prefix });
      
      const files = [];
      for await (const blob of blobs) {
        files.push({
          name: path.basename(blob.name),
          path: blob.name,
          size: blob.properties.contentLength,
          lastModified: blob.properties.lastModified
        });
      }
      
      return files;
    } catch (error) {
      logger.error('Error listing files from Azure Blob Storage', {
        prefix: prefix,
        container: this.containerName,
        error: error.message
      });
      throw error;
    }
  }

  async move(oldPath, newPath) {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const sourceBlob = containerClient.getBlockBlobClient(oldPath);
      const destBlob = containerClient.getBlockBlobClient(newPath);
      
      // Copy blob
      await destBlob.syncCopyFromURL(sourceBlob.url);
      
      // Delete source blob
      await sourceBlob.delete();
      
      logger.info('File moved in Azure Blob Storage', {
        oldPath: oldPath,
        newPath: newPath,
        container: this.containerName
      });
      
      return true;
    } catch (error) {
      logger.error('Error moving file in Azure Blob Storage', {
        oldPath: oldPath,
        newPath: newPath,
        container: this.containerName,
        error: error.message
      });
      throw error;
    }
  }
}

class GCSStorageProvider {
  constructor() {
    this.storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      keyFilename: process.env.GCS_KEY_FILE
    });
    this.bucketName = process.env.GCS_BUCKET_NAME;
    this.bucket = this.storage.bucket(this.bucketName);
  }

  async upload(file, filePath, metadata = {}) {
    try {
      const fileObj = this.bucket.file(filePath);
      
      await fileObj.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            ...metadata
          }
        }
      });
      
      logger.info('File uploaded to Google Cloud Storage', {
        filePath: filePath,
        bucket: this.bucketName,
        size: file.buffer.length
      });
      
      return {
        path: filePath,
        url: `gs://${this.bucketName}/${filePath}`,
        size: file.buffer.length
      };
    } catch (error) {
      logger.error('Error uploading file to Google Cloud Storage', {
        filePath: filePath,
        bucket: this.bucketName,
        error: error.message
      });
      throw error;
    }
  }

  async download(filePath) {
    try {
      const fileObj = this.bucket.file(filePath);
      return fileObj.createReadStream();
    } catch (error) {
      logger.error('Error downloading file from Google Cloud Storage', {
        filePath: filePath,
        bucket: this.bucketName,
        error: error.message
      });
      throw error;
    }
  }

  async delete(filePath) {
    try {
      const fileObj = this.bucket.file(filePath);
      await fileObj.delete();
      
      logger.info('File deleted from Google Cloud Storage', {
        filePath: filePath,
        bucket: this.bucketName
      });
      
      return true;
    } catch (error) {
      logger.error('Error deleting file from Google Cloud Storage', {
        filePath: filePath,
        bucket: this.bucketName,
        error: error.message
      });
      throw error;
    }
  }

  async getSignedUrl(filePath, expiresIn = 3600) {
    try {
      const fileObj = this.bucket.file(filePath);
      const [url] = await fileObj.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresIn * 1000
      });
      
      return url;
    } catch (error) {
      logger.error('Error generating signed URL for Google Cloud Storage', {
        filePath: filePath,
        bucket: this.bucketName,
        error: error.message
      });
      throw error;
    }
  }

  async list(prefix = '') {
    try {
      const [files] = await this.bucket.getFiles({ prefix });
      
      return files.map(file => ({
        name: path.basename(file.name),
        path: file.name,
        size: file.metadata.size,
        lastModified: new Date(file.metadata.timeCreated)
      }));
    } catch (error) {
      logger.error('Error listing files from Google Cloud Storage', {
        prefix: prefix,
        bucket: this.bucketName,
        error: error.message
      });
      throw error;
    }
  }

  async move(oldPath, newPath) {
    try {
      const sourceFile = this.bucket.file(oldPath);
      const destFile = this.bucket.file(newPath);
      
      // Copy file
      await sourceFile.copy(destFile);
      
      // Delete source file
      await sourceFile.delete();
      
      logger.info('File moved in Google Cloud Storage', {
        oldPath: oldPath,
        newPath: newPath,
        bucket: this.bucketName
      });
      
      return true;
    } catch (error) {
      logger.error('Error moving file in Google Cloud Storage', {
        oldPath: oldPath,
        newPath: newPath,
        bucket: this.bucketName,
        error: error.message
      });
      throw error;
    }
  }
}

class StorageService {
  constructor() {
    this.provider = process.env.STORAGE_PROVIDER || 'local';
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.provider) {
      case 's3':
        this.storageProvider = new S3StorageProvider();
        break;
      case 'azure':
        this.storageProvider = new AzureStorageProvider();
        break;
      case 'gcs':
        this.storageProvider = new GCSStorageProvider();
        break;
      case 'local':
      default:
        this.storageProvider = new LocalStorageProvider();
        break;
    }
    
    logger.info('Storage service initialized', {
      provider: this.provider
    });
  }

  async upload(file, filePath, metadata = {}) {
    return await this.storageProvider.upload(file, filePath, metadata);
  }

  async download(filePath) {
    return await this.storageProvider.download(filePath);
  }

  async delete(filePath) {
    return await this.storageProvider.delete(filePath);
  }

  async getSignedUrl(filePath, expiresIn = 3600) {
    return await this.storageProvider.getSignedUrl(filePath, expiresIn);
  }

  async list(prefix = '') {
    return await this.storageProvider.list(prefix);
  }

  async move(oldPath, newPath) {
    return await this.storageProvider.move(oldPath, newPath);
  }

  generateFilePath(organizationId, entityId, documentType, fileName) {
    const timestamp = Date.now();
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    const uniqueFileName = `${baseName}_${timestamp}${extension}`;
    
    return `${organizationId}/${entityId}/${documentType}/${uniqueFileName}`;
  }
}

module.exports = new StorageService();
