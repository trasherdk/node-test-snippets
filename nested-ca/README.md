# A Nested CA authority

Given a Authority structure like:
```
Roo-CA
├── Intermediate-1-CA
│   ├── App-1-CA
│   └── App-2-CA
├── Intermediate-2-CA
│   ├── App-3-CA
│   └── App-4-CA
└── Intermediate-3-CA
    ├── App-5-CA
    └── App-6-CA
```

I want to be able to generate certificates, valid for mutual authentification, between client app and server app.
Also browser client certificates should be generated for clients.

Explore cross-signing between intermediates.