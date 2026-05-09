# Nexbase Feedback Management System

A full-stack feedback management system for Nexbase, built using Angular 17, ASP.NET Core 8 Web API, and SQL Server.

## Features
- **Frontend**: Angular standalone components, modern responsive glassmorphism UI, custom Star Rating.
- **Backend**: Clean architecture, JWT Authentication, EF Core Migrations.
- **Database**: SQL Server.
- **Email Notifications**: Formspree integration for seamless email delivery upon feedback submission.
- **Admin Dashboard**: Data table with Search, Filter, Pagination (implicit), and CSV Export.

---

## 🚀 How to Run the Project (Using Docker)

This is the recommended and easiest way to start the project.

### Prerequisites
- Docker & Docker Compose installed.

### Steps
1. Navigate to the root directory `NexbaseFeedbackSystem`.
2. Open `docker-compose.yml` and replace `YOUR_FORMSPREE_ID` with your actual Formspree endpoint ID if you want to test emails.
3. Run the following command:
   ```bash
   docker-compose up --build -d
   ```
4. Access the applications:
   - **Frontend (User Form)**: `http://localhost:4200`
   - **Frontend (Admin Login)**: `http://localhost:4200/admin`
   - **Backend API**: `http://localhost:5000/api/feedback`

*Note: The EF Core migrations will automatically run and seed the database with a default Admin user upon the API startup.*
* **Default Admin Credentials:**
  - Username: `admin`
  - Password: `Admin@123!`

---

## 💻 How to Run the Project (Without Docker)

### Prerequisites
- .NET 8 SDK
- Node.js (v18 or higher)
- SQL Server (LocalDB or Developer Edition)

### Step 1: Setup Backend
1. Navigate to the `backend` folder.
2. Open `appsettings.json` and update the `DefaultConnection` string to point to your local SQL Server instance. Also update the Formspree endpoint.
3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```
4. Run the API:
   ```bash
   dotnet run
   ```
   *The API will start at `http://localhost:5000`.*

### Step 2: Setup Frontend
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Angular development server:
   ```bash
   npm start
   ```
   *The app will start at `http://localhost:4200`.*

---

## 📧 Setting Up Formspree for Emails

1. Go to [Formspree](https://formspree.io/) and create an account.
2. Create a new form and copy the endpoint URL (e.g., `https://formspree.io/f/xbjvqeaw`).
3. Paste this URL into `backend/appsettings.json` under `Formspree:Endpoint`, or in `docker-compose.yml` under `Formspree__Endpoint`.
4. When a user submits feedback, the backend will send a POST payload to Formspree, which will dispatch an email to your registered inbox!
