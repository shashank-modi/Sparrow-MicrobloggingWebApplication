# Sparrow – Microblogging Web Application

Sparrow is a **Microblogging app** built with a modern stack:  
- **Frontend:** React + Material-UI (MUI)  
- **Backend:** ASP.NET Core Web API  
- **Database:** PostgreSQL (Supabase)  
- **Deployment:** Vercel (frontend) + Render (backend)

---

##  Features
- **User Authentication** with JWT  
- **Post Creation** with live feed updates  
- **Like & Comment System** with counts  
- **Follow/Unfollow** users  
- **Profile Dialogs** showing user stats  
- **Auto-refreshing feed** every 8 seconds  
- **Responsive UI** styled with MUI  
- **Deployed Live** – works across devices

---

##  Tech Stack
- **Frontend:** React, Material-UI, Vite/CRA  
- **Backend:** .NET 9, Entity Framework Core, JWT Auth  
- **Database:** PostgreSQL on Supabase  
- **Deployment:**  
  - **Frontend:** [Vercel](https://vercel.com)  
  - **Backend:** [Render](https://render.com) with Docker  
- **Other:** Swagger for API testing, GitHub for version control

---

##  Setup (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/sparrow.git
cd sparrow

2. Backend setup

cd server
dotnet restore
dotnet run

	•	Update appsettings.Development.json with your local PostgreSQL connection string.

3. Frontend setup

cd client
npm install
npm run dev

Frontend runs on http://localhost:5173
Backend runs on http://localhost:5112

```
⸻

## Environment Variables
```
Backend (Render → Environment tab)

ConnectionStrings__DefaultConnection=your_supabase_connection_string
Jwt__Key=your_jwt_secret
Jwt__Issuer=https://sparrow.local
Jwt__Audience=https://sparrow.local

Frontend (Vercel → Environment tab)

VITE_API_URL=https://your-backend.onrender.com

```
⸻

## Deployment
```
Backend
	•	Deploy to Render with a Dockerfile in /server
	•	Expose port 8080
	•	Add environment variables in Render dashboard

Frontend
	•	Deploy to Vercel directly from GitHub
	•	Add VITE_API_URL in project settings
	•	Optionally configure vercel.json for rewrites:

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

```
⸻

## Roadmap
 ```
	•	Image uploads for posts
	•	Real-time feed with WebSockets
	•	Notifications (likes, comments, follows)
	•	Mobile app version
```
⸻

#### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss.

⸻

 Author

Shashank Modi
