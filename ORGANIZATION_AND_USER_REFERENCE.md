# GRC Platform - Organization and User Reference

## Overview
This document provides a comprehensive reference for the test organization and users created during the GRC platform development and testing phase.

## Organization Details

### Primary Test Organization
- **Organization ID**: `35903f74-76d2-481d-bfc2-5861f7af0608`
- **Name**: Test Organization
- **Industry**: Technology
- **Country**: United States
- **Created**: 2025-01-11

### Entity Information
- **Entity ID**: `f31546c7-5643-45a9-8239-bd213e10f8ef`
- **Entity Name**: Main Operations
- **Organization ID**: `35903f74-76d2-481d-bfc2-5861f7af0608`
- **Status**: Active

## User Accounts

### Admin User
- **User ID**: `515597e9-cf1f-4439-bb0d-01abc67c1667`
- **Email**: `admin@example.com`
- **Name**: Admin User
- **Role**: `admin`
- **Organization ID**: `35903f74-76d2-481d-bfc2-5861f7af0608`
- **Entity ID**: `f31546c7-5643-45a9-8239-bd213e10f8ef`
- **Created**: 2025-01-11T08:26:28.975Z
- **Status**: Active

### Compliance Manager User
- **User ID**: `66ddf035-465d-4644-9a6c-c694cd2247f6`
- **Email**: `evidencetest1760175080@example.com`
- **Name**: Evidence Test User
- **Role**: `compliance_manager`
- **Organization ID**: `35903f74-76d2-481d-bfc2-5861f7af0608`
- **Entity ID**: `f31546c7-5643-45a9-8239-bd213e10f8ef`
- **Created**: 2025-01-11T06:31:29.323Z
- **Status**: Active

## Assigned Frameworks

The organization currently has **5 frameworks** assigned to the Main Operations entity:

### 1. CCPA (California Consumer Privacy Act)
- **Framework ID**: `d98babbe-5d1f-4bc8-b55c-bf8d4c3d39fc`
- **Assignment ID**: `43d5bd53-c67c-41c2-aaf0-b15d52e13208`
- **Category**: Privacy, Legal
- **Region**: Americas (United States)
- **Priority**: High
- **Risk Level**: High
- **Status**: Active
- **Tasks Generated**: 13 tasks
- **Compliance Score**: 0%

### 2. GDPR (General Data Protection Regulation)
- **Framework ID**: `87aa7301-4529-4a57-ab13-9afbf5f1c467`
- **Assignment ID**: `e23f74fa-f9dc-499f-92f6-2d9804c89356`
- **Category**: Privacy, Legal
- **Region**: Europe (European Union)
- **Priority**: High
- **Risk Level**: Critical
- **Status**: Active
- **Tasks Generated**: 10 tasks
- **Compliance Score**: 0%

### 3. ISO 27001 (Information Security Management System)
- **Framework ID**: `cebe2a09-c939-49de-916d-b5ccc27383e4`
- **Assignment ID**: `17886f2b-484f-4014-a583-9c50f46fead6`
- **Category**: Security, Standards
- **Region**: Global
- **Priority**: High
- **Risk Level**: High
- **Status**: Active
- **Tasks Generated**: 4 tasks
- **Compliance Score**: 0%

### 4. Kenya Data Protection Act
- **Framework ID**: `c113c8f4-fa02-47ac-a71b-aa115060584a`
- **Assignment ID**: `db826a2d-359a-4ba1-9991-0ef938e4f8b6`
- **Category**: Privacy, Legal
- **Region**: Africa (Kenya)
- **Priority**: High
- **Risk Level**: High
- **Status**: Active
- **Tasks Generated**: 2 tasks
- **Compliance Score**: 0%

### 5. PCI DSS (Payment Card Industry Data Security Standard)
- **Framework ID**: `ee1f994e-8081-441c-8032-58447dadc9ae`
- **Assignment ID**: `d92341c6-d0c5-4ed5-b922-a271de6d4189`
- **Category**: Financial, Standards
- **Region**: Global
- **Priority**: High
- **Risk Level**: Critical
- **Status**: Active
- **Tasks Generated**: 13 tasks
- **Compliance Score**: 0%

## Current Compliance Status

### Overall Statistics
- **Total Frameworks**: 5
- **Total Controls**: 31
- **Total Tasks**: 42
- **Completed Tasks**: 5 (12% completion rate)
- **Pending Tasks**: 37
- **In Progress Tasks**: 0
- **Overdue Tasks**: 0
- **Total Evidence Documents**: 9
- **Total Audit Gaps**: 31
- **Open Audit Gaps**: 26
- **Average Compliance Score**: 18.75%
- **Risk Level**: High
- **Compliance Status**: Critical

