const { pool } = require('./src/config/database');

// GDPR Control Tasks Mapping
const gdprTasks = {
  'GDPR-001': [
    {
      title: 'Document Lawful Basis for All Processing Activities',
      description: 'Create a comprehensive register documenting the lawful basis (consent, contract, legal obligation, vital interests, public task, legitimate interests) for each personal data processing activity.',
      priority: 'high',
      category: 'documentation',
      estimated_hours: 16,
      task_type: 'compliance'
    },
    {
      title: 'Review and Update Privacy Notices',
      description: 'Ensure all privacy notices clearly state the lawful basis for processing and are easily accessible to data subjects.',
      priority: 'high',
      category: 'documentation',
      estimated_hours: 8,
      task_type: 'compliance'
    },
    {
      title: 'Conduct Lawful Basis Assessment',
      description: 'Perform a systematic review of all data processing activities to ensure they have a valid lawful basis under Article 6 GDPR.',
      priority: 'medium',
      category: 'assessment',
      estimated_hours: 12,
      task_type: 'compliance'
    }
  ],
  'GDPR-002': [
    {
      title: 'Implement Data Subject Access Request (DSAR) Process',
      description: 'Create procedures and systems to handle data subject access requests within 30 days, including identity verification and response templates.',
      priority: 'high',
      category: 'process',
      estimated_hours: 20,
      task_type: 'compliance'
    },
    {
      title: 'Train Staff on DSAR Handling',
      description: 'Provide training to relevant staff on how to identify, process, and respond to data subject access requests.',
      priority: 'medium',
      category: 'training',
      estimated_hours: 4,
      task_type: 'compliance'
    },
    {
      title: 'Create DSAR Response Templates',
      description: 'Develop standardized templates for responding to different types of data subject access requests.',
      priority: 'medium',
      category: 'documentation',
      estimated_hours: 6,
      task_type: 'compliance'
    }
  ],
  'GDPR-003': [
    {
      title: 'Implement Data Rectification Process',
      description: 'Create procedures for data subjects to request correction of inaccurate personal data and implement systems to process such requests.',
      priority: 'high',
      category: 'process',
      estimated_hours: 16,
      task_type: 'compliance'
    },
    {
      title: 'Update Data Quality Controls',
      description: 'Implement technical and organizational measures to ensure data accuracy and enable easy rectification.',
      priority: 'medium',
      category: 'technical',
      estimated_hours: 12,
      task_type: 'compliance'
    }
  ],
  'GDPR-004': [
    {
      title: 'Implement Right to Erasure Process',
      description: 'Create procedures for handling data subject requests for data deletion, including verification and response processes.',
      priority: 'high',
      category: 'process',
      estimated_hours: 20,
      task_type: 'compliance'
    },
    {
      title: 'Conduct Data Retention Review',
      description: 'Review all personal data to identify what can be deleted and establish retention periods for different data types.',
      priority: 'high',
      category: 'assessment',
      estimated_hours: 24,
      task_type: 'compliance'
    },
    {
      title: 'Implement Secure Data Deletion',
      description: 'Ensure technical systems can securely delete personal data when requested by data subjects.',
      priority: 'medium',
      category: 'technical',
      estimated_hours: 16,
      task_type: 'compliance'
    }
  ],
  'GDPR-005': [
    {
      title: 'Conduct Privacy by Design Assessment',
      description: 'Review all systems and processes to ensure they incorporate data protection principles from the outset.',
      priority: 'high',
      category: 'assessment',
      estimated_hours: 32,
      task_type: 'compliance'
    },
    {
      title: 'Implement Data Minimization Controls',
      description: 'Ensure systems only collect and process personal data that is necessary for the specified purpose.',
      priority: 'high',
      category: 'technical',
      estimated_hours: 20,
      task_type: 'compliance'
    },
    {
      title: 'Update System Architecture for Privacy',
      description: 'Modify existing systems and design new ones with privacy considerations built-in.',
      priority: 'medium',
      category: 'technical',
      estimated_hours: 40,
      task_type: 'compliance'
    }
  ],
  'GDPR-006': [
    {
      title: 'Conduct Initial DPIA for High-Risk Processing',
      description: 'Identify and conduct Data Protection Impact Assessments for all high-risk processing activities.',
      priority: 'high',
      category: 'assessment',
      estimated_hours: 40,
      task_type: 'compliance'
    },
    {
      title: 'Create DPIA Template and Process',
      description: 'Develop standardized templates and procedures for conducting DPIAs on an ongoing basis.',
      priority: 'medium',
      category: 'documentation',
      estimated_hours: 12,
      task_type: 'compliance'
    },
    {
      title: 'Train Staff on DPIA Requirements',
      description: 'Provide training on when and how to conduct DPIAs for new processing activities.',
      priority: 'medium',
      category: 'training',
      estimated_hours: 6,
      task_type: 'compliance'
    }
  ],
  'GDPR-007': [
    {
      title: 'Implement Data Breach Detection Systems',
      description: 'Set up monitoring and alerting systems to detect potential personal data breaches quickly.',
      priority: 'high',
      category: 'technical',
      estimated_hours: 24,
      task_type: 'compliance'
    },
    {
      title: 'Create Data Breach Response Plan',
      description: 'Develop comprehensive procedures for investigating, containing, and reporting data breaches within 72 hours.',
      priority: 'high',
      category: 'documentation',
      estimated_hours: 16,
      task_type: 'compliance'
    },
    {
      title: 'Train Incident Response Team',
      description: 'Provide training to the incident response team on GDPR breach notification requirements.',
      priority: 'medium',
      category: 'training',
      estimated_hours: 8,
      task_type: 'compliance'
    }
  ],
  'GDPR-008': [
    {
      title: 'Create Data Processing Register',
      description: 'Develop a comprehensive register of all personal data processing activities, including purposes, data categories, and recipients.',
      priority: 'high',
      category: 'documentation',
      estimated_hours: 24,
      task_type: 'compliance'
    },
    {
      title: 'Implement Register Maintenance Process',
      description: 'Create procedures for keeping the processing register up-to-date and ensuring accuracy.',
      priority: 'medium',
      category: 'process',
      estimated_hours: 8,
      task_type: 'compliance'
    },
    {
      title: 'Review and Validate Processing Activities',
      description: 'Conduct a comprehensive review of all data processing activities to ensure they are properly documented.',
      priority: 'high',
      category: 'assessment',
      estimated_hours: 20,
      task_type: 'compliance'
    }
  ],
  'GDPR-009': [
    {
      title: 'Assess DPO Requirement',
      description: 'Determine if the organization is required to appoint a Data Protection Officer under Article 37 GDPR.',
      priority: 'high',
      category: 'assessment',
      estimated_hours: 8,
      task_type: 'compliance'
    },
    {
      title: 'Appoint and Support DPO',
      description: 'If required, appoint a qualified DPO and ensure they have the necessary resources and independence.',
      priority: 'high',
      category: 'governance',
      estimated_hours: 16,
      task_type: 'compliance'
    },
    {
      title: 'Establish DPO Reporting Structure',
      description: 'Create clear reporting lines and communication channels for the DPO with senior management.',
      priority: 'medium',
      category: 'governance',
      estimated_hours: 4,
      task_type: 'compliance'
    }
  ],
  'GDPR-010': [
    {
      title: 'Conduct International Transfer Assessment',
      description: 'Review all international data transfers and assess the adequacy of protection in destination countries.',
      priority: 'high',
      category: 'assessment',
      estimated_hours: 20,
      task_type: 'compliance'
    },
    {
      title: 'Implement Transfer Safeguards',
      description: 'Put in place appropriate safeguards (SCCs, BCRs, adequacy decisions) for international transfers.',
      priority: 'high',
      category: 'legal',
      estimated_hours: 24,
      task_type: 'compliance'
    },
    {
      title: 'Update Privacy Notices for Transfers',
      description: 'Ensure privacy notices inform data subjects about international transfers and the safeguards in place.',
      priority: 'medium',
      category: 'documentation',
      estimated_hours: 8,
      task_type: 'compliance'
    }
  ]
};

