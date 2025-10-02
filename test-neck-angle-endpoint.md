# Test the New Neck Angle Records Endpoint

## Endpoint
`GET /api/neck-angle/neckangle/records/:userId`

## Description
This endpoint retrieves all neck angle records for a specific user, equivalent to the C# method `GetAppUserNeckAngleRecordsbyIdAsync`.

## HTTP Status Codes

| Status Code | Description | When It Occurs |
|-------------|-------------|----------------|
| **200** | Success | Records retrieved successfully |
| **400** | Bad Request | Missing userId parameter |
| **404** | Not Found | User doesn't exist OR no records found for the user |
| **500** | Internal Server Error | Unexpected server error during processing |

## Test Cases

### 1. Valid User ID with Records
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Neck angle records retrieved successfully",
  "data": [
    {
      "appUserId": 123,
      "angle": 45.5,
      "craniumVertebralAngle": 5.5,
      "dateTimeRecorded": "2024-01-15T10:30:00.000Z"
    },
    {
      "appUserId": 123,
      "angle": 42.3,
      "craniumVertebralAngle": 2.3,
      "dateTimeRecorded": "2024-01-15T09:15:00.000Z"
    }
  ]
}
```

### 2. Valid User ID with No Records
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_WITH_NO_RECORDS" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 404,
  "message": "You have no records of neck angle posture",
  "data": null
}
```

### 3. Invalid User ID (User doesn't exist in database)
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/INVALID_USER_ID" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "data": null
}
```

### 4. Missing User ID
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "User ID is required",
  "data": null
}
```

## Implementation Details

The implementation includes:

1. **Service Method**: `getAppUserNeckAngleRecordsByIdAsync(userId: string)` in `NeckAngleService`
   - Validates user exists
   - Fetches neck angle records from database
   - Sorts by most recent first
   - Maps to view model format
   - Throws appropriate exceptions

2. **Controller Method**: `getAppUserNeckAngleRecordsById(req: Request, res: Response)` in `NeckAngleController`
   - Validates user ID parameter
   - Calls service method
   - Returns standardized API response

3. **Route**: `GET /neckangle/records/:userId` in `neckAngle.routes.ts`
   - Maps URL parameter to controller method

## Data Flow
1. Request comes to route `/api/neck-angle/neckangle/records/:userId`
2. Route calls `NeckAngleController.getAppUserNeckAngleRecordsById`
3. Controller validates input and calls `NeckAngleService.getAppUserNeckAngleRecordsByIdAsync`
4. Service queries database and returns formatted data
5. Controller returns standardized API response

This matches the C# implementation's functionality:
- Validates user exists
- Fetches neck angle records
- Returns proper error messages
- Uses similar data structure

