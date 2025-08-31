# HDElite Frontend

A modern, responsive notes application frontend built with React that provides seamless note-taking experience with secure authentication.

## Features

- **Authentication System**
  - User signup and login with OTP verification
  - Google OAuth integration for quick access
  - Secure session management
- **Notes Management**
  - Create new notes with rich text support
  - Delete notes with confirmation
  - Real-time synchronization with backend
- **Responsive Design**
  - Mobile-friendly interface
  - Clean and intuitive user experience
  - Modern UI components

## Tech Stack

- **Frontend Framework**: React 18+
- **Styling**: CSS3 / Styled Components / Tailwind CSS
- **State Management**: React Context API / Redux
- **HTTP Client**: Axios
- **Authentication**: JWT tokens
- **Build Tool**: Vite / Create React App

## Prerequisites

Before running this application, make sure you have:

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Running backend server (hdelite-backend)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/anuplohar001/hdelite-frontend.git
cd hdelite-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```



## Running the Application

### Development Mode
```bash
npm start
# or
yarn start
```
The application will open at `http://localhost:5173`

### Production Build
```bash
npm run build
# or
yarn build
```

### Testing
```bash
npm test
# or
yarn test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Signup.tsx
│   ├── Dashboard.tsx         
├── styles/             # Global styles and themes
└── App.js              # Main application component
```

## Key Components

### Authentication Flow
- **Login**: Email/phone with OTP verification or Google OAuth
- **Signup**: User registration with email/phone verification
- **Protected Routes**: Automatic redirection for unauthorized access

### Notes Features
- **Create Notes**: Rich text editor with formatting options
- **Notes List**: Grid/list view of all user notes
- **Delete Notes**: Confirmation dialog before deletion
- **Search & Filter**: Find notes quickly

## API Integration

The frontend communicates with the backend through RESTful APIs:

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/google` - Google OAuth
- `GET /notes` - Fetch user notes
- `POST /notes` - Create new note
- `DELETE /notes/:id` - Delete note



## Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Vercel
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Docker
```bash
# Build Docker image
docker build -t hdelite-frontend .

# Run container
docker run -p 5173:5173 hdelite-frontend
```


## Related Repositories

- **Backend**: [hdelite-backend](https://github.com/anuplohar001/hdelite-backend)

---

Made with ❤️ by the HDElite Team