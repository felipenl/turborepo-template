# Infrastructure

Configuration for production infrastructure components.

## Directory Structure

```
infrastructure/
└── traefik/
    ├── traefik.yml       # Traefik static configuration
    ├── acme/             # SSL certificates (auto-generated, gitignored)
    └── .gitignore
```

## Traefik

Traefik acts as a reverse proxy and handles:
- Automatic HTTPS via Let's Encrypt
- HTTP → HTTPS redirects
- Routing to containerized services
- SSL certificate management and renewal

### Configuration

The `traefik.yml` file contains:
- **Entry points**: HTTP (80) and HTTPS (443)
- **Docker provider**: Auto-discovers services via labels
- **Let's Encrypt**: HTTP challenge for automatic SSL certificates
- **Logging**: JSON-formatted logs

### First-Time Setup

Before deploying, update `traefik.yml`:
1. Change `email: your-email@example.com` to your actual email
2. (Optional) Switch to DNS challenge if behind Cloudflare or need wildcard certs

### SSL Certificates

Certificates are stored in `acme/acme.json` and automatically:
- Generated on first request
- Renewed before expiry
- Cached for subsequent requests

**Important:** The `acme/acme.json` file must have `600` permissions:
```bash
chmod 600 infrastructure/traefik/acme/acme.json
```

## Adding New Services

To expose a service through Traefik, add labels to your docker-compose service:

```yaml
services:
  myapp:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.myapp.rule=Host(`myapp.example.com`)"
      - "traefik.http.routers.myapp.entrypoints=websecure"
      - "traefik.http.routers.myapp.tls=true"
      - "traefik.http.routers.myapp.tls.certresolver=letsencrypt"
      - "traefik.http.services.myapp.loadbalancer.server.port=3000"
```

Replace:
- `myapp` with your service name
- `myapp.example.com` with your domain
- `3000` with your service's port