### Task Breakdown by Framework
| Framework | Total Tasks | Completed | Pending | Completion Rate |
|-----------|-------------|-----------|---------|-----------------|
| CCPA | 13 | 0 | 13 | 0% |
| GDPR | 10 | 4 | 6 | 40% |
| ISO 27001 | 4 | 1 | 3 | 25% |
| Kenya DPA | 2 | 0 | 2 | 0% |
| PCI DSS | 13 | 0 | 13 | 0% |

## API Authentication

### Admin Token (Current Active)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MTU1OTdlOS1jZjFmLTQ0MzktYmIwZC0wMWFiYzY3YzE2NjciLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwib3JnYW5pemF0aW9uSWQiOiIzNTkwM2Y3NC03NmQyLTQ4MWQtYmZjMi01ODYxZjdhZjA2MDgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjAxODE5ODgsImV4cCI6MTc2MDI2ODM4OH0.J_d573o0-C_JxAXZSQK79rKuUPJu7fBSCfDCGujdu7E
```

### Compliance Manager Token
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmRkZjAzNS00NjVkLTQ2NDQtOWE2Yy1jNjk0Y2QyMjQ3ZjYiLCJlbWFpbCI6ImV2aWRlbmNldGVzdDE3NjAxNzUwODBAZXhhbXBsZS5jb20iLCJvcmdhbml6YXRpb25JZCI6IjM1OTAzZjc0LTc2ZDItNDgxZC1iZmMyLTU4NjFmN2FmMDYwOCIsInJvbGUiOiJjb21wbGlhbmNlX21hbmFnZXIiLCJpYXQiOjE3NjAxNzUwODEsImV4cCI6MTc2MDI2MTQ4MX0.iqecTYzmMs3-nx1aGXPOfOdVlnzkKNldv8fC4686smA
```

## Recent Framework Additions

### CCPA Framework (Added 2025-01-11)
- **Controls Added**: 4 controls
- **Tasks Created**: 10 tasks
- **Focus Areas**:
  - Consumer Rights Implementation
  - Privacy Notice and Disclosure Requirements
  - Data Security and Protection
  - Third-Party Data Sharing Controls

### PCI DSS Framework (Added 2025-01-11)
- **Controls Added**: 5 controls
- **Tasks Created**: 10 tasks
- **Focus Areas**:
  - Firewall Configuration
  - Default Password Security
  - Cardholder Data Protection
  - Data Transmission Encryption
  - Anti-virus Software Management

## Evidence Documents

### Current Evidence Files
- **Total Documents**: 9
- **Document Types**: Policy, Evidence, Report
- **Uploaded By**: Evidence Test User
- **Status**: Linked to completed tasks

### Document Categories
- Information Security Policies
- GDPR Compliance Evidence
- Policy Review Reports
- Asset Inventory Documentation

## Audit Gaps

### Current Audit Gaps
- **Total Gaps**: 31
- **Open Gaps**: 26
- **Resolved Gaps**: 5
- **Gap Categories**:
  - Technical (Missing security controls)
  - Evidence (Missing documentation)
  - Administrative (Missing policies)

## API Endpoints Used

### Primary Endpoints
- **Base URL**: `http://localhost:3001/api`
- **Authentication**: Bearer Token
- **Key Endpoints**:
  - `GET /api/tasks` - Retrieve organization tasks
  - `GET /api/reports/overview` - Organization overview
  - `GET /api/reports/tasks` - Task breakdown
  - `GET /api/reports/frameworks` - Framework status
  - `POST /api/entities/{id}/frameworks/{id}` - Assign frameworks
  - `GET /api/entities/{id}/frameworks` - List assigned frameworks

## Development Notes

### Framework Controls Enhancement
- **Date**: 2025-01-11
- **Action**: Added controls and tasks to previously empty frameworks
- **Frameworks Updated**: PCI DSS, HIPAA, SOC 2, CCPA
- **Result**: All frameworks now have proper controls and context-aware tasks

### Task Generation
- **Automatic**: Tasks are generated when frameworks are assigned to entities
- **Context-Aware**: Tasks are specific to each framework's requirements
- **Estimated Hours**: Tasks include realistic time estimates
- **Priority Levels**: High, Medium, Low based on framework requirements

## Future Reference

### For Testing
- Use Admin User for full system access
- Use Compliance Manager User for role-based testing
- Organization ID and Entity ID are consistent across all tests

### For Development
- All framework assignments are active and generating tasks
- Compliance engine is working with real-time checks
- Audit gap detection is functioning properly
- Evidence management is operational

### For Maintenance
- Regular compliance checks run every 5 minutes
- Real-time compliance updates on framework assignment
- Audit gap synchronization with task completion
- Document evidence linking to completed tasks

---

**Last Updated**: 2025-01-11
**Document Version**: 1.0
**Maintained By**: GRC Platform Development Team
