HPP Fleet Operations Dashboard (Frontend)

This repository contains the React-based frontend for the Hydroelectric Power Plant (HPP) management system. It provides a professional interface to visualize data provided by the HPP Mock API.

Relationship with Backend
This project requires the HPP Mock API to be running to display data. The backend source code is located in a separate repository:
https://github.com/Chatbotcreator-cmyk/hpp-api

Core Features
Fleet Overview: KPI cards showing total MW capacity and active units.

Asset Table: Detailed view of all power plants with status indicators.

CRUD Operations: Interface to add new plants or delete existing ones.

Search and Filter: Real-time filtering by plant name and operational status.

Data Export: Exporting current fleet inventory to CSV format.

Technology Stack
Framework: React 19 (Vite)

Language: TypeScript

Styling: Material UI (MUI)

State Management: TanStack Query (React Query)

API Client: Axios

Installation and Setup
1. Prerequisites
Ensure you have Node.js and npm installed. You must also have the backend server running from the hpp-api repository.

2. Install Dependencies
Navigate to the hpp-dashboard folder and run:
npm install

3. Local Development
To start the frontend development server:
npm run dev

The application will be available at http://localhost:5173/hpp-dashboard/.

Configuration for API Connection
The dashboard is configured to communicate with the backend at http://127.0.0.1:8000.

If your backend is running on a different port, update the baseURL in the api configuration file:

File: src/api.ts (or wherever hppApi is defined)

Default: http://127.0.0.1:8000

Deployment
This project uses the gh-pages package for deployment.

To deploy the latest version to GitHub Pages:

Ensure your changes are committed.

Run the deployment script:
npm run deploy

Developer
Avyan (Chatbotcreator-cmyk)
