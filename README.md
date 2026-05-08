HPP Fleet Operations Dashboard

This project is a monitoring and management interface for Hydroelectric Power Plant (HPP) assets. It consists of a React frontend and a Python FastAPI backend to handle data visualization and asset control.

## Project Overview
The application allows users to monitor generation capacity and manage plant data through a web interface. The frontend is built with React 19 and Material UI, while the backend utilizes FastAPI for a lightweight, high-performance REST API.

Current Hosting Status
The frontend is currently deployed on GitHub Pages:
https://Chatbotcreator-cmyk.github.io/hpp-dashboard/

Important: Because the backend is hosted locally, the live dashboard will only display data when the local Python server is running on the viewing machine.

Technical Specifications
- Frontend: React 19, TypeScript, Vite, TanStack Query, Material UI.
- Backend: Python 3.x, FastAPI, Uvicorn.
- Data Management: Axios for API requests and React-CSV for data export.

Installation and Setup

1. Backend Configuration
Navigate to the directory containing the Python API and install the necessary requirements:

pip install fastapi uvicorn

To start the server, run:
uvicorn main:app --reload

The API will run at http://127.0.0.1:8000. You can view the raw JSON data at the /plants endpoint.

2. Frontend Configuration
Navigate to the hpp-dashboard directory and install the project dependencies:

npm install

To start the development environment:
npm run dev

The interface will be accessible at http://localhost:5173/hpp-dashboard/.

Deployment Instructions
This repository is configured to deploy the production build to the gh-pages branch. 

To push updates to the live site:
1. Ensure the homepage field in package.json is correct.
2. Execute the deployment script:
   npm run deploy

Academic Context
This project was developed to demonstrate full-stack integration, specifically focusing on connecting a React-based UI with a Python backend and managing asynchronous state updates.

Developer: Avyan
<img width="1908" height="972" alt="image" src="https://github.com/user-attachments/assets/7ade0c06-62a4-497f-8db8-222c0790d318" />
