# League Tracker

A web application for tracking and managing competitive league matches, standings, and player statistics.

## Overview

League Tracker is a full-stack application that allows players to create leagues, report match results, and view standings. Built with modern web technologies, it provides an intuitive interface for managing competitive gaming leagues and tournaments.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and builds
- **TailwindCSS** for styling
- **React Router** for navigation
- **Google OAuth** for authentication

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **JWT** for session management
- **Winston** for logging

## Project Structure

```
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API service layer
│   │   └── hooks/         # Custom React hooks
│   └── ...
│
├── backend/           # Express backend API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── utils/         # Utility functions
│   │   └── middleware.ts  # Express middleware
│   └── prisma/            # Database schema and migrations
│       └── schema.prisma
└── ...
```

## Features

- 🔐 Google OAuth authentication
- 🏆 Create and manage competitive leagues
- ⚔️ Report match results
- 📊 View standings and statistics

## Contributing

We welcome contributions! If you'd like to contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests where applicable.

## Bug Reports

Found a bug? Please open an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, browser, Node version, etc.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
