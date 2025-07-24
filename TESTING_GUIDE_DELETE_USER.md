# Delete User Functionality - Comprehensive Testing Guide

## Overview
This guide provides extensive testing scenarios for the newly implemented delete user functionality, which includes two endpoints with different security levels matching the .NET codebase patterns.

## API Endpoints to Test

### 1. Delete User by ID
- **Endpoint**: `DELETE /api/users/delete/:id`
- **Authentication**: None required (matches .NET pattern)
- **Parameters**: User ID in URL path
- **Use Case**: Admin/system-level deletion

### 2. Delete User by Email (Self-Service)
- **Endpoint**: `DELETE /api/users/confirmdeletemyaccount`
- **Authentication**: Token-based validation required
- **Parameters**: Email and token in request body
- **Use Case**: User-initiated account deletion with email verification

## Test Environment Setup

### Prerequisites
1. MongoDB instance running
2. Node.js server started (`npm run dev`)
3. API testing tool (Postman, Thunder Client, or curl)
4. Valid test users in the database

### Sample Test Data
```json
{
  "testUser1": {
    "id": "507f1f77bcf86cd799439011",
    "email": "testuser1@example.com",
    "username": "testuser1"
  },
  "testUser2": {
    "id": "507f1f77bcf86cd799439012", 
    "email": "testuser2@example.com",
    "username": "testuser2"
  }
}
```

## Test Scenarios

### A. Delete User by ID Tests

#### A1. Happy Path - Valid ID
```http
DELETE /api/users/delete/507f1f77bcf86cd799439011
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Successful",
  "data": true
}
```

#### A2. Invalid ID Format
```http
DELETE /api/users/delete/invalid-id-format
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "data": null
}
```

#### A3. Empty/Missing ID
```http
DELETE /api/users/delete/
DELETE /api/users/delete/   
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "User ID is required",
  "data": null
}
```

#### A4. Non-existent User ID
```http
DELETE /api/users/delete/507f1f77bcf86cd799999999
```

**Expected Response:**
```json
{
  "statusCode": 422,
  "message": "User does not exist",
  "data": null
}
```

### B. Delete User by Email Tests

#### B1. Happy Path - Valid Email and Token
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "email": "testuser2@example.com",
  "token": "valid-verification-token-123"
}
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Successful", 
  "data": true
}
```

#### B2. Missing Email
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "token": "valid-verification-token-123"
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Email is required",
  "data": null
}
```

#### B3. Empty Email
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "email": "",
  "token": "valid-verification-token-123"
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Email is required",
  "data": null
}
```

#### B4. Missing Token
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "email": "testuser2@example.com"
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Token is required",
  "data": null
}
```

#### B5. Empty Token
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "email": "testuser2@example.com",
  "token": ""
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Token is required",
  "data": null
}
```

#### B6. Invalid Email Format
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "email": "invalid-email",
  "token": "valid-verification-token-123"
}
```

**Expected Response:**
```json
{
  "statusCode": 422,
  "message": "User does not exist",
  "data": null
}
```

#### B7. Non-existent Email
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "email": "nonexistent@example.com",
  "token": "valid-verification-token-123"
}
```

**Expected Response:**
```json
{
  "statusCode": 422,
  "message": "User does not exist",
  "data": null
}
```

#### B8. Malformed Request Body
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "invalidField": "value"
}
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Email is required",
  "data": null
}
```

## Advanced Test Scenarios

### C. Database Integration Tests

#### C1. Verify User Actually Deleted
1. Create a test user
2. Delete the user via API
3. Attempt to find the user in database
4. Confirm user no longer exists

#### C2. Delete Same User Twice
1. Delete a user successfully
2. Attempt to delete the same user again
3. Verify appropriate error response

#### C3. Case Sensitivity Testing
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "email": "TestUser@EXAMPLE.COM",
  "token": "valid-token"
}
```
*Should work if user exists with email "testuser@example.com"*

### D. Load Testing Scenarios

#### D1. Concurrent Deletion Attempts
- Send multiple simultaneous delete requests for the same user
- Verify only one succeeds, others return appropriate errors

#### D2. Rapid Sequential Requests
- Send delete requests rapidly in sequence
- Verify system handles race conditions properly

### E. Security Testing

#### E1. SQL Injection Attempts (MongoDB Injection)
```http
DELETE /api/users/delete/{"$ne": null}
```

#### E2. Token Validation Security
```http
DELETE /api/users/confirmdeletemyaccount
Content-Type: application/json

