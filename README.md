# UI/UX Designer Portfolio API Documentation

Complete API documentation for the UI/UX Designer Portfolio application.

**Base URL:** `/api/v1`

---

## Table of Contents

- [Authentication](#authentication-endpoints)
- [Admin](#admin-endpoints)
- [User](#user-endpoints)
- [Customer](#customer-endpoints)
- [Category](#category-endpoints)
- [Design](#design-endpoints)
- [Pricing Plan](#pricing-plan-endpoints)
- [Purchase](#purchase-endpoints)
- [Review](#review-endpoints)
- [General Information](#general-information)

---

## Authentication Endpoints

### 1. Login

**POST** `/auth/login`

Login to the application.

**Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "email": "string (valid email, required)",
  "password": "string (min 6 characters, required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string"
    },
    "accessToken": "string"
  }
}
```

> **Note:** Refresh token is set in HTTP-only cookie

**Errors:**

- `400`: Validation error
- `401`: Invalid credentials
- `403`: Already logged in

---

### 2. Sign Up

**POST** `/auth/sign-up`

Register a new account (sends verification email).

**Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "name": "string (min 2 characters, required)",
  "email": "string (valid email, required)",
  "password": "string (min 6 characters, required)",
  "phone": "string (min 11 characters, optional)",
  "address": "string (min 5 characters, optional)",
  "profileImage": "string (optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "We have sent a verification link to your email please verify. This email valid just 5 minute!",
  "data": {
    "token": "string (only in development mode)"
  }
}
```

**Errors:**

- `400`: Validation error
- `409`: Email already exists
- `403`: Already logged in

---

### 3. Register User

**POST** `/auth/register-user`

Verify email and complete registration.

**Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "token": "string (verification token from email, required)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string"
    },
    "customer": {
      "id": "string",
      "userId": "string"
    },
    "accessToken": "string"
  }
}
```

> **Note:** Refresh token is set in HTTP-only cookie

**Errors:**

- `400`: Invalid or expired token
- `403`: Already logged in

---

### 4. Forget Password

**POST** `/auth/forget-password`

Send password reset link to email.

**Headers:**

- `Content-Type: application/json`

**Request Body:**

```json
{
  "email": "string (valid email, required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset link has been sent to your email.",
  "data": {
    "token": "string (only in development mode)"
  }
}
```

**Errors:**

- `400`: Validation error
- `404`: Email not found
- `403`: Already logged in

---

### 5. Reset Password

**POST** `/auth/reset-password`

Reset password using token from email.

**Headers:**

- `Content-Type: application/json`
- `Authorization: <RESET_TOKEN>`

**Request Body:**

```json
{
  "changedPassword": "string (min 6 characters, required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password reset successfully.",
  "data": {}
}
```

**Errors:**

- `400`: Validation error
- `401`: Invalid or expired token
- `403`: Already logged in

---

### 6. Change Password

**PATCH** `/auth/change-password`

Change password for logged-in user.

**Authentication:** Required (admin or customer)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Request Body:**

```json
{
  "currentPassword": "string (min 6 characters, required)",
  "newPassword": "string (min 6 characters, required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully.",
  "data": {}
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized / Invalid current password
- `403`: Forbidden

---

### 7. Get Access Token

**GET** `/auth/access-token`

Get new access token using refresh token.

**Authentication:** Refresh token in cookie

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "New access token generated successfully",
  "data": {
    "accessToken": "string"
  }
}
```

**Errors:**

- `401`: Invalid or expired refresh token
- `403`: Already logged out

---

### 8. Logout

**POST** `/auth/logout`

Logout from the application.

**Authentication:** Required (admin, customer, or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout successful",
  "data": {}
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Already logged out

---

## Admin Endpoints

### 1. Create Admin

**POST** `/admins/create-admin`

Create a new admin account.

**Authentication:** Required (superAdmin only)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Request Body:**

```json
{
  "name": "string (min 3 characters, required)",
  "email": "string (valid email, required)",
  "password": "string (min 6 characters, required)",
  "position": "Administrator | Manager (optional)",
  "profileImage": "string (valid URL, optional)",
  "phone": "string (min 11 characters, optional)",
  "address": "string (min 5 characters, optional)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Admin created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "position": "string",
    "role": "admin"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden (not superAdmin)
- `409`: Email already exists

---

### 2. Get All Admins

**GET** `/admins/`

Get all admins with pagination.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Query Parameters:**

- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Admins fetched successfully",
  "data": {
    "admins": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "position": "string",
        "role": "admin"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden

---

### 3. Get Single Admin

**GET** `/admins/:id`

Get a single admin by ID.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char admin ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Admins fetched successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "position": "string",
    "role": "admin"
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden
- `404`: Admin not found

---

### 4. Change Admin Position

**PATCH** `/admins/change-admin-position/:id`

Change admin position.

**Authentication:** Required (superAdmin only)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char admin ID)

**Request Body:**

```json
{
  "position": "Administrator | Manager (optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Admin updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "position": "string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden (not superAdmin)
- `404`: Admin not found

---

## User Endpoints

### 1. Get My Profile

**GET** `/users/me`

Get logged-in user's profile.

**Authentication:** Required (admin, customer, or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile fetched successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "phone": "string",
    "address": "string",
    "profileImage": "string"
  }
}
```

**Errors:**

- `401`: Unauthorized
- `404`: User not found

---

### 2. Get All Users

**GET** `/users/`

Get all users with pagination.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Query Parameters:**

- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)
- `role`: string (optional filter)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden

---

### 3. Get Single User

**GET** `/users/:id`

Get a single user by ID.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char user ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "phone": "string",
    "address": "string",
    "profileImage": "string"
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden
- `404`: User not found

---

### 4. Update User

**PATCH** `/users/:id`

Update user profile.

**Authentication:** Required (admin or customer)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char user ID)

**Request Body:**

```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "profileImage": "string (optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "profileImage": "string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: User not found

---

## Customer Endpoints

### 1. Get All Customers

**GET** `/customers/`

Get all customers with pagination.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Query Parameters:**

- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customers fetched successfully",
  "data": {
    "customers": [
      {
        "id": "string",
        "userId": "string",
        "name": "string",
        "email": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden

---

### 2. Get Single Customer

**GET** `/customers/:id`

Get a single customer by ID.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char customer ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customer fetched successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string"
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden
- `404`: Customer not found

---

## Category Endpoints

### 1. Create Category

**POST** `/categories/`

Create a new design category.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Request Body:**

```json
{
  "name": "string (min 2 characters, required)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `409`: Category name already exists

---

### 2. Get All Categories

**GET** `/categories/`

Get all categories with pagination.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Query Parameters:**

- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": "string",
        "name": "string",
        "createdAt": "ISO date string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden

---

### 3. Get Single Category

**GET** `/categories/get-single-category/:id`

Get a single category by ID.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char category ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category retrieved successfully",
  "data": {
    "id": "string",
    "name": "string",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden
- `404`: Category not found

---

### 4. Update Category

**PATCH** `/categories/:id`

Update category name.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char category ID)

**Request Body:**

```json
{
  "name": "string (min 2 characters, optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "updatedAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Category not found

---

## Design Endpoints

### 1. Create Design

**POST** `/designs/`

Create a new design.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Request Body:**

```json
{
  "title": "string (required)",
  "category": "string (24-char category ID, required)",
  "description": "string (min 10 characters, required)",
  "previewImageUrl": "string (valid URL, required)",
  "designerName": "string (required)",
  "usedTools": ["string", "string"],
  "effects": ["string"],
  "price": "number (non-negative, required)",
  "process": "string (min 5 characters, required)",
  "complexityLevel": "Basic | Intermediate | Advanced (required)",
  "tags": ["string"],
  "status": "Active | Draft | Archived (optional, default: Draft)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Design created successfully",
  "data": {
    "id": "string",
    "title": "string",
    "category": "string",
    "description": "string",
    "previewImageUrl": "string",
    "designerName": "string",
    "usedTools": ["string"],
    "effects": ["string"],
    "price": "number",
    "process": "string",
    "complexityLevel": "string",
    "tags": ["string"],
    "status": "string",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Category not found

---

### 2. Get All Designs

**GET** `/designs/`

Get all designs with pagination.

**Authentication:** None

**Query Parameters:**

- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Designs fetched successfully",
  "data": {
    "designs": [
      {
        "id": "string",
        "title": "string",
        "category": "string",
        "previewImageUrl": "string",
        "designerName": "string",
        "price": "number",
        "complexityLevel": "string",
        "status": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
}
```

---

### 3. Get Single Design

**GET** `/designs/get-single-design/:id`

Get a single design by ID.

**Authentication:** None

**Path Parameters:**

- `id`: string (24-char design ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Design fetched successfully",
  "data": {
    "id": "string",
    "title": "string",
    "category": {
      "id": "string",
      "name": "string"
    },
    "description": "string",
    "previewImageUrl": "string",
    "designerName": "string",
    "usedTools": ["string"],
    "effects": ["string"],
    "price": "number",
    "process": "string",
    "complexityLevel": "string",
    "tags": ["string"],
    "status": "string",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `404`: Design not found

---

### 4. Update Design

**PATCH** `/designs/:id`

Update design information.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char design ID)

**Request Body (all fields optional):**

```json
{
  "title": "string",
  "category": "string (24-char category ID)",
  "description": "string (min 10 characters)",
  "previewImageUrl": "string (valid URL)",
  "designerName": "string",
  "usedTools": ["string"],
  "effects": ["string"],
  "price": "number (non-negative)",
  "process": "string (min 5 characters)",
  "complexityLevel": "Basic | Intermediate | Advanced",
  "tags": ["string"],
  "status": "Active | Draft | Archived"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Design updated successfully",
  "data": {
    "id": "string",
    "title": "string",
    "updatedAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Design not found

---

### 5. Delete Design

**DELETE** `/designs/:id`

Delete a design.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char design ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Design with id {id} deleted successfully",
  "data": {}
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden
- `404`: Design not found

---

## Pricing Plan Endpoints

### 1. Create Pricing Plan

**POST** `/pricing-plans/`

Create a new pricing plan.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Request Body:**

```json
{
  "name": "Basic | Standard | Premium (required)",
  "price": "number (min 0, required)",
  "features": ["string"],
  "duration": "number (min 1, required)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Pricing plan created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "price": "number",
    "features": ["string"],
    "duration": "number",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `409`: Pricing plan already exists

---

### 2. Get All Pricing Plans

**GET** `/pricing-plans/`

Get all pricing plans.

**Authentication:** None

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pricing plans fetched successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "features": ["string"],
      "duration": "number"
    }
  ]
}
```

---

### 3. Get Single Pricing Plan

**GET** `/pricing-plans/:id`

Get a single pricing plan by ID.

**Authentication:** None

**Path Parameters:**

- `id`: string (24-char pricing plan ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pricing plan fetched successfully",
  "data": {
    "id": "string",
    "name": "string",
    "price": "number",
    "features": ["string"],
    "duration": "number",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `404`: Pricing plan not found

---

### 4. Update Pricing Plan

**PATCH** `/pricing-plans/:id`

Update pricing plan details.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char pricing plan ID)

**Request Body (all fields optional):**

```json
{
  "name": "Basic | Standard | Premium",
  "price": "number (min 0)",
  "features": ["string"],
  "duration": "number (min 1)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pricing plan updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "price": "number",
    "features": ["string"],
    "duration": "number",
    "updatedAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Pricing plan not found

---

## Purchase Endpoints

### 1. Create Purchase

**POST** `/purchase/`

Create a new purchase (buy a design with a pricing plan).

**Authentication:** Required (customer only)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Request Body:**

```json
{
  "design": "string (24-char design ID, required)",
  "pricingPlan": "string (24-char pricing plan ID, required)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Purchase created successfully",
  "data": {
    "id": "string",
    "customer": "string (customer ID)",
    "design": "string (design ID)",
    "pricingPlan": "string (pricing plan ID)",
    "totalAmount": "number",
    "paymentStatus": "Pending",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden (not a customer)
- `404`: Design or pricing plan not found

---

### 2. Get All My Purchases

**GET** `/purchase/get-all-my-purchase`

Get all purchases for the logged-in customer.

**Authentication:** Required (customer only)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Purchases fetched successfully",
  "data": [
    {
      "id": "string",
      "design": {
        "id": "string",
        "title": "string",
        "previewImageUrl": "string"
      },
      "pricingPlan": {
        "id": "string",
        "name": "string"
      },
      "totalAmount": "number",
      "paymentStatus": "string",
      "createdAt": "ISO date string"
    }
  ]
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden

---

### 3. Get All Purchases (Admin)

**GET** `/purchase/`

Get all purchases (admin view).

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Query Parameters:**

- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)
- `paymentStatus`: "Pending | Paid | Cancelled" (optional filter)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All purchases fetched successfully",
  "data": {
    "purchases": [
      {
        "id": "string",
        "customer": {
          "id": "string",
          "name": "string",
          "email": "string"
        },
        "design": {
          "id": "string",
          "title": "string"
        },
        "pricingPlan": {
          "id": "string",
          "name": "string"
        },
        "totalAmount": "number",
        "paymentStatus": "string",
        "createdAt": "ISO date string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden

---

### 4. Get Single Purchase

**GET** `/purchase/:id`

Get a single purchase by ID.

**Authentication:** Required (admin, customer, or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char purchase ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Purchase fetched successfully",
  "data": {
    "id": "string",
    "customer": {
      "id": "string",
      "name": "string",
      "email": "string"
    },
    "design": {
      "id": "string",
      "title": "string",
      "previewImageUrl": "string"
    },
    "pricingPlan": {
      "id": "string",
      "name": "string",
      "price": "number"
    },
    "totalAmount": "number",
    "paymentStatus": "string",
    "createdAt": "ISO date string"
  }
}
```

> **Note:** Customers can only view their own purchases

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden
- `404`: Purchase not found

---

### 5. Update Purchase (Payment Status)

**PATCH** `/purchase/:id`

Update purchase payment status.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char purchase ID)

**Request Body:**

```json
{
  "paymentStatus": "Paid | Cancelled (required)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Purchase updated successfully",
  "data": {
    "id": "string",
    "paymentStatus": "string",
    "updatedAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Purchase not found

---

### 6. Get Revenue

**GET** `/purchase/get-revenue`

Get total revenue from all purchases.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Revenue fetched successfully",
  "data": {
    "totalRevenue": "number",
    "paidPurchases": "number",
    "pendingPurchases": "number",
    "cancelledPurchases": "number"
  }
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden

---

## Review Endpoints

### 1. Create Review

**POST** `/reviews/`

Create a new review for a design.

**Authentication:** Required (customer only)

**Headers:**

- `Content-Type: application/json`
- `Authorization: <JWT_TOKEN>`

**Request Body:**

```json
{
  "design": "string (24-char design ID, required)",
  "rating": "number (1-5, required)",
  "comment": "string (optional)"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully",
  "data": {
    "id": "string",
    "reviewer": "string (user ID)",
    "design": "string (design ID)",
    "rating": "number",
    "comment": "string",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `400`: Validation error
- `401`: Unauthorized
- `403`: Forbidden (not a customer)
- `404`: Design not found

---

### 2. Get All Reviews for a Design

**GET** `/reviews/design-reviews/:id`

Get all reviews for a specific design.

**Authentication:** None

**Path Parameters:**

- `id`: string (24-char design ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Reviews fetched successfully",
  "data": [
    {
      "id": "string",
      "reviewer": {
        "id": "string",
        "name": "string",
        "profileImage": "string"
      },
      "design": "string (design ID)",
      "rating": "number",
      "comment": "string",
      "createdAt": "ISO date string"
    }
  ]
}
```

**Errors:**

- `404`: Design not found

---

### 3. Get Single Review

**GET** `/reviews/:id`

Get a single review by its ID.

**Authentication:** None

**Path Parameters:**

- `id`: string (24-char review ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Review fetched successfully",
  "data": {
    "id": "string",
    "reviewer": {
      "id": "string",
      "name": "string",
      "profileImage": "string"
    },
    "design": {
      "id": "string",
      "title": "string"
    },
    "rating": "number",
    "comment": "string",
    "createdAt": "ISO date string"
  }
}
```

**Errors:**

- `404`: Review not found

---

### 4. Delete Review

**DELETE** `/reviews/:id`

Delete a review by its ID.

**Authentication:** Required (admin or superAdmin)

**Headers:**

- `Authorization: <JWT_TOKEN>`

**Path Parameters:**

- `id`: string (24-char review ID)

**Success Response (200):**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Review deleted successfully",
  "data": {}
}
```

**Errors:**

- `401`: Unauthorized
- `403`: Forbidden (not admin/superAdmin)
- `404`: Review not found

---

## General Information

### Common HTTP Status Codes

- `200`: OK - Request successful
- `201`: Created - Resource created successfully
- `400`: Bad Request - Validation error or invalid input
- `401`: Unauthorized - Missing or invalid authentication token
- `403`: Forbidden - User doesn't have permission
- `404`: Not Found - Resource not found
- `409`: Conflict - Resource already exists (e.g., duplicate email)
- `500`: Internal Server Error - Server error

### Authentication

- **JWT (JSON Web Token)** is used for authentication
- Access tokens are sent in the Authorization header: `<token>`
- Refresh tokens are stored in HTTP-only cookies
- Tokens expire and need to be refreshed using `/auth/access-token` endpoint

### User Roles

- **superAdmin**: Full access to all endpoints
- **admin**: Can manage content, view customers and purchases
- **customer**: Can purchase designs, create reviews, view own purchases

### Error Response Format

```json
{
  "success": false,
  "statusCode": "<error_code>",
  "message": "<error_message>",
  "errorDetails": {
    "issues": [
      {
        "field": "string",
        "message": "string"
      }
    ]
  }
}
```

### Success Response Format

```json
{
  "success": true,
  "statusCode": "<status_code>",
  "message": "<success_message>",
  "data": "<response_data>"
}
```

### Pagination

- Most list endpoints support pagination via query parameters
- Default: `page=1`, `limit=10`
- Response includes pagination metadata (page, limit, total)

### Notes

- All endpoints are prefixed with `/api/v1`
- All date/time values are in ISO 8601 format
- MongoDB ObjectID format: 24 hexadecimal characters
- File uploads (images) should be handled separately (not documented here)
- Some endpoints may require additional business logic validation

---

## License

This API documentation is for the UI/UX Designer Portfolio project.

---

**Last Updated:** October 15, 2025
