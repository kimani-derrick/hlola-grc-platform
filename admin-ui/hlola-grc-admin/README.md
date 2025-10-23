# GRC Platform - Admin UI

A beautiful, modern admin interface for managing compliance frameworks, controls, and tasks with glassmorphism design.

## Features

- 🎨 **Glassmorphism Design**: Modern, elegant UI with glass-like effects
- 📊 **Dashboard Overview**: Real-time stats and metrics
- 🏗️ **Framework Management**: Create, edit, and manage compliance frameworks
- 🛡️ **Control Management**: Manage controls within frameworks
- ✅ **Task Management**: Create and manage tasks for controls
- 📤 **Bulk Import**: CSV/Excel import functionality
- 📋 **Audit Logs**: Track administrative actions
- 🔐 **Authentication**: Secure admin login system

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** + **Zod** for forms
- **TanStack Table** for data tables
- **Lucide React** for icons

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Credentials

- **Email**: admin@example.com
- **Password**: password

## Project Structure

```
src/
├── app/
│   ├── dashboard/admin/     # Admin dashboard pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Login page
└── components/             # Reusable components
```

## Design Philosophy

This admin UI follows the design document specifications:

- **Content Management Only**: Manages frameworks, controls, and tasks (templates)
- **No Organization Management**: Does not manage organizations or entities
- **Hierarchical Structure**: Frameworks → Controls → Tasks
- **Glassmorphism Aesthetic**: Modern, elegant design with transparency effects

## Features Demonstrated

### Dashboard
- Real-time statistics cards
- Navigation tabs for different sections
- Search functionality
- Responsive design

### Framework Management
- List view with framework details
- Priority and risk level indicators
- Control and task counts
- Color-coded categories

### Control Management
- Control listing with framework context
- Category and priority indicators
- Task count per control
- Framework association

### Task Management
- Task listing with control context
- Status and priority indicators
- Due date and estimated hours
- Template tasks only (no user assignment)

### Bulk Import
- File upload interface
- CSV/Excel support
- Preview and validation

### Audit Logs
- Administrative action tracking
- User and timestamp information
- Action type categorization

## Next Steps

This is a demonstration UI. To implement the full functionality:

1. Connect to backend APIs
2. Implement form validation
3. Add CRUD operations
4. Implement file upload
5. Add real-time updates
6. Implement proper authentication

## License

Private - GRC Platform Admin UI