# ClubPro

**ClubPro** is a comprehensive, modern web application for managing club operations, from member tracking to financials and events. Built with React and TypeScript, it features a sleek, responsive, dark-themed UI and provides distinct, feature-rich portals for both administrators and members.

The entire application is powered by a sophisticated mock API service, allowing it to function as a full-stack, interactive prototype without requiring a live backend server.

## ✨ Core Features

### 👑 Admin Features
*   **Dynamic Dashboard:** At-a-glance overview of total members, club revenue, pending payment verifications, and upcoming events.
*   **Complete Member Management:** Full CRUD (Create, Read, Update, Delete) functionality for member profiles. Search, filter, and view member details in a clean, organized list.
*   **Advanced Financial Hub:**
    *   Track revenue, log expenses, and view a real-time summary of net profit/loss.
    *   Create and send bulk payment requests (e.g., annual fees) to all active members.
    *   Verify manual payments submitted by members, with options to approve or reject.
    *   Set a club-wide UPI QR code (by generating or uploading an image) for streamlined payments.
    *   Download detailed financial reports of all transactions in CSV format.
*   **Integrated Event Management:**
    *   Create and manage club events (tournaments, training, social).
    *   View event-specific payment checklists to instantly see which members have paid.
    *   Send email reminders to all unpaid members for an event with a single click.
*   **Direct Member Communication:** Send (simulated) email notifications directly to any member from their profile.

### 👤 Member Features
*   **Personalized Dashboard:** View pending payment count, total amount paid, and upcoming events.
*   **Streamlined Finance Portal:**
    *   View personal payment history with clear statuses (Paid, Pending, Overdue).
    *   Pay invoices by scanning the club's central QR code.
    *   Submit proof of payment (e.g., screenshot upload) for admin verification.
*   **Profile Customization:**
    *   Edit personal profile details (name, email, phone).
    *   Personalize the account by uploading a profile picture.
    *   Change account password for security.
*   **Full Authentication Suite:**
    *   Secure login with a "Remember Me" option for persistent sessions.
    *   A complete, simulated "Forgot Password" flow to reset credentials.

## 🛠️ Technology Stack

*   **Frontend:** **React.js** & **TypeScript**
*   **Styling:** **Tailwind CSS** for a utility-first, modern, and responsive UI.
*   **State Management:** **React Context API** for managing global authentication state.
*   **Backend Simulation:** A comprehensive **mock API service** (`/services/api.ts`) that simulates a real backend, handling all data operations, business logic, and simulated delays.

## 🚀 Getting Started

This is a self-contained application and requires **no build step or package installation**.

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate into the project directory:
    ```bash
    cd <repository-directory>
    ```
3.  Serve the files using any static file server. Here are two common options:

    *   **Using Python:**
        ```bash
        python -m http.server
        ```
    *   **Using Node.js (requires `serve` package):**
        ```bash
        npx serve
        ```
4.  Open your browser and navigate to the local URL provided by the server (e.g., `http://localhost:8000`).

### Default Logins
*   **Admin:** `admin@cricket.com` / `password`
*   **Member:** `member@cricket.com` / `password`
