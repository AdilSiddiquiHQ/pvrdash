# ClipAlly OS Dashboard - Deployment Guide

Follow these 3 simple steps to connect your master Google Sheet database and deploy your ClipAlly Outreach Dashboard live to the internet in under 5 minutes.

---

## Step 1: Deploy the Google Apps Script Web API

1. Open your master spreadsheet: [ClipAlly - Master Outreach CRM](https://docs.google.com/spreadsheets/d/1m6kyzYf6madLIhaoJahY83qXIk4Wn-InCd-J-iwqB5w/edit)
2. In the top menu, go to **Extensions > Apps Script**.
3. Clear the default `Code.gs` buffer and paste the complete content of the local file:
   👉 [google-apps-script.js](file:///Users/abdulaziz/Downloads/CLIPPING/google-apps-script.js)
4. Click the **Save (Disk icon)** in the toolbar.
5. Click the blue **Deploy > New deployment** button in the top right.
6. Click the gear icon next to "Select type" and choose **Web app**.
7. Configure the settings exactly as follows:
   - **Description:** `ClipAlly CRM Web API`
   - **Execute as:** `Me (your-google-account@gmail.com)`
   - **Who has access:** `Anyone` (This is required so your dashboard can make requests without oauth logins).
8. Click **Deploy**.
9. Grant access permissions when prompted:
   - Click *Authorize access*.
   - Choose your account.
   - Click *Advanced* (small grey text) and then *Go to Untitled project (unsafe)*.
   - Click *Allow*.
10. Copy the generated **Web App URL** (it ends in `/exec`).

---

## Step 2: Update Your Environment Configuration

1. Open your local project file:
   👉 [.env](file:///Users/abdulaziz/Downloads/CLIPPING/.env)
2. Replace the placeholder URL with your real copied Apps Script Web App URL:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz_REAL_DEPLOYMENT_ID/exec
   ```
3. Save the file.

---

## Step 3: Build & Host Live (No-Code Drag-and-Drop)

Since the dashboard is a static React application, you can compile and host it instantly for free:

1. Open your terminal in the `/Users/abdulaziz/Downloads/CLIPPING` directory and compile the app:
   ```bash
   npm run build
   ```
   *Note: This generates a production-ready folder called `dist/` containing all self-contained styles and JavaScript. You must build AFTER updating the `.env` file.*
2. Open [Netlify Drop](https://app.netlify.com/drop) in your browser.
3. Open your Mac Finder and drag the compiled [dist/](file:///Users/abdulaziz/Downloads/CLIPPING/dist) folder directly into the Netlify upload target box.
4. **Done!** Netlify will publish it immediately and give you a live URL (e.g. `https://clipally-outreach.netlify.app`) that you and your co-founder can access from anywhere.

---

## 🔒 Securing Dashboard Access (Optional)

If you want to prevent random strangers from accessing the board:
- Change the URL name inside Netlify Settings (e.g., change the domain slug to a secret combination like `https://clipally-crm-xx299.netlify.app`). Only share this URL with your co-founder.
