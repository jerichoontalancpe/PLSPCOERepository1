# PLSP Engineering Repository Management System

A modern, fully functional Web-Based Repository & Management System for the College of Engineering at Pamantasan ng Lungsod ng San Pablo (PLSP), City of San Pablo, Laguna.

## 🎯 Features

### Core Functionality
- **Centralized Repository**: Manage MOR topics, Capstone projects, and Design projects
- **Department Support**: Industrial Engineering (BSIE) and Computer Engineering (BSCpE)
- **Advanced Search**: Search by title, authors, keywords, and content
- **Smart Filtering**: Filter by department, project type, year, and status
- **Admin Dashboard**: Complete CRUD operations for project management
- **File Management**: PDF upload and download capabilities

### User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with Navy Blue/Orange branding
- **Fast Performance**: Optimized React frontend with efficient backend
- **SEO Optimized**: Search engine friendly structure

## 🎨 Design & Branding

### Color Scheme
- **Primary**: Navy Blue (#1e3a8a)
- **Secondary**: Orange (#f97316)
- **Accents**: White and Gray for optimal readability

### Visual Identity
- College of Engineering and PLSP logos prominently displayed
- Professional, academic-focused design
- Consistent branding across all pages

## 🏗️ Technical Architecture

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **Routing**: React Router for navigation
- **Styling**: Custom CSS with CSS variables
- **Icons**: Lucide React for consistent iconography
- **State Management**: Context API for authentication

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: SQLite for simplicity and portability
- **Authentication**: JWT-based secure login
- **File Upload**: Multer for PDF handling
- **Security**: bcryptjs for password hashing

### Database Schema
```sql
-- Users table for admin authentication
users (id, username, password, role, created_at)

-- Projects table for all repository content
projects (
  id, title, authors, adviser, year, abstract, 
  keywords, department, project_type, status, 
  pdf_filename, created_at, updated_at
)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd plsp-repository
npm run install-all
```

2. **Start development servers**
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Default Admin Credentials
- **Username**: admin
- **Password**: admin123

## 📁 Project Structure

```
plsp-repository/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── App.css         # Global styles
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── uploads/            # PDF file storage
│   ├── database.js         # Database configuration
│   └── index.js            # Server entry point
└── package.json            # Root package configuration
```

## 🔧 Configuration

### Environment Variables
Create `server/.env`:
```env
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Database
The system uses SQLite for easy deployment and maintenance. The database file (`plsp_repository.db`) is automatically created on first run.

## 📱 Pages & Features

### Public Pages
1. **Home Page**
   - Hero section with search
   - Quick access to different repositories
   - Statistics overview

2. **Repository Pages**
   - MOR Library (IE/CPE)
   - CPE Design Projects
   - IE Capstone Projects
   - Advanced search and filtering

3. **Project Detail Pages**
   - Complete project information
   - PDF download links
   - Keyword tags and metadata

4. **About Page**
   - College information
   - Mission and vision
   - Program descriptions

### Admin Features
1. **Secure Login**
   - JWT-based authentication
   - Session management

2. **Dashboard**
   - Project statistics
   - Recent activity overview

3. **Project Management**
   - Add new projects
   - Edit existing projects
   - Delete projects
   - PDF file upload

## 🔍 Search & Filtering

### Search Capabilities
- Full-text search across titles, authors, and keywords
- Real-time search results
- Search highlighting

### Filter Options
- **Department**: IE, CPE
- **Project Type**: MOR, Capstone, Design Project
- **Year**: 2019 to current year
- **Status**: Completed, Ongoing

## 📊 Analytics & Statistics

### Dashboard Metrics
- Total projects count
- Projects by department
- Projects by type
- Projects by year
- Recent additions

## 🔒 Security Features

- **Authentication**: JWT-based admin authentication
- **File Upload**: PDF-only file restrictions
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client && npm run build

# Start production server
cd ../server && npm start
```

### Environment Setup
1. Set production environment variables
2. Configure file upload directory permissions
3. Set up reverse proxy (nginx recommended)
4. Configure SSL certificates

## 🛠️ Maintenance

### Database Backup
```bash
# Backup SQLite database
cp server/plsp_repository.db backup/plsp_repository_$(date +%Y%m%d).db
```

### File Management
- PDF files stored in `server/uploads/`
- Regular cleanup of orphaned files recommended
- Monitor disk space usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates & Roadmap

### Current Version: 1.0.0
- Full repository functionality
- Admin dashboard
- Responsive design
- Search and filtering

### Planned Features
- User registration for students
- Advanced analytics
- Export functionality
- Email notifications
- API documentation

---

**Developed for Pamantasan ng Lungsod ng San Pablo - College of Engineering**
# Deployment fix
