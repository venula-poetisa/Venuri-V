# Venuri V. Modern Portfolio + Admin CMS

## What changed
- Preserved the original portfolio content, warm pink/brown identity, images and main sections.
- Modern responsive layout with a stronger hero, timeline-based education/experience, skill cards, featured project presentation and a future-project roadmap.
- Dark mode with localStorage.
- Admin dashboard for profile, education, experience, skills/tech stack, projects, future projects, contact information and resume path.
- REST API with Express.
- MongoDB persistence with Mongoose.
- JWT authentication + bcrypt password hashing.
- Uses a simple MVC-style separation: static client, API/server, MongoDB models.
- Designed so content can be edited without repeatedly touching the portfolio HTML.

## Corporate-style stack used
HTML5, CSS3, JavaScript (ES6+), Node.js, Express.js, MongoDB, Mongoose, REST API, JWT, bcrypt, dotenv, Git/GitHub.

## Run locally
1. Install Node.js LTS.
2. Create a MongoDB Atlas database.
3. Copy `.env.example` to `.env` and fill in the values.
4. Run `npm install`.
5. Run `npm start`.
6. Open `http://localhost:5000`.
7. Open `http://localhost:5000/admin.html` for the CMS.
8. Sign in using the ADMIN_EMAIL and ADMIN_PASSWORD from `.env`.

The existing `content/` folder from the original portfolio should sit beside `index.html`, `style.css`, and `script.js`.

## Important
Do not commit `.env` to GitHub. The admin password should only exist in environment variables and should be changed before deployment.
