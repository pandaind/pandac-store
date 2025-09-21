# Product Image Upload API with Git Repository & jsdelivr.net CDN

## Overview
The Product API now supports image upload when creating a new product. Images are uploaded directly to a Git repository and served via jsdelivr.net CDN for fast, global delivery. This approach provides:

- **Global CDN**: Images served via jsdelivr.net for fast worldwide access
- **Version Control**: All images are stored in Git with full version history
- **Cost Effective**: No additional storage costs, leverages Git repository storage
- **Reliability**: jsdelivr.net provides 99.9% uptime SLA

## API Endpoint

### Create Product with Image Upload

**POST** `/api/v1/products`

**Content-Type:** `multipart/form-data`

**Request Parameters:**
- `product` (required): JSON object containing product information
- `image` (optional): Image file to upload

**Example using curl:**
```bash
# Basic request with image upload
curl -X POST http://localhost:8080/api/v1/products \
  -F "product={\"name\":\"Sample Product\",\"description\":\"A sample product\",\"price\":29.99,\"popularity\":5};type=application/json" \
  -F "image=@/path/to/your/image.jpg"

# Request without image
curl -X POST http://localhost:8080/api/v1/products \
  -F "product={\"name\":\"Sample Product\",\"description\":\"A sample product\",\"price\":29.99,\"popularity\":5};type=application/json"

# With verbose output for debugging
curl -v -X POST http://localhost:8080/api/v1/products \
  -F "product={\"name\":\"Sample Product\",\"description\":\"A sample product\",\"price\":29.99,\"popularity\":5};type=application/json" \
  -F "image=@/path/to/your/image.jpg"
```

