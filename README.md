# folder arrangement 
cervitech-nodejs/
├── src/
│   ├── app.ts                    # App bootstrap
│   ├── server.ts                 # Server entry point
│   ├── config/                   # DB, Redis, env config
│   ├── controllers/             # REST API controllers
│   ├── domain/                  # Entities / Models (base, app, backoffice)
│   ├── infrastructure/          # MongoDB, Redis, BullMQ
│   ├── jobs/                    # Scheduled jobs (BullMQ)
│   ├── middlewares/            # Auth, logging
│   ├── routes/                 # Route definitions
│   ├── services/               # Business logic
│   ├── viewmodels/             # API response/request shapes
│   └── utils/                  # Logger, helpers, etc.
├── .env
├── .prettierrc
├── tsconfig.json
├── yarn.lock
└── package.json
