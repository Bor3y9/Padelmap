# JOI Validation System

This document describes the comprehensive validation system implemented using JOI for the Padelmap API.

## Overview

The validation system includes:

- **Input validation** using JOI schemas
- **Error handling middleware** for consistent error responses
- **Type-safe validation** integrated with TypeScript interfaces
- **Custom error messages** for better user experience

## Validation Schemas

### Club Validation

#### Creation Schema (`clubCreationSchema`)

- **name**: Required string, 2-100 characters, trimmed
- **location**: Required string, 5-200 characters, trimmed
- **contact.phone**: Required string, valid phone number format
- **contact.email**: Optional string, valid email format

#### Update Schema (`clubUpdateSchema`)

- All fields are optional
- Same validation rules as creation schema when provided

### Court Validation

#### Creation Schema (`courtCreationSchema`)

- **name**: Required string, 2-100 characters, trimmed
- **openingHours.start**: Required string, HH:MM format (24-hour)
- **openingHours.end**: Required string, HH:MM format (24-hour)
- **pricePerHour**: Required positive number with 2 decimal precision
- **club**: Required string, valid MongoDB ObjectId
- **status**: Optional string, must be valid CourtStatus enum value

#### Update Schema (`courtUpdateSchema`)

- All fields are optional
- Same validation rules as creation schema when provided
- Custom validation ensures end time is after start time

### Common Schemas

#### MongoDB ID Schema (`mongoIdSchema`)

- **id**: Required string, valid MongoDB ObjectId format (24 hex characters)

## Usage in Controllers

### Applying Validation Middleware

```typescript
import { validateRequest } from "../middlewares/validation.middleware";
import { clubCreationSchema, mongoIdSchema } from "../common/validation";

// Single validation (body)
router.post("/", validateRequest(clubCreationSchema, "body"), this.postCreate);

// Single validation (params)
router.get("/:id", validateRequest(mongoIdSchema, "params"), this.getById);

// Multiple validations
router.patch(
  "/:id",
  validateRequest(mongoIdSchema, "params"),
  validateRequest(clubUpdateSchema, "body"),
  this.patchUpdate
);
```

### Validation Properties

- **body**: Validates request body (for POST/PATCH)
- **params**: Validates URL parameters (for GET/:id, PATCH/:id, DELETE/:id)
- **query**: Validates query parameters (for filtering, pagination)

## Error Handling

### Error Response Format

All validation errors return a consistent format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "message": "Club name is required",
      "field": "name"
    },
    {
      "message": "Email must be a valid email address",
      "field": "contact.email"
    }
  ]
}
```

### Error Types Handled

1. **Validation Errors**: JOI validation failures
2. **MongoDB Errors**:
   - CastError (invalid ObjectId)
   - ValidationError (schema validation)
   - Duplicate key errors (unique constraints)
3. **Authentication Errors**: JWT errors (for future implementation)
4. **Generic Errors**: Unhandled server errors

## Custom Validation Rules

### Phone Number Validation

- Pattern: `/^[\+]?[1-9][\d]{0,15}$/`
- Allows optional country code prefix
- 1-16 digits total

### Time Validation

- Pattern: `/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/`
- 24-hour format (HH:MM)
- Custom rule ensures end time > start time

### ObjectId Validation

- Pattern: `/^[0-9a-fA-F]{24}$/`
- Validates MongoDB ObjectId format

## Configuration Options

### JOI Validation Options

```typescript
{
  abortEarly: false,     // Include all errors
  allowUnknown: false,   // Don't allow extra fields
  stripUnknown: true,    // Remove unknown fields
}
```

## File Structure

```
src/
├── common/
│   ├── validation/
│   │   ├── club.validation.ts      # Club validation schemas
│   │   ├── court.validation.ts     # Court validation schemas
│   │   └── index.ts                # Export all schemas
│   └── enums/
│       └── http-status-code.enum.ts # Enhanced HTTP status codes
├── middlewares/
│   ├── validation.middleware.ts     # Validation middleware
│   └── error-handler.ts            # Error handling middleware
└── controllers/
    ├── club.controller.ts          # Club routes with validation
    └── court.controller.ts         # Court routes with validation
```

## Example API Calls

### Valid Club Creation

```bash
POST /api/v1/clubs
{
  "name": "Padel Club Barcelona",
  "location": "Barcelona, Spain",
  "contact": {
    "phone": "+34612345678",
    "email": "info@padelclub.com"
  }
}
```

### Invalid Club Creation (validation errors)

```bash
POST /api/v1/clubs
{
  "name": "A",
  "location": "BCN",
  "contact": {
    "phone": "invalid-phone",
    "email": "not-an-email"
  }
}
```

Response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "message": "Club name must be at least 2 characters long",
      "field": "name"
    },
    {
      "message": "Location must be at least 5 characters long",
      "field": "location"
    },
    {
      "message": "Phone number must be a valid format",
      "field": "contact.phone"
    },
    {
      "message": "Email must be a valid email address",
      "field": "contact.email"
    }
  ]
}
```

## Benefits

1. **Type Safety**: Full TypeScript integration
2. **Consistent Errors**: Standardized error format across all endpoints
3. **Input Sanitization**: Automatic trimming and unknown field removal
4. **Comprehensive Validation**: Covers all data types and business rules
5. **Maintainable**: Centralized validation logic
6. **Extensible**: Easy to add new validation rules and schemas
