# Test the New Neck Angle Records Date Range Endpoint

## Endpoint
`GET /api/neck-angle/neckangle/records/:userId/date-range?startDate=START_DATE&endDate=END_DATE`

## Description
This endpoint retrieves all neck angle records for a specific user within a specified date range, equivalent to the C# method `GetAppUserNeckAngleRecordsForaDateRangebyIdAsync`.

## Parameters
- `userId` (path parameter): The ID of the user
- `startDate` (query parameter): Start date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- `endDate` (query parameter): End date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

## HTTP Status Codes

| Status Code | Description | When It Occurs |
|-------------|-------------|----------------|
| **200** | Success | Records retrieved successfully |
| **400** | Bad Request | Missing or invalid parameters (userId, startDate, endDate, date format) |
| **404** | Not Found | User doesn't exist OR no records found for the specified period |
| **500** | Internal Server Error | Unexpected server error during processing |

## Test Cases

### 1. Valid User ID with Records in Date Range
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_HERE/date-range?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "message": "Neck angle records for date range retrieved successfully",
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

### 2. Valid User ID with No Records in Date Range
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_HERE/date-range?startDate=2024-02-01T00:00:00.000Z&endDate=2024-02-28T23:59:59.999Z" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 404,
  "message": "No records exist for the selected period",
  "data": null
}
```

### 3. Invalid User ID (User doesn't exist in database)
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/INVALID_USER_ID/date-range?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z" \
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
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records//date-range?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z" \
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

### 5. Missing Start Date
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_HERE/date-range?endDate=2024-01-31T23:59:59.999Z" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Start date and end date are required",
  "data": null
}
```

### 6. Missing End Date
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_HERE/date-range?startDate=2024-01-01T00:00:00.000Z" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Start date and end date are required",
  "data": null
}
```

### 7. Invalid Date Format
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_HERE/date-range?startDate=invalid-date&endDate=2024-01-31T23:59:59.999Z" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)",
  "data": null
}
```

### 8. Start Date After End Date
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_HERE/date-range?startDate=2024-01-31T23:59:59.999Z&endDate=2024-01-01T00:00:00.000Z" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 400,
  "message": "Start date must be before or equal to end date",
  "data": null
}
```

### 9. Server Error (Unexpected Error)
```bash
curl -X GET "http://localhost:4000/api/neck-angle/neckangle/records/USER_ID_HERE/date-range?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z" \
  -H "Content-Type: application/json"
```

**Expected Response (when server encounters unexpected error):**
```json
{
  "statusCode": 500,
  "message": "Error retrieving neck angle records for date range",
  "data": null
}
```

## Implementation Details

The implementation includes:

1. **Service Method**: `getAppUserNeckAngleRecordsForaDateRangebyIdAsync(userId: string, startDate: Date, endDate: Date)` in `NeckAngleService`
   - Validates user exists
   - Fetches neck angle records from database within the specified date range
   - Sorts by most recent first
   - Maps to view model format
   - Throws appropriate exceptions

2. **Controller Method**: `getAppUserNeckAngleRecordsForaDateRangebyId(req: Request, res: Response)` in `NeckAngleController`
   - Validates user ID parameter
   - Validates start and end date query parameters
   - Validates date format and logical order
   - Calls service method
   - Returns standardized API response

3. **Route**: `GET /neckangle/records/:userId/date-range` in `neckAngle.routes.ts`
   - Maps URL parameter and query parameters to controller method

## Data Flow
1. Request comes to route `/api/neck-angle/neckangle/records/:userId/date-range?startDate=START&endDate=END`
2. Route calls `NeckAngleController.getAppUserNeckAngleRecordsForaDateRangebyId`
3. Controller validates input parameters and calls `NeckAngleService.getAppUserNeckAngleRecordsForaDateRangebyIdAsync`
4. Service queries database with date range filter and returns formatted data
5. Controller returns standardized API response

This matches the C# implementation's functionality:
- Validates user exists
- Fetches neck angle records within date range
- Returns proper error messages for no records in period
- Uses similar data structure
- Handles date range filtering at the database level

## Example Usage with JavaScript/TypeScript

```typescript
// Example usage in a frontend application
const fetchNeckAngleRecords = async (userId: string, startDate: string, endDate: string) => {
  try {
    const response = await fetch(
      `http://localhost:4000/api/neck-angle/neckangle/records/${userId}/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
    );
    
    const data = await response.json();
    
    if (data.statusCode === 200) {
      console.log('Records retrieved:', data.data);
      return data.data;
    } else {
      console.error('Error:', data.message);
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
};

// Usage
const records = await fetchNeckAngleRecords(
  'USER_ID_HERE',
  '2024-01-01T00:00:00.000Z',
  '2024-01-31T23:59:59.999Z'
);
```
