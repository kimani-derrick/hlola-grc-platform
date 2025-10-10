const multer = require('multer');
const path = require('path');
const mime = require('mime-types');
const logger = require('../config/logger');

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  try {
    // Get allowed file types from environment or use default
    const allowedTypes = process.env.ALLOWED_FILE_TYPES 
      ? process.env.ALLOWED_FILE_TYPES.split(',')
      : ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'txt', 'csv', 'zip', 'rar'];

    // Get file extension
    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    
    // Check if file type is allowed
    if (allowedTypes.includes(ext)) {
      logger.info('File upload accepted', {
        originalName: file.originalname,
        mimeType: file.mimetype,
        extension: ext,
        size: file.size
      });
      cb(null, true);
    } else {
      logger.warn('File upload rejected - unsupported file type', {
        originalName: file.originalname,
        mimeType: file.mimetype,
        extension: ext,
        allowedTypes: allowedTypes
      });
      cb(new Error(`File type .${ext} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  } catch (error) {
    logger.error('Error in file filter', {
      originalName: file.originalname,
      error: error.message
    });
    cb(error, false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB default
    files: 1 // Only allow one file per upload
  },
  fileFilter: fileFilter
});

// Middleware to handle single file upload
const uploadSingle = (fieldName = 'file') => {
  return (req, res, next) => {
    const uploadHandler = upload.single(fieldName);
    
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        logger.error('Multer error during file upload', {
          error: err.message,
          code: err.code,
          field: err.field
        });
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File too large',
            message: `File size exceeds the maximum limit of ${process.env.MAX_FILE_SIZE || 50 * 1024 * 1024} bytes`
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            error: 'Too many files',
            message: 'Only one file is allowed per upload'
          });
        }
        
        return res.status(400).json({
          success: false,
          error: 'Upload error',
          message: err.message
        });
      } else if (err) {
        logger.error('Error during file upload', {
          error: err.message,
          originalName: req.file?.originalname
        });
        
        return res.status(400).json({
          success: false,
          error: 'File upload failed',
          message: err.message
        });
      }
      
      // Validate file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
          message: `No file found in field '${fieldName}'`
        });
      }
      
      // Add file metadata to request
      req.fileMetadata = {
        originalName: req.file.originalname,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        fileExtension: path.extname(req.file.originalname).toLowerCase(),
        buffer: req.file.buffer
      };
      
      logger.info('File upload processed successfully', {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        fieldName: fieldName
      });
      
      next();
    });
  };
};

// Middleware to handle multiple file uploads
const uploadMultiple = (fieldName = 'files', maxCount = 5) => {
  return (req, res, next) => {
    const uploadHandler = upload.array(fieldName, maxCount);
    
    uploadHandler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        logger.error('Multer error during multiple file upload', {
          error: err.message,
          code: err.code,
          field: err.field
        });
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: 'File too large',
            message: `File size exceeds the maximum limit of ${process.env.MAX_FILE_SIZE || 50 * 1024 * 1024} bytes`
          });
        }
        
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            error: 'Too many files',
            message: `Maximum ${maxCount} files allowed per upload`
          });
        }
        
        return res.status(400).json({
          success: false,
          error: 'Upload error',
          message: err.message
        });
      } else if (err) {
        logger.error('Error during multiple file upload', {
          error: err.message,
          fileCount: req.files?.length || 0
        });
        
        return res.status(400).json({
          success: false,
          error: 'File upload failed',
          message: err.message
        });
      }
      
      // Validate files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded',
          message: `No files found in field '${fieldName}'`
        });
      }
      
      // Add file metadata to request
      req.filesMetadata = req.files.map(file => ({
        originalName: file.originalname,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileExtension: path.extname(file.originalname).toLowerCase(),
        buffer: file.buffer
      }));
      
      logger.info('Multiple files upload processed successfully', {
        fileCount: req.files.length,
        fieldName: fieldName,
        totalSize: req.files.reduce((sum, file) => sum + file.size, 0)
      });
      
      next();
    });
  };
};

// Middleware to validate file metadata
const validateFileMetadata = (req, res, next) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
        message: 'No file found in request'
      });
    }
    
    // Validate file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: `File size ${file.size} bytes exceeds maximum limit of ${maxSize} bytes`
      });
    }
    
    // Validate MIME type matches extension
    const expectedMimeType = mime.lookup(file.originalname);
    if (expectedMimeType && expectedMimeType !== file.mimetype) {
      logger.warn('MIME type mismatch detected', {
        fileName: file.originalname,
        expectedMimeType: expectedMimeType,
        actualMimeType: file.mimetype
      });
    }
    
    // Add additional validation metadata
    req.fileValidation = {
      isValid: true,
      size: file.size,
      mimeType: file.mimetype,
      extension: path.extname(file.originalname).toLowerCase(),
      originalName: file.originalname
    };
    
    next();
  } catch (error) {
    logger.error('Error validating file metadata', {
      error: error.message,
      fileName: req.file?.originalname
    });
    
    return res.status(500).json({
      success: false,
      error: 'File validation failed',
      message: 'An error occurred while validating the file'
    });
  }
};

// Middleware to clean up uploaded files (for error handling)
const cleanupUploads = (req, res, next) => {
  // This middleware can be used to clean up any temporary files
  // In our case, since we're using memory storage, we don't need to clean up
  // But this provides a hook for future file system storage implementations
  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  validateFileMetadata,
  cleanupUploads,
  upload
};
