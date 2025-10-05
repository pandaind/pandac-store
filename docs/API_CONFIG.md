# API Configuration Management

This document explains the centralized API configuration system implemented in Pandac Store.

## Overview

The application now uses a **single source of truth** for API configuration, eliminating the need to update multiple files when changing API endpoints.

## Problem Solved

**Before**: API URLs were scattered across multiple files:

- `.env` files
- Configuration files
- Component files
- API client files

**After**: Single configuration file that all others import from.

## Configuration Architecture

```text
🎯 SINGLE SOURCE: /src/config/api.js
├── API_BASE_URL = '/api/v1'    ← Only place to change!
├── API_TIMEOUT = 10000
└── All other API settings

📊 IMPORTS:
├── /src/config/index.js        ← Imports from api.js
├── /src/api/apiClient.js       ← Uses centralized config
└── All other components        ← Use centralized config
```

## Key Files

### Primary Configuration

**File**: `pandac-store-ui/src/config/api.js`

```javascript
/**
 * Single source of truth for API configuration
 * Change this ONE place to update all API URLs
 */

// API Base URL - This is the ONLY place to change API endpoint
export const API_BASE_URL = '/api/v1';

// API Timeout
export const API_TIMEOUT = 10000;

// Export for backwards compatibility
export const ENV = {
  API_BASE_URL,
  API_TIMEOUT,
};
```

### Main Configuration

**File**: `pandac-store-ui/src/config/index.js`

```javascript
// Import from single API config source
import { API_BASE_URL, API_TIMEOUT } from './api.js';

export const ENV = {
  API_BASE_URL,  // From single config source
  API_TIMEOUT,   // From single config source
  
  // Other configurations...
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Pandac Store',
  // ...
};
```

## Usage Examples

### In Components

```javascript
import { ENV } from '../config';

// Use centralized configuration
const response = await fetch(`${ENV.API_BASE_URL}/products`);
```

### In API Client

```javascript
import { API_BASE_URL, API_TIMEOUT } from '../config/api.js';

const apiClient = axios.create({
  baseURL: API_BASE_URL,  // From centralized config
  timeout: API_TIMEOUT,   // From centralized config
});
```

## Docker Build Integration

The configuration works with Docker builds through environment variables:

**Dockerfile**:
```dockerfile
# Set environment variables for build
ENV VITE_API_BASE_URL=/api/v1
ENV VITE_API_TIMEOUT=10000

# Build the application
RUN npm run build
```

This ensures the build process uses the correct configuration values.

## Making Changes

### To Change API Base URL

1. **Edit ONE file**: `pandac-store-ui/src/config/api.js`
   ```javascript
   export const API_BASE_URL = '/new-api/v1';  // Change here only!
   ```

2. **Rebuild frontend**:
   ```bash
   docker-compose build --no-cache frontend
   docker-compose restart frontend
   ```

3. **Done!** All API calls now use the new URL.

### To Add New API Configuration

1. **Add to api.js**:
   ```javascript
   export const API_BASE_URL = '/api/v1';
   export const API_TIMEOUT = 10000;
   export const API_RETRY_COUNT = 3;  // New setting
   ```

2. **Use in other files**:
   ```javascript
   import { API_RETRY_COUNT } from '../config/api.js';
   ```