{
  "email": "testuser@example.com",
  "token": "malicious-token-attempt"
}
```

## Error Response Validation

### Expected Error Structure
All error responses should follow this format:
```json
{
  "statusCode": number,
  "message": string,
  "data": null,
  "exceptionErrorMessage"?: string  // Only for 500 errors
}
```

### Status Code Mapping
- `200`: Successful deletion
- `400`: Bad Request (missing/invalid parameters)
- `422`: Unprocessable Entity (user not found, business logic errors)
- `500`: Internal Server Error (unexpected exceptions)

## Testing Checklist

### Pre-Testing Setup
- [ ] MongoDB connection established
- [ ] Server running on correct port
- [ ] Test users exist in database
- [ ] API routes properly configured

### Basic Functionality
- [ ] Delete by ID - Happy path
- [ ] Delete by Email - Happy path
- [ ] Delete by ID - Invalid ID
- [ ] Delete by Email - Missing token
- [ ] Delete by Email - Invalid email

### Edge Cases
- [ ] Empty string parameters
- [ ] Null parameters
- [ ] Very long strings
- [ ] Special characters in inputs
- [ ] Unicode characters

### Error Handling
- [ ] Database connection errors
- [ ] Malformed JSON requests
- [ ] Unexpected server errors
- [ ] Network timeout scenarios

### Security Validation
- [ ] Token requirement enforced for email deletion
- [ ] No authentication bypass possible
- [ ] Input sanitization working
- [ ] No sensitive data in error messages

## Test Automation Scripts

### Using curl (Bash/PowerShell)

#### Test Delete by ID
```bash
# Happy path
curl -X DELETE "http://localhost:3000/api/users/delete/507f1f77bcf86cd799439011"

# Invalid ID
curl -X DELETE "http://localhost:3000/api/users/delete/invalid-id"
```

#### Test Delete by Email
```bash
# Happy path
curl -X DELETE "http://localhost:3000/api/users/confirmdeletemyaccount" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","token":"valid-token"}'

# Missing token
curl -X DELETE "http://localhost:3000/api/users/confirmdeletemyaccount" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com"}'
```

### PowerShell Scripts
```powershell
# Test delete by ID
Invoke-RestMethod -Uri "http://localhost:3000/api/users/delete/507f1f77bcf86cd799439011" -Method Delete

# Test delete by email
$body = @{
    email = "testuser@example.com"
    token = "valid-token"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/users/confirmdeletemyaccount" -Method Delete -Body $body -ContentType "application/json"
```

## Performance Benchmarks

### Expected Response Times
- Delete by ID: < 200ms
- Delete by Email: < 300ms (includes additional validation)

### Memory Usage
- Monitor memory usage during bulk deletion tests
- Ensure no memory leaks in repeated operations

## Logging and Monitoring

### Console Output to Monitor
```
DeleteUserById input ID: 507f1f77bcf86cd799439011
DeleteUserByEmail input email: testuser@example.com token: valid-token-123
```

### Database Logs
- Monitor MongoDB operations
- Check for any database locking issues
- Verify transaction rollbacks if errors occur

## Regression Testing

After any code changes, re-run:
1. All happy path scenarios
2. Core error handling tests  
3. Security validation tests
4. Database integration tests

## Known Limitations & TODOs

1. **Token Validation**: Currently only checks token existence, not validity
2. **Email Notifications**: Account deletion emails not implemented yet
3. **Audit Trail**: No logging of deletion events for compliance
4. **Soft Delete**: Currently permanent deletion, no recovery option

## Troubleshooting Guide

### Common Issues
1. **MongoDB Connection**: Verify connection string in environment variables
2. **Route Not Found**: Check if userRoutes is properly imported in main app
3. **CORS Issues**: Ensure CORS is configured for DELETE methods
4. **JSON Parsing**: Verify Content-Type header is set correctly

### Debug Commands
```bash
# Check if user exists before deletion
curl -X GET "http://localhost:3000/api/users/507f1f77bcf86cd799439011"

# Check server logs
npm run dev

# Check MongoDB directly
mongosh
use cervitech_db
db.appusers.find({email: "testuser@example.com"})
```

---

**Last Updated**: July 24, 2025  
**Version**: 1.0  
**Author**: Delete User Feature Implementation Team
