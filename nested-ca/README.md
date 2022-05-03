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



## Links to relevant stuff

[Understanding Certificate Cross-Signing](https://www.ssltrust.com.au/blog/understanding-certificate-cross-signing){:target="_blank"}

[OpenSSL Certificate Authority](https://jamielinux.com/docs/openssl-certificate-authority/index.html){:target="_blank"}
- [Root CA configuration file](https://jamielinux.com/docs/openssl-certificate-authority/appendix/root-configuration-file.html){:target="_blank"}
- [Intermediate CA configuration file](https://jamielinux.com/docs/openssl-certificate-authority/appendix/intermediate-configuration-file.html){:target="_blank"}
