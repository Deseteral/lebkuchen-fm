# Authorization
LebkuchenFM uses _session cookie_ and/or _basic auth with token_ methods to authorize its users. Each request to `/api/*` endpoint has to be authorized.

Session cookie is set during successful `POST` request to `/api/auth` endpoint and is generally handled by the web client.

# User management
There is no way to register as a new user.
Instead, LebkuchenFM functions as an invite-only system.

When there are no registered users, first login is always correct and creates account with provided credentials.

Every next user has to be created using user management app in the web client by another user that already has access to the system.
This creates a new account without password set. Invited user is going be able to set the password when they login for the first time.

# External integrations
For external integrations users should use API tokens.

Each user can obtain this token after logging in the web client and requesting `GET /api/auth`.

Using this token external tools can integrate with LebkuchenFM by making requests with `Authorization: Basic <api-token>` header set.
