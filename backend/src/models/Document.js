const { pool } = require('../config/database');
const logger = require('../config/logger');

const query = (text, params) => pool.query(text, params);

class Document {
  static async create({
    entityId,
    frameworkId,
    controlId,
    taskId,
    title,
    description,
    documentType,
    filePath,
    fileSize,
    mimeType,
    uploadedBy,
    isEvidence = false
  }) {
    try {
      const result = await query(
        `INSERT INTO documents (
          entity_id, framework_id, control_id, task_id, name, description,
          document_type, file_path, file_size, mime_type, uploaded_by, is_evidence
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
          entityId, frameworkId, controlId, taskId, title, description,
          documentType, filePath, fileSize, mimeType, uploadedBy, isEvidence
        ]
      );

      logger.info('Document created', {
        documentId: result.rows[0].id,
        title: title,
        documentType: documentType,
        entityId: entityId
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating document', {
        error: error.message,
        entityId: entityId,
        title: title
      });
      throw error;
    }
  }

  static async findById(id, organizationId) {
    try {
      const result = await query(
        `SELECT d.*,
                e.name as entity_name,
                f.name as framework_name,
                c.title as control_title,
                t.title as task_title,
                u.first_name as uploader_first_name,
                u.last_name as uploader_last_name,
                u.email as uploader_email
         FROM documents d
         JOIN entities e ON d.entity_id = e.id
         LEFT JOIN frameworks f ON d.framework_id = f.id
         LEFT JOIN controls c ON d.control_id = c.id
         LEFT JOIN tasks t ON d.task_id = t.id
         LEFT JOIN users u ON d.uploaded_by = u.id
         WHERE d.id = $1 AND e.organization_id = $2`,
        [id, organizationId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error finding document by ID', {
        documentId: id,
        organizationId: organizationId,
        error: error.message
      });
      throw error;
    }
  }

  static async findByEntity(entityId, organizationId, filters = {}) {
    try {
      let queryText = `
        SELECT d.*,
               f.name as framework_name,
               c.title as control_title,
               t.title as task_title,
               u.first_name as uploader_first_name,
               u.last_name as uploader_last_name
        FROM documents d
        JOIN entities e ON d.entity_id = e.id
        LEFT JOIN frameworks f ON d.framework_id = f.id
        LEFT JOIN controls c ON d.control_id = c.id
        LEFT JOIN tasks t ON d.task_id = t.id
        LEFT JOIN users u ON d.uploaded_by = u.id
        WHERE d.entity_id = $1 AND e.organization_id = $2
      `;
      
      const params = [entityId, organizationId];
      let paramCount = 3;

      if (filters.documentType) {
        queryText += ` AND d.document_type = $${paramCount}`;
        params.push(filters.documentType);
        paramCount++;
      }

      if (filters.status) {
        queryText += ` AND d.status = $${paramCount}`;
        params.push(filters.status);
        paramCount++;
      }

      if (filters.search) {
        queryText += ` AND (d.name ILIKE $${paramCount} OR d.description ILIKE $${paramCount})`;
        params.push(`%${filters.search}%`);
        paramCount++;
      }

      queryText += ` ORDER BY d.created_at DESC`;

      if (filters.limit) {
        queryText += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
        paramCount++;
      }

      if (filters.offset) {
        queryText += ` OFFSET $${paramCount}`;
        params.push(filters.offset);
        paramCount++;
      }

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      logger.error('Error finding documents by entity', {
        entityId: entityId,
        organizationId: organizationId,
        error: error.message
      });
      throw error;
    }
  }

  static async findByControl(controlId, organizationId, filters = {}) {
    try {
      let queryText = `
        SELECT d.*,
               e.name as entity_name,
               f.name as framework_name,
               t.title as task_title,
               u.first_name as uploader_first_name,
               u.last_name as uploader_last_name
        FROM documents d
        JOIN entities e ON d.entity_id = e.id
        LEFT JOIN frameworks f ON d.framework_id = f.id
        LEFT JOIN tasks t ON d.task_id = t.id
        LEFT JOIN users u ON d.uploaded_by = u.id
        WHERE d.control_id = $1 AND e.organization_id = $2
      `;
      
      const params = [controlId, organizationId];
      let paramCount = 3;

      if (filters.documentType) {
        queryText += ` AND d.document_type = $${paramCount}`;
        params.push(filters.documentType);
        paramCount++;
      }

      queryText += ` ORDER BY d.created_at DESC`;

      if (filters.limit) {
        queryText += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
        paramCount++;
      }

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      logger.error('Error finding documents by control', {
        controlId: controlId,
        organizationId: organizationId,
        error: error.message
      });
      throw error;
    }
  }

  static async findByTask(taskId, organizationId, filters = {}) {
    try {
      let queryText = `
        SELECT d.*,
               e.name as entity_name,
               f.name as framework_name,
               c.title as control_title,
               u.first_name as uploader_first_name,
               u.last_name as uploader_last_name
        FROM documents d
        JOIN entities e ON d.entity_id = e.id
        LEFT JOIN frameworks f ON d.framework_id = f.id
        LEFT JOIN controls c ON d.control_id = c.id
        LEFT JOIN users u ON d.uploaded_by = u.id
        WHERE d.task_id = $1 AND e.organization_id = $2
      `;
      
      const params = [taskId, organizationId];
      let paramCount = 3;

      if (filters.documentType) {
        queryText += ` AND d.document_type = $${paramCount}`;
        params.push(filters.documentType);
        paramCount++;
      }

      queryText += ` ORDER BY d.created_at DESC`;

      if (filters.limit) {
        queryText += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
        paramCount++;
      }

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      logger.error('Error finding documents by task', {
        taskId: taskId,
        organizationId: organizationId,
        error: error.message
      });
      throw error;
    }
  }

  static async findByFramework(frameworkId, organizationId, filters = {}) {
    try {
      let queryText = `
        SELECT d.*,
               e.name as entity_name,
               c.title as control_title,
               t.title as task_title,
               u.first_name as uploader_first_name,
               u.last_name as uploader_last_name
        FROM documents d
        JOIN entities e ON d.entity_id = e.id
        LEFT JOIN controls c ON d.control_id = c.id
        LEFT JOIN tasks t ON d.task_id = t.id
        LEFT JOIN users u ON d.uploaded_by = u.id
        WHERE d.framework_id = $1 AND e.organization_id = $2
      `;
      
      const params = [frameworkId, organizationId];
      let paramCount = 3;

      if (filters.documentType) {
        queryText += ` AND d.document_type = $${paramCount}`;
        params.push(filters.documentType);
        paramCount++;
      }

      queryText += ` ORDER BY d.created_at DESC`;

      if (filters.limit) {
        queryText += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
        paramCount++;
      }

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      logger.error('Error finding documents by framework', {
        frameworkId: frameworkId,
        organizationId: organizationId,
        error: error.message
      });
      throw error;
    }
  }

  static async findAll(organizationId, filters = {}) {
    try {
      let queryText = `
        SELECT d.*,
               e.name as entity_name,
               f.name as framework_name,
               c.title as control_title,
               t.title as task_title,
               u.first_name as uploader_first_name,
               u.last_name as uploader_last_name
        FROM documents d
        JOIN entities e ON d.entity_id = e.id
        LEFT JOIN frameworks f ON d.framework_id = f.id
        LEFT JOIN controls c ON d.control_id = c.id
        LEFT JOIN tasks t ON d.task_id = t.id
        LEFT JOIN users u ON d.uploaded_by = u.id
        WHERE e.organization_id = $1
      `;
      
      const params = [organizationId];
      let paramCount = 2;

      if (filters.entityId) {
        queryText += ` AND d.entity_id = $${paramCount}`;
        params.push(filters.entityId);
        paramCount++;
      }

      if (filters.frameworkId) {
        queryText += ` AND d.framework_id = $${paramCount}`;
        params.push(filters.frameworkId);
        paramCount++;
      }

      if (filters.controlId) {
        queryText += ` AND d.control_id = $${paramCount}`;
        params.push(filters.controlId);
        paramCount++;
      }

      if (filters.taskId) {
        queryText += ` AND d.task_id = $${paramCount}`;
        params.push(filters.taskId);
        paramCount++;
      }

      if (filters.documentType) {
        queryText += ` AND d.document_type = $${paramCount}`;
        params.push(filters.documentType);
        paramCount++;
      }

      if (filters.status) {
        queryText += ` AND d.status = $${paramCount}`;
        params.push(filters.status);
        paramCount++;
      }

      if (filters.search) {
        queryText += ` AND (d.name ILIKE $${paramCount} OR d.description ILIKE $${paramCount})`;
        params.push(`%${filters.search}%`);
        paramCount++;
      }

      queryText += ` ORDER BY d.created_at DESC`;

      if (filters.limit) {
        queryText += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
        paramCount++;
      }

      if (filters.offset) {
        queryText += ` OFFSET $${paramCount}`;
        params.push(filters.offset);
        paramCount++;
      }

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      logger.error('Error finding all documents', {
        organizationId: organizationId,
        filters: filters,
        error: error.message
      });
      throw error;
    }
  }

  static async countAll(organizationId, filters = {}) {
    try {
      let queryText = `
        SELECT COUNT(*)
        FROM documents d
        JOIN entities e ON d.entity_id = e.id
        WHERE e.organization_id = $1
      `;
      
      const params = [organizationId];
      let paramCount = 2;

      if (filters.entityId) {
        queryText += ` AND d.entity_id = $${paramCount}`;
        params.push(filters.entityId);
        paramCount++;
      }

      if (filters.frameworkId) {
        queryText += ` AND d.framework_id = $${paramCount}`;
        params.push(filters.frameworkId);
        paramCount++;
      }

      if (filters.controlId) {
        queryText += ` AND d.control_id = $${paramCount}`;
        params.push(filters.controlId);
        paramCount++;
      }

      if (filters.taskId) {
        queryText += ` AND d.task_id = $${paramCount}`;
        params.push(filters.taskId);
        paramCount++;
      }

      if (filters.documentType) {
        queryText += ` AND d.document_type = $${paramCount}`;
        params.push(filters.documentType);
        paramCount++;
      }

      if (filters.status) {
        queryText += ` AND d.status = $${paramCount}`;
        params.push(filters.status);
        paramCount++;
      }

      if (filters.search) {
        queryText += ` AND (d.name ILIKE $${paramCount} OR d.description ILIKE $${paramCount})`;
        params.push(`%${filters.search}%`);
        paramCount++;
      }

      const result = await query(queryText, params);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      logger.error('Error counting documents', {
        organizationId: organizationId,
        filters: filters,
        error: error.message
      });
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      const allowedFields = [
        'name', 'description', 'status', 'is_evidence'
      ];
      
      const updatesList = [];
      const values = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updatesList.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }

      if (updatesList.length === 0) {
        return await Document.findById(id);
      }

      updatesList.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await query(
        `UPDATE documents SET ${updatesList.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return null;
      }

      logger.info('Document updated', {
        documentId: id,
        updates: updates
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating document', {
        documentId: id,
        updates: updates,
        error: error.message
      });
      throw error;
    }
  }

  static async delete(id) {
    try {
      const result = await query(
        `DELETE FROM documents WHERE id = $1 RETURNING id`,
        [id]
      );

      logger.info('Document deleted', {
        documentId: id
      });

      return result.rows[0];
    } catch (error) {
      logger.error('Error deleting document', {
        documentId: id,
        error: error.message
      });
      throw error;
    }
  }

  static async search(organizationId, searchTerm, filters = {}) {
    try {
      let queryText = `
        SELECT d.*,
               e.name as entity_name,
               f.name as framework_name,
               c.title as control_title,
               t.title as task_title,
               u.first_name as uploader_first_name,
               u.last_name as uploader_last_name,
               ts_rank(to_tsvector('english', d.name || ' ' || COALESCE(d.description, '')), plainto_tsquery('english', $2)) as rank
        FROM documents d
        JOIN entities e ON d.entity_id = e.id
        LEFT JOIN frameworks f ON d.framework_id = f.id
        LEFT JOIN controls c ON d.control_id = c.id
        LEFT JOIN tasks t ON d.task_id = t.id
        LEFT JOIN users u ON d.uploaded_by = u.id
        WHERE e.organization_id = $1
        AND (to_tsvector('english', d.name || ' ' || COALESCE(d.description, '')) @@ plainto_tsquery('english', $2)
             OR d.name ILIKE $3
             OR d.description ILIKE $3)
      `;
      
      const params = [organizationId, searchTerm, `%${searchTerm}%`];
      let paramCount = 4;

      if (filters.entityId) {
        queryText += ` AND d.entity_id = $${paramCount}`;
        params.push(filters.entityId);
        paramCount++;
      }

      if (filters.documentType) {
        queryText += ` AND d.document_type = $${paramCount}`;
        params.push(filters.documentType);
        paramCount++;
      }

      if (filters.status) {
        queryText += ` AND d.status = $${paramCount}`;
        params.push(filters.status);
        paramCount++;
      }

      queryText += ` ORDER BY rank DESC, d.created_at DESC`;

      if (filters.limit) {
        queryText += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
        paramCount++;
      }

      if (filters.offset) {
        queryText += ` OFFSET $${paramCount}`;
        params.push(filters.offset);
        paramCount++;
      }

      const result = await query(queryText, params);
      return result.rows;
    } catch (error) {
      logger.error('Error searching documents', {
        organizationId: organizationId,
        searchTerm: searchTerm,
        filters: filters,
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = Document;