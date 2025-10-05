# Nginx Reverse Proxy Configuration

This document explains the nginx reverse proxy setup that serves as the single entry point for the Pandac Store application.

## Architecture Overview

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Client      │    │  Nginx Proxy    │    │    Backend      │    │    Database     │
│   (Browser)     │────│  (Port: 80)     │────│  (Spring Boot)  │────│     (MySQL)     │
│                 │    │                 │    │   Internal      │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              │
                    ┌─────────────────┐
                    │   Frontend      │
                    │   (React/Nginx) │
                    │   Internal      │
                    └─────────────────┘
```

## Key Benefits

- **Single Entry Point**: All traffic flows through port 80
- **CORS Resolution**: Eliminates cross-origin request issues
- **Better Performance**: Optimized static file serving
- **Production Ready**: Industry-standard reverse proxy architecture
- **Security**: Backend services not directly exposed

## Configuration Files

### nginx/nginx.conf

The main configuration file that defines:

- **Static File Serving**: React frontend files served directly
- **API Proxying**: `/api/` requests forwarded to backend
- **CORS Headers**: Proper cross-origin headers added
- **Security Headers**: Production-ready security configuration

### nginx/Dockerfile

Simple Alpine-based nginx container with custom configuration.

## Routing Rules

| Request Path | Destination | Purpose |
|-------------|-------------|---------|
| `/` | Frontend static files | Serve React application |
| `/api/` | Backend (port 8080) | API endpoints |
| `/static/` | Frontend static files | Assets and resources |

## CORS Configuration

The nginx proxy automatically adds these CORS headers:

```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
add_header Access-Control-Allow-Headers 'Content-Type, Authorization';
```

## Frontend API Configuration

With the nginx proxy, the frontend uses relative API URLs:

```javascript
// pandac-store-ui/src/config/api.js
export const API_BASE_URL = '/api/v1';  // Works through nginx proxy
```

This eliminates the need for:
- CORS configuration in Spring Boot
- Environment variables for API URLs  
- Different URLs for development vs production

## Testing the Proxy

```bash
# Test main application
curl -I http://localhost

# Test API endpoint
curl http://localhost/api/v1/products

# Test with CORS headers
curl -H "Origin: http://localhost" -I http://localhost/api/v1/products
```

## Troubleshooting

### Nginx Not Starting

1. Check port 80 availability:
   ```bash
   lsof -i :80
   ```

2. Check nginx logs:
   ```bash
   docker-compose logs nginx
   ```

### API Requests Failing

1. Verify backend is running:
   ```bash
   docker-compose ps backend
   ```

2. Test direct backend connection (internal):
   ```bash
   docker exec pandac-nginx curl http://backend:8080/api/v1/actuator/health
   ```

### CORS Issues

The nginx proxy should eliminate CORS issues. If you still see CORS errors:

1. Verify requests are going through nginx (port 80)
2. Check browser developer tools for actual request URLs
3. Ensure frontend is using relative URLs (`/api/v1` not `http://localhost:8080/api/v1`)

## Production Considerations

For production deployment, consider:

- **SSL/TLS**: Add HTTPS configuration
- **Domain Configuration**: Update server_name directive
- **Rate Limiting**: Add rate limiting rules
- **Logging**: Configure access and error logs
- **Gzip Compression**: Already enabled for better performance
- **Security Headers**: Already configured for basic security

## Configuration Updates

To modify the nginx configuration:

1. Edit `nginx/nginx.conf`
2. Rebuild the nginx container:
   ```bash
   docker-compose build --no-cache nginx
   docker-compose restart nginx
   ```

## Monitoring

Check nginx status and metrics:

```bash
# Service status
docker-compose ps nginx

# Resource usage
docker stats pandac-nginx

# Access logs
docker-compose logs -f nginx
```