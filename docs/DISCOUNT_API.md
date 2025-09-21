# Discount API Documentation

This document describes the complete CRUD operations available for the Discount management system.

## Base URL
```
http://localhost:8080/api/v1/discount
```

## API Endpoints

### 1. Get All Discounts
**GET** `/api/v1/discount`

Returns a list of all available discounts.

**Response Example:**
```json
[
  {
    "code": "FLAT10",
    "discount": 10,
    "type": "FIXED"
  },
  {
    "code": "PANDAC50",
    "discount": 50,
    "type": "PERCENTAGE"
  }
]
```

### 2. Get Discount by Code
**GET** `/api/v1/discount/{code}`

Returns a specific discount by its code.

**Path Parameters:**
- `code` (string): The discount code

**Response Example:**
```json
{
  "code": "PANDAC50",
  "discount": 50,
  "type": "PERCENTAGE"
}
```

**Error Response (404):**
```json
{
  "timestamp": "2025-07-31T23:15:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Discount not found",
  "path": "/api/v1/discount/INVALID"
}
```

### 3. Create New Discount
**POST** `/api/v1/discount`

Creates a new discount.

**Request Headers:**
- `Content-Type: application/json`
- `X-XSRF-TOKEN: {csrf-token}` (Required for CSRF protection)

**Request Body:**
```json
{
  "code": "NEWUSER15",
  "discount": 15,
  "type": "PERCENTAGE"
}
```

**Response (201 Created):**
```json
{
  "code": "NEWUSER15",
  "discount": 15,
  "type": "PERCENTAGE"
}
```

**Validation Rules:**
- `code`: Required, non-empty string, must be unique
- `discount`: Required, positive integer
- `type`: Required, must be either "PERCENTAGE" or "FIXED"

### 4. Update Discount
**PUT** `/api/v1/discount/{code}`

Updates an existing discount.

**Path Parameters:**
- `code` (string): The discount code to update

**Request Headers:**
- `Content-Type: application/json`
- `X-XSRF-TOKEN: {csrf-token}` (Required for CSRF protection)

**Request Body:**
```json
{
  "discount": 25,
  "type": "PERCENTAGE"
}
```

**Response (200 OK):**
```json
{
  "code": "NEWUSER15",
  "discount": 25,
  "type": "PERCENTAGE"
}
```

**Error Response (404):**
```json
{
  "timestamp": "2025-07-31T23:15:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Discount not found",
  "path": "/api/v1/discount/INVALID"
}
```

### 5. Delete Discount
**DELETE** `/api/v1/discount/{code}`

Deletes a discount by its code.

**Path Parameters:**
- `code` (string): The discount code to delete

**Request Headers:**
- `X-XSRF-TOKEN: {csrf-token}` (Required for CSRF protection)

**Response (204 No Content):** Empty body

**Error Response (404):**
```json
{
  "timestamp": "2025-07-31T23:15:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Discount not found",
  "path": "/api/v1/discount/INVALID"
}
```

### 6. Validate Discount
**GET** `/api/v1/discount/{code}/validate`

Validates if a discount code exists and is applicable.

**Path Parameters:**
- `code` (string): The discount code to validate

**Response Example:**
```json
true
```

**Response for Invalid Code:**
```json
false
```

### 7. Calculate Final Price
**POST** `/api/v1/discount/calculate`

Calculates the final price after applying a discount.

**Query Parameters:**
- `originalPrice` (double): The original price before discount

**Request Headers:**
- `Content-Type: application/json`
- `X-XSRF-TOKEN: {csrf-token}` (Required for CSRF protection)

**Request Body:**
```json
{
  "code": "PANDAC50",
  "discount": 50,
  "type": "PERCENTAGE"
}
```

**Response Example:**
```json
50.0
```

## CSRF Protection

All write operations (POST, PUT, DELETE) require CSRF protection. To get a CSRF token:

**GET** `/api/v1/csrf-token`

**Response:**
```json
{
  "parameterName": "_csrf",
  "token": "2f95719f-0038-424f-9e64-ccd3a9ce2aad",
  "headerName": "X-XSRF-TOKEN"
}
```

Use the token value in the `X-XSRF-TOKEN` header for all write operations.

## Discount Types

- **PERCENTAGE**: Discount value represents a percentage (e.g., 25 means 25%)
- **FIXED**: Discount value represents a fixed amount (e.g., 10 means $10 off)

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: OK - Successful GET/PUT requests
- `201`: Created - Successful POST requests
- `204`: No Content - Successful DELETE requests
- `400`: Bad Request - Invalid request data
- `403`: Forbidden - CSRF token missing or invalid
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server error

## Example Usage with cURL

### Get CSRF Token
```bash
curl -c cookies.txt -b cookies.txt -X GET http://localhost:8080/api/v1/csrf-token
```

### Create Discount
```bash
curl -c cookies.txt -b cookies.txt -X POST http://localhost:8080/api/v1/discount \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: {token}" \
  -d '{"code":"SAVE20","discount":20,"type":"PERCENTAGE"}'
```

### Update Discount
```bash
curl -c cookies.txt -b cookies.txt -X PUT http://localhost:8080/api/v1/discount/SAVE20 \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: {token}" \
  -d '{"discount":30,"type":"PERCENTAGE"}'
```

### Delete Discount
```bash
curl -c cookies.txt -b cookies.txt -X DELETE http://localhost:8080/api/v1/discount/SAVE20 \
  -H "X-XSRF-TOKEN: {token}"
```
