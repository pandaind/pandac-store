#!/bin/bash

# Token Verification Script

echo "🔍 Checking environment configuration..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run: cp .env.example .env"
    exit 1
fi

# Source the .env file
source .env

echo "📋 Checking required tokens..."

# Check JWT Secret
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "YOUR_SECURE_JWT_SECRET_KEY_HERE_MINIMUM_32_CHARS" ]; then
    echo "❌ JWT_SECRET is not set or using placeholder value"
    echo "   Please update your JWT secret in .env (minimum 32 characters)"
    MISSING_TOKENS=1
else
    if [ ${#JWT_SECRET} -lt 32 ]; then
        echo "⚠️  JWT_SECRET should be at least 32 characters long for security"
    else
        echo "✅ JWT_SECRET is configured"
    fi
fi

# Check Stripe API Key
if [ -z "$STRIPE_API_KEY" ] || [ "$STRIPE_API_KEY" = "sk_test_YOUR_STRIPE_SECRET_KEY_HERE" ]; then
    echo "❌ STRIPE_API_KEY is not set or using placeholder value"
    echo "   Please update your Stripe secret key in .env"
    MISSING_TOKENS=1
else
    if [[ $STRIPE_API_KEY == sk_test_* ]] || [[ $STRIPE_API_KEY == sk_live_* ]]; then
        echo "✅ STRIPE_API_KEY is configured"
    else
        echo "⚠️  STRIPE_API_KEY format might be incorrect (should start with sk_test_ or sk_live_)"
    fi
fi

# Check Stripe Publishable Key
if [ -z "$STRIPE_PUBLISHABLE_KEY" ] || [ "$STRIPE_PUBLISHABLE_KEY" = "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE" ]; then
    echo "❌ STRIPE_PUBLISHABLE_KEY is not set or using placeholder value"
    echo "   Please update your Stripe publishable key in .env"
    MISSING_TOKENS=1
else
    if [[ $STRIPE_PUBLISHABLE_KEY == pk_test_* ]] || [[ $STRIPE_PUBLISHABLE_KEY == pk_live_* ]]; then
        echo "✅ STRIPE_PUBLISHABLE_KEY is configured"
    else
        echo "⚠️  STRIPE_PUBLISHABLE_KEY format might be incorrect (should start with pk_test_ or pk_live_)"
    fi
fi

# Check frontend .env file
if [ -f "pandac-store-ui/.env" ]; then
    FRONTEND_STRIPE_KEY=$(grep "VITE_STRIPE_PUBLISHABLE_KEY" pandac-store-ui/.env | cut -d'=' -f2)
    if [ "$FRONTEND_STRIPE_KEY" = "pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE" ]; then
        echo "❌ Frontend VITE_STRIPE_PUBLISHABLE_KEY is using placeholder value"
        echo "   Please update pandac-store-ui/.env with your actual Stripe publishable key"
        MISSING_TOKENS=1
    else
        echo "✅ Frontend Stripe publishable key is configured"
    fi
else
    echo "⚠️  Frontend .env file not found at pandac-store-ui/.env"
    echo "   Copy from: cp pandac-store-ui/.env.example pandac-store-ui/.env"
fi

# Check GitHub Token
if [ -z "$GIT_TOKEN" ] || [ "$GIT_TOKEN" = "github_pat_YOUR_GITHUB_TOKEN_HERE" ]; then
    echo "❌ GIT_TOKEN is not set or using placeholder value"
    echo "   Please update your GitHub Personal Access Token in .env"
    MISSING_TOKENS=1
else
    if [[ $GIT_TOKEN == github_pat_* ]] || [[ $GIT_TOKEN == ghp_* ]]; then
        echo "✅ GIT_TOKEN is configured"
    else
        echo "⚠️  GIT_TOKEN format might be incorrect (should start with github_pat_ or ghp_)"
    fi
fi

# Check database passwords
if [ "$MYSQL_ROOT_PASSWORD" = "rootpassword" ]; then
    echo "⚠️  MYSQL_ROOT_PASSWORD is using default value (consider changing for production)"
fi

if [ "$MYSQL_PASSWORD" = "password" ]; then
    echo "⚠️  MYSQL_PASSWORD is using default value (consider changing for production)"
fi

echo ""

if [ -n "$MISSING_TOKENS" ]; then
    echo "❌ Some required tokens are missing or using placeholder values."
    echo "📖 Please see SECURITY.md for detailed setup instructions."
    echo ""
    echo "Quick setup:"
    echo "1. Get Stripe key: https://dashboard.stripe.com/apikeys"
    echo "2. Get GitHub token: https://github.com/settings/tokens"
    echo "3. Update your .env file with real values"
    exit 1
else
    echo "✅ All required tokens are configured!"
    echo "🚀 You can now run: ./setup.sh"
fi