async function addGDPRTasks() {
  try {
    console.log('🚀 Starting GDPR Tasks Creation...\n');

    // Get GDPR framework ID
    const frameworkResult = await pool.query('SELECT id FROM frameworks WHERE name = $1', ['GDPR']);
    if (frameworkResult.rows.length === 0) {
      throw new Error('GDPR framework not found');
    }
    const frameworkId = frameworkResult.rows[0].id;
    console.log(`✅ Found GDPR framework: ${frameworkId}`);

    // Get all GDPR controls
    const controlsResult = await pool.query('SELECT id, control_id FROM controls WHERE framework_id = $1 ORDER BY control_id', [frameworkId]);
    console.log(`✅ Found ${controlsResult.rows.length} GDPR controls\n`);

    let totalTasksCreated = 0;

    // Create tasks for each control
    for (const control of controlsResult.rows) {
      const controlTasks = gdprTasks[control.control_id];
      if (!controlTasks) {
        console.log(`⚠️  No tasks defined for control ${control.control_id}`);
        continue;
      }

      console.log(`📋 Creating tasks for ${control.control_id}:`);
      
      for (const taskData of controlTasks) {
        try {
          const result = await pool.query(`
            INSERT INTO tasks (
              control_id, 
              title, 
              description, 
              status, 
              priority, 
              category, 
              estimated_hours,
              created_at, 
              updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            RETURNING id, title
          `, [
            control.id,
            taskData.title,
            taskData.description,
            'pending',
            taskData.priority,
            taskData.category,
            taskData.estimated_hours
          ]);

          console.log(`   ✅ Created: ${result.rows[0].title}`);
          totalTasksCreated++;
        } catch (error) {
          console.error(`   ❌ Error creating task "${taskData.title}":`, error.message);
        }
      }
      console.log('');
    }

    console.log(`🎉 GDPR Tasks Creation Complete!`);
    console.log(`📊 Total tasks created: ${totalTasksCreated}`);
    console.log(`📋 Framework: GDPR`);
    console.log(`🔧 Controls processed: ${controlsResult.rows.length}`);

    // Verify the results
    const verificationResult = await pool.query(`
      SELECT COUNT(*) as task_count 
      FROM tasks t 
      JOIN controls c ON t.control_id = c.id 
      WHERE c.framework_id = $1
    `, [frameworkId]);
    
    console.log(`\n✅ Verification: ${verificationResult.rows[0].task_count} tasks now exist for GDPR framework`);

  } catch (error) {
    console.error('❌ Error adding GDPR tasks:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

// Run the script
addGDPRTasks();
