# Using This Template

Complete guide for cloning, customizing, and deploying this turborepo template.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Customization Checklist](#customization-checklist)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [DNS Configuration](#dns-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Node.js** 20+ and **pnpm** 9+
- **Docker** and **Docker Compose** (for containerization)
- A domain name (for production deployment)
- A server/VPS (if self-hosting)

### Clone the Template

**Option 1: GitHub Template Repository**
1. Click "Use this template" button
2. Name your new repository
3. Clone your new repo:
```bash
git clone https://github.com/yourusername/your-new-repo.git
cd your-new-repo
```

**Option 2: Manual Clone**
```bash
git clone https://github.com/yourusername/turborepo-template.git my-project
cd my-project
rm -rf .git
git init
git add .
git commit -m "Initial commit from turborepo-template"
```

---

## Customization Checklist

After cloning, customize these files for your project:

### 1. Update Project Metadata

**`package.json` (root)**
```json
{
  "name": "your-project-name",
  "description": "Your project description",
  // ... update other fields
}
```

**`apps/web/package.json`**
```json
{
  "name": "@your-org/web",
  // ... update other fields
}
```

**`apps/api/package.json`**
```json
{
  "name": "@your-org/api",
  // ... update other fields
}
```

### 2. Update Package Scopes (Optional)

If you want to rename `@repo/*` to `@your-org/*`:

1. Find and replace `@repo/` with `@your-org/` in:
   - All `package.json` files (in `packages/*` and `apps/*`)
   - All `import` statements in code

2. Update `pnpm-workspace.yaml` if needed (usually no changes required)

### 3. Configure Environment Variables

**For local development:**
```bash
cp .env.local.example .env.local
nano .env.local  # Update with your local settings
```

**For production:**
```bash
cp .env.example .env
nano .env
```

Update these critical values:
- `API_DOMAIN` - Your API domain (e.g., `api.example.com`)
- `WEB_DOMAIN` - Your web domain (e.g., `example.com`)
- `POSTGRES_PASSWORD` - Strong password (use `openssl rand -base64 32`)
- `OPENAI_API_KEY` - If using OpenAI
- Other service credentials

### 4. Configure Traefik Email

Edit `infrastructure/traefik/traefik.yml`:
```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com  # ⚠️ CHANGE THIS
```

This email is used by Let's Encrypt for SSL certificate notifications.

### 5. Update GitHub Actions (Optional)

If you want automated deployments, see `.github/workflows/ci.yml`.

---

## Local Development

### Setup

```bash
# Install dependencies
pnpm install

# Copy local environment
cp .env.local.example .env.local

# Start development servers
pnpm dev
```

This starts:
- **API**: http://localhost:4000
- **Web**: http://localhost:3000

### Development with Docker (Optional)

To test the full containerized stack locally:

```bash
# Create environment file
cp .env.local.example .env.local

# Start only database
docker compose up -d postgres

# Update DATABASE_URL in .env.local to use docker postgres:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/monorepo_dev"

# Start apps normally
pnpm dev
```

Or start everything in Docker:
```bash
docker compose up -d
```

**Note:** Local Docker won't have SSL. Access via `http://localhost:4000` and `http://localhost:3000`.

---

## Production Deployment

### Prerequisites

1. **Server Requirements**
   - Ubuntu 22.04+ / Debian 12+ (recommended)
   - 2GB RAM minimum (4GB recommended)
   - Ports 80 and 443 open
   - Docker and Docker Compose installed

2. **Domain Setup**
   - Domain purchased and DNS accessible
   - Ability to create A records

### Step 1: Install Docker on Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt update
sudo apt install docker-compose-plugin -y

# Add user to docker group (optional, avoids sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

### Step 2: Clone Your Repository on Server

```bash
# Clone to /opt or your preferred location
cd /opt
sudo git clone https://github.com/yourusername/your-repo.git
sudo chown -R $USER:$USER your-repo
cd your-repo
```

### Step 3: Configure Environment

```bash
# Copy production env template
cp .env.example .env
nano .env
```

**Critical settings to update:**
```bash
# Domains (⚠️ MUST MATCH YOUR DNS)
API_DOMAIN="api.yourdomain.com"
WEB_DOMAIN="yourdomain.com"

# Database
POSTGRES_PASSWORD="$(openssl rand -base64 32)"
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@postgres:5432/monorepo"

# API Secrets
JWT_SECRET="$(openssl rand -base64 32)"

# External services (if needed)
OPENAI_API_KEY="sk-..."
SUPABASE_URL="https://..."
```

### Step 4: Configure Traefik

Update email in `infrastructure/traefik/traefik.yml`:
```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com  # ⚠️ CHANGE THIS
```

Create SSL certificate storage:
```bash
touch infrastructure/traefik/acme/acme.json
chmod 600 infrastructure/traefik/acme/acme.json
```

### Step 5: Configure DNS (See DNS Configuration section below)

**IMPORTANT:** Configure DNS **before** starting Docker. Let's Encrypt needs to verify domain ownership.

### Step 6: Deploy

```bash
# Build and start all services
docker compose up -d

# Watch logs (Ctrl+C to exit)
docker compose logs -f

# Check Traefik logs for SSL cert generation
docker compose logs traefik | grep -i acme
```

### Step 7: Verify Deployment

```bash
# Check all containers running
docker compose ps

# Should show:
# - turborepo-traefik (healthy)
# - turborepo-postgres (healthy)
# - turborepo-api (healthy)
# - turborepo-web (healthy)

# Test endpoints
curl -I https://api.yourdomain.com/health
curl -I https://yourdomain.com

# Both should return 200 OK with valid SSL
```

### Step 8: Monitor Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f traefik

# Last 100 lines
docker compose logs --tail 100 api
```

---

## DNS Configuration

Configure DNS records **before deploying**. Let's Encrypt needs to verify domain ownership via HTTP challenge.

### Required DNS Records

```
Type   Name                 Value               TTL
─────────────────────────────────────────────────────
A      yourdomain.com       your.server.ip      300
A      www.yourdomain.com   your.server.ip      300
A      api.yourdomain.com   your.server.ip      300
```

### DNS Provider Examples

**Cloudflare:**
1. Log in to Cloudflare dashboard
2. Select your domain
3. Go to DNS → Records
4. Add A records as shown above
5. **Important:** Set Proxy status to "DNS only" (gray cloud) initially
   - After SSL works, you can enable proxy (orange cloud)

**Namecheap:**
1. Log in to Namecheap
2. Domain List → Manage → Advanced DNS
3. Add A records with Host: `@`, `www`, `api`

**Google Domains:**
1. Log in to Google Domains
2. DNS → Manage custom records
3. Add A records with hostname and server IP

### DNS Propagation

After adding records:
```bash
# Check DNS propagation (from your local machine)
nslookup api.yourdomain.com
nslookup yourdomain.com

# Should return your server IP
```

DNS propagation can take 5-60 minutes. Use https://dnschecker.org to verify.

---

## Troubleshooting

### SSL Certificates Not Generating

**Symptoms:**
- Browser shows "connection not secure"
- `curl` shows certificate errors

**Check Traefik logs:**
```bash
docker compose logs traefik | grep -i "acme\|error"
```

**Common issues:**

1. **DNS not propagated**
   ```bash
   # Verify DNS from server
   nslookup api.yourdomain.com
   ```
   Wait 5-10 minutes if incorrect.

2. **Ports 80/443 blocked**
   ```bash
   # Check firewall
   sudo ufw status
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

3. **acme.json permissions**
   ```bash
   ls -la infrastructure/traefik/acme/acme.json
   # Should be: -rw------- (600)
   chmod 600 infrastructure/traefik/acme/acme.json
   ```

4. **Email not updated in traefik.yml**
   - Edit `infrastructure/traefik/traefik.yml`
   - Change email, restart: `docker compose restart traefik`

### Container Keeps Restarting

```bash
# Check logs for the failing container
docker compose logs api

# Common issues:
# - Missing env vars (check .env file)
# - Database connection failed (check DATABASE_URL)
# - Port conflicts (stop other services on same ports)
```

### Database Connection Errors

```bash
# Check postgres is running
docker compose ps postgres

# Check logs
docker compose logs postgres

# Verify DATABASE_URL in .env matches:
# postgresql://POSTGRES_USER:POSTGRES_PASSWORD@postgres:5432/POSTGRES_DB

# Test connection from API container
docker compose exec api sh
wget -qO- postgres:5432  # Should connect
```

### "Network proxy declared as external"

If you see this error:
```bash
docker network create proxy
docker network create internal
docker compose up -d
```

### Updating After Deployment

```bash
# Pull latest code
cd /opt/your-repo
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Or rebuild specific service
docker compose up -d --build api
```

### Rolling Back

If something breaks:
```bash
# Stop new services
docker compose down

# Check out previous commit
git log --oneline  # Find previous working commit
git checkout <commit-hash>

# Restart
docker compose up -d
```

### Viewing Container Stats

```bash
# Resource usage
docker stats

# Disk usage
docker system df

# Clean up old images/containers
docker system prune -a
```

---

## Next Steps

After successful deployment:

1. **Set up automated deployments** (optional but recommended)
   - See [Deployment Automation Guide](./deployment-automation.md)
   - Enable GitHub Actions workflow for auto-deploy on push
   - Backup & health checks included

2. **Add monitoring** (optional)
   - Sentry for error tracking
   - Grafana for metrics
   - Uptime monitoring (UptimeRobot, etc.)

3. **Database backups** (recommended)
   ```bash
   # Manual backup
   docker compose exec postgres pg_dump -U postgres monorepo > backup.sql

   # Restore
   docker compose exec -T postgres psql -U postgres monorepo < backup.sql
   ```

4. **SSL certificate monitoring**
   - Let's Encrypt certs auto-renew
   - Check expiry: `docker compose logs traefik | grep -i "renew"`

5. **Security hardening**
   - Change default passwords
   - Enable firewall (ufw)
   - Regular updates: `apt update && apt upgrade`

---

## Support

- **Issues:** Open an issue on GitHub
- **Documentation:** See `/docs` directory
- **Testing:** See `TESTING.md` for local testing guide

---

**Template Version:** 1.0.0  
**Last Updated:** June 2026
