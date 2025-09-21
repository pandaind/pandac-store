# Security Configuration Guide

## ⚠️ IMPORTANT: Replace Default Tokens

This project contains sensitive API keys and tokens that must be configured properly before use.

### Required Environment Variables

Before running the application, you MUST update the following variables in your `.env` file:

#### 1. Stripe API Keys

**Backend Secret Key:**
```bash
# Replace with your actual Stripe secret key
STRIPE_API_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
```

**Frontend Publishable Key:**
```bash
# Replace with your actual Stripe publishable key
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE
```

**How to get your Stripe keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API keys
3. Copy your "Secret key" (starts with `sk_test_` for test mode) - **Backend only**
4. Copy your "Publishable key" (starts with `pk_test_` for test mode) - **Frontend safe**

**Important:** The publishable key is safe to expose in frontend code, but the secret key must remain on the backend only.

#### 2. GitHub Personal Access Token
```bash
# Replace with your actual GitHub Personal Access Token
GIT_TOKEN=github_pat_YOUR_GITHUB_TOKEN_HERE
```

**How to create a GitHub token:**
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. Select scopes: `repo` (for private repos) or `public_repo` (for public repos)
4. Copy the generated token

#### 3. Database Passwords
```bash
# Change these default passwords for production
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_app_password
```

### Files Secured

The following files have been updated to use environment variables instead of hardcoded values:

- ✅ `docker-compose.yml` - All credentials now use env vars
- ✅ `pandac-store-backend/src/main/resources/stripe.properties` - Stripe key secured
- ✅ `pandac-store-backend/src/main/resources/application.yml` - GitHub token secured
- ✅ `pandac-store-backend/src/main/resources/application-docker.yml` - All tokens secured

### Git Ignore Configuration

The following files are now ignored by Git to prevent accidental commits:

```gitignore
# In root .gitignore
.env
.env.*
secrets.env

# In backend .gitignore  
.env
.env.*

# In frontend .gitignore
.env
.env.*
```

### Security Best Practices

1. **Never commit `.env` files** - They are now in `.gitignore`
2. **Use different tokens for different environments** (dev, staging, prod)
3. **Rotate tokens regularly** - Especially if they might be compromised
4. **Use test keys for development** - Never use production Stripe keys in dev
5. **Limit token permissions** - Only grant necessary scopes to GitHub tokens

### Environment Setup Checklist

Before running the application:

- [ ] Copy `.env.example` to `.env`
- [ ] Copy `pandac-store-ui/.env.example` to `pandac-store-ui/.env`
- [ ] Replace `STRIPE_API_KEY` with your actual Stripe secret key (backend)
- [ ] Replace `STRIPE_PUBLISHABLE_KEY` with your actual Stripe publishable key (backend)
- [ ] Replace `VITE_STRIPE_PUBLISHABLE_KEY` with your actual Stripe publishable key (frontend)
- [ ] Replace `GIT_TOKEN` with your actual GitHub Personal Access Token  
- [ ] Update database passwords from defaults
- [ ] Verify `.env` files are in `.gitignore` and won't be committed
- [ ] Test that the application starts without errors

### Verification

To verify your tokens are working:

1. **Stripe**: The application should start without Stripe-related errors
2. **GitHub**: Check logs for successful CDN operations
3. **Database**: Application should connect and run Flyway migrations

### Troubleshooting

#### Common Issues:

1. **Invalid Stripe key**: Check the key starts with `sk_test_` or `sk_live_`
2. **Invalid GitHub token**: Verify token has correct permissions and isn't expired
3. **Database connection fails**: Check MySQL credentials and ensure container is running

#### Getting Help:

If you encounter issues:
1. Check Docker logs: `docker-compose logs -f`
2. Verify environment variables: `docker-compose config`
3. Test individual services: `docker-compose up mysql` then `docker-compose up backend`

---

## 🔒 Remember: Security is Everyone's Responsibility

- Keep your tokens private
- Don't share tokens in chat, email, or tickets
- Revoke tokens immediately if compromised
- Use different tokens for each environment