**Example using JavaScript/Fetch:**
```javascript
const formData = new FormData();

// Add product data as JSON
const productData = {
  name: "Sample Product",
  description: "A sample product",
  price: 29.99,
  popularity: 5
};
formData.append('product', new Blob([JSON.stringify(productData)], {type: 'application/json'}));

// Add image file
const imageFile = document.getElementById('imageInput').files[0];
if (imageFile) {
  formData.append('image', imageFile);
}

fetch('/api/v1/products', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## Configuration

### Required Git Repository Setup

1. **Create a Git Repository**: Create a public repository on GitHub for storing images
2. **Generate Personal Access Token**: Create a token with repository write permissions
3. **Configure Environment Variables**:

```bash
export GIT_REPO_URL="https://github.com/yourusername/your-images-repo.git"
export GIT_USERNAME="yourusername"
export GIT_TOKEN="your_personal_access_token"
export GIT_BRANCH="main"
export GIT_IMAGES_PATH="images"
```

### Application Configuration

Configure the following properties in `application.yml`:

```yaml
app:
  file:
    max-file-size: ${FILE_MAX_SIZE:10MB}
    max-request-size: ${FILE_MAX_REQUEST_SIZE:10MB}
  git:
    repository-url: ${GIT_REPO_URL:https://github.com/username/repo-name.git}
    username: ${GIT_USERNAME:your-username}
    token: ${GIT_TOKEN:your-personal-access-token}
    branch: ${GIT_BRANCH:main}
    images-path: ${GIT_IMAGES_PATH:images}
    cdn-base-url: ${CDN_BASE_URL:https://cdn.jsdelivr.net/gh}

spring:
  servlet:
    multipart:
      max-file-size: ${FILE_MAX_SIZE:10MB}
      max-request-size: ${FILE_MAX_REQUEST_SIZE:10MB}
```

## Features

1. **File Type Validation**: Only image files are accepted
2. **Unique File Names**: Each uploaded file gets a unique UUID-based name
3. **Git Integration**: Files are committed directly to the Git repository
4. **CDN URL Generation**: Returns jsdelivr.net CDN URLs for fast global access
5. **Error Handling**: Proper error responses for file upload failures
6. **Version Control**: All images are tracked in Git with commit history

## Response

**Success Response (201 Created):**
```json
{
  "productId": 1,
  "name": "Sample Product",
  "description": "A sample product",
  "price": 29.99,
  "popularity": 5,
  "imageUrl": "https://cdn.jsdelivr.net/gh/yourusername/your-images-repo@main/images/abc123-def456-ghi789.jpg",
  "createdAt": "2025-07-30T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "apiPath": "uri=/api/v1/products",
  "errorCode": "BAD_REQUEST",
  "errorMessage": "Only image files are allowed",
  "errorTime": "2025-07-30T10:30:00"
}
```

## CDN URL Format

Images are accessible via jsdelivr.net CDN with the following URL pattern:
```
https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{images-path}/{filename}
```

Example:
```
https://cdn.jsdelivr.net/gh/mycompany/product-images@main/images/550e8400-e29b-41d4-a716-446655440000.jpg
```

## GitHub API Integration

The service uses GitHub's Contents API to upload files:
- **Endpoint**: `https://api.github.com/repos/{owner}/{repo}/contents/{path}`
- **Method**: PUT
- **Authentication**: Personal Access Token
- **Content**: Base64 encoded file content

## Advantages

1. **Global CDN**: jsdelivr.net serves files from multiple global edge locations
2. **Free Hosting**: No additional costs for image storage and delivery
3. **Version Control**: Full Git history for all uploaded images
4. **High Availability**: jsdelivr.net provides enterprise-level uptime
5. **Easy Management**: Images can be managed through Git repository interface
6. **Backup**: All images are backed up in Git repository

## Security Considerations

1. **Repository Visibility**: Consider using a public repository for CDN access
2. **Token Security**: Store GitHub tokens securely using environment variables
3. **File Validation**: Only image files are accepted and validated
4. **Rate Limiting**: GitHub API has rate limits (5000 requests/hour for authenticated requests)

## Troubleshooting

### Common Issues

1. **403 Forbidden (Controller Level)**:
   - **Cause**: CSRF protection or Spring Security configuration
   - **Solution**: The API endpoints are configured to ignore CSRF tokens for `/api/v1/products/**`
   - **Verify**: Check that the request is going to the correct endpoint
   - **Debug**: Use `curl -v` to see detailed request/response headers

2. **401 Unauthorized (GitHub API)**: 
   - **Cause**: Invalid GitHub token or insufficient permissions
   - **Solution**: Check GitHub token permissions and validity

3. **404 Not Found**: 
   - **Cause**: Incorrect repository URL or path configuration
   - **Solution**: Verify repository URL and path configuration

4. **403 Forbidden (GitHub API)**: 
   - **Cause**: API rate limits or repository permissions
   - **Solution**: Check API rate limits or repository permissions

5. **File Not Found on CDN**: 
   - **Cause**: jsdelivr.net cache may take a few minutes to update
   - **Solution**: Wait a few minutes or check the GitHub repository directly

### API Testing Steps

1. **Test without image first**:
   ```bash
   curl -X POST http://localhost:8080/api/v1/products \
     -F "product={\"name\":\"Test Product\",\"description\":\"Test\",\"price\":10.00,\"popularity\":1};type=application/json"
   ```

2. **Test with image**:
   ```bash
   curl -X POST http://localhost:8080/api/v1/products \
     -F "product={\"name\":\"Test Product\",\"description\":\"Test\",\"price\":10.00,\"popularity\":1};type=application/json" \
     -F "image=@/path/to/your/image.jpg"
   ```

3. **Check application logs** for detailed error messages

### Security Configuration

The application is configured with:
- **CSRF Protection**: Disabled for API endpoints (`/api/v1/products/**`)
- **CORS**: Configured to allow multipart requests
- **Authentication**: Not required for product endpoints (public access)

### CDN Cache

- jsdelivr.net caches files for 12 hours by default
- To force cache refresh, you can use version queries or purge cache via jsdelivr.net API

## Production Recommendations

1. **Use Environment Variables**: Never commit tokens to version control
2. **Repository Organization**: Create a dedicated repository for images
3. **Monitoring**: Monitor GitHub API usage and jsdelivr.net availability
4. **Backup Strategy**: Consider additional backup solutions for critical images
5. **CDN Alternatives**: Have fallback CDN options for high-availability scenarios
