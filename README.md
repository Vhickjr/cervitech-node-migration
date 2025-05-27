# folder structure 
#cervitech-nodejs/
├##── src/
│   ├── app.ts                    # App bootstrap logic
│   ├── server.ts                 # Main server entry point
│   ├── config/                   # Environment config, DB, Redis
│   ├── controllers/              # REST API controllers (handles requests/responses)
│   ├── domain/                   # Domain models/entities (e.g., users)
│   ├── infrastructure/           # External integrations (MongoDB, Redis, BullMQ)
│   ├── jobs/                     # Scheduled jobs and queues (BullMQ)
│   ├── middlewares/             # Custom middlewares (auth, error handling, etc.)
│   ├── routes/                   # API route definitions
│   ├── services/                 # Business logic and service classes
│   ├── viewmodels/               # Request/response shapes (DTOs, validation)
│   └── utils/                    # Utility functions (logger, helpers)
├── .env                          # Environment variable file
├── .prettierrc                   # Prettier config for code formatting
├── tsconfig.json                 # TypeScript configuration
├── yarn.lock                     # Yarn lockfile
└── package.json                  # Project metadata and scripts
