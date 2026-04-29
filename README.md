# GENDERIZE API

## BASE URL [https://hng-backend-azure.vercel.app](https://hng-backend-azure.vercel.app)

## CLASSIFY

### GET [/api/classify](https://hng-backend-azure.vercel.app/api/classify?name=david)

Classifies a given first name and predicts the likely gender associated with it.

**Method:** GET

---

**Query Parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | The first name to classify. |
---

**Example Request**

```
GET {{baseUrl}}/api/classify?name=david

 ```

---

**Example Response**

``` json
{
  "status": "success",
  "data": {
    "name": "david",
    "gender": "male",
    "probability": 1,
    "sample_size": 3489607,
    "is_confident": true,
    "processed_at": "2026-04-20T12:33:16.790Z"
  }
}

 ```

---

**Response Fields**

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | Indicates whether the request was successful (e.g., `"success"`). |
| `data.name` | string | The name that was queried. |
| `data.gender` | string | Predicted gender: `"male"`, `"female"`, or `null` if unknown. |
| `data.probability` | number | Confidence score of the prediction, between 0 and 1. A value of `1` means 100% confidence. |
| `data.sample_size` | integer | Number of data samples used to make the prediction. |
| `data.is_confident` | boolean | Whether the API considers the prediction to be confident. |
| `data.processed_at` | string | ISO 8601 timestamp of when the request was processed. |

---

**Error Responses**

| Status Code | Meaning | Description |
| --- | --- | --- |
| `400 Bad Request` | Missing parameter | The `name` query parameter was not provided. |
| `422 Unprocessable Entity` | Invalid name | The value provided for `name` could not be processed. |
| `500 Internal Server Error` | Server error | An unexpected error occurred on the server. |

**Example Error Response**

``` json
{
  "status": "error",
  "error": "Missing 'name' parameter"
}

 ```

---

## Profiles

### GET [/api/profiles](https://hng-backend-azure.vercel.app/api/profiles)

Retrieves a list of profiles, optionally filtered by gender, country, and age group. If no query parameters are provided, all profiles are returned.

**Method:** GET

---

**Query Parameters**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `country_id` | string | No | Filter profiles by country using an ISO 3166-1 alpha-2 country code (e.g., `NG` for Nigeria). |
| `gender` | string | No | Filter profiles by gender. Accepted values: `male`, `female`. |
| `age_group` | string | No | Filter profiles by age group. Accepted values: `child`, `teenager`, `adult`, `senior`. |

---

**Example Request**

```
GET {{baseUrl}}/api/profiles?country_id=ng

 ```

---

**Example Response**

``` json
{
  "status": "success",
  "count": 4,
  "data": [
    {
      "id": "019da298-1297-70a8-8d5c-6918c16469a0",
      "name": "john",
      "gender": "male",
      "age": "75",
      "age_group": "senior",
      "country_id": "NG"
    },
    {
      "id": "019da298-20b5-74bb-8061-e4781c93c868",
      "name": "mary",
      "gender": "female",
      "age": "73",
      "age_group": "senior",
      "country_id": "NG"
    }
  ]
}

 ```

---

**Response Fields**

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | Indicates whether the request was successful (e.g., `"success"`). |
| `count` | integer | Total number of profiles returned. |
| `data` | array | List of profile objects matching the applied filters. |
| `data[].id` | string | Unique identifier for the profile (UUID). |
| `data[].name` | string | The first name associated with the profile. |
| `data[].gender` | string | Gender of the profile: `"male"` or `"female"`. |
| `data[].age` | number | Age of the individual. |
| `data[].age_group` | string | Age group category: `"child"`, `"teenager"`, `"adult"`, or `"senior"`. |
| `data[].country_id` | string | ISO 3166-1 alpha-2 country code associated with the profile. |

---

**Error Responses**

| Status Code | Meaning | Description |
| --- | --- | --- |
| `400 Bad Request` | Invalid parameter | One or more query parameters have invalid values. |
| `500 Internal Server Error` | Server error | An unexpected error occurred on the server. |

**Example Error Response**

``` json
{
  "status": "error",
  "error": "Invalid 'gender' value. Accepted values: male, female."
}

 ```

### GET [/api/profile/:id](https://hng-backend-azure.vercel.app/api/profiles/)

Retrieves a single profile by its unique identifier.

**Method:** GET

---

**Path Variables**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string (UUID) | Yes | The unique identifier of the profile to retrieve. |

---

**Example Request**

```
GET {{baseUrl}}/api/profiles/019da298-1297-70a8-8d5c-6918c16469a0

 ```

---

**Example Response**

``` json
{
  "status": "success",
  "data": {
    "id": "019da298-1297-70a8-8d5c-6918c16469a0",
    "name": "john",
    "gender": "male",
    "gender_probability": "1",
    "sample_size": "2692560",
    "age": "75",
    "age_group": "senior",
    "country_id": "NG",
    "country_probability": "0.08",
    "createdAt": "2026-04-18T21:56:08.000Z",
    "updatedAt": "2026-04-18T21:56:08.000Z"
  }
}

 ```

---

**Response Fields**

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | Indicates whether the request was successful (e.g., `"success"`). |
| `data.id` | string | Unique identifier of the profile (UUID). |
| `data.name` | string | The first name associated with the profile. |
| `data.gender` | string | Predicted gender: `"male"` or `"female"`. |
| `data.gender_probability` | number | Confidence score of the gender prediction, between 0 and 1. |
| `data.sample_size` | number | Number of data samples used for the gender prediction. |
| `data.age` | string | Age of the individual. |
| `data.age_group` | string | Age group category: `"child"`, `"teenager"`, `"adult"`, or `"senior"`. |
| `data.country_id` | string | ISO 3166-1 alpha-2 country code associated with the profile. |
| `data.country_probability` | number | Confidence score of the country prediction, between 0 and 1. |
| `data.createdAt` | string | ISO 8601 timestamp of when the profile was created. |
| `data.updatedAt` | string | ISO 8601 timestamp of when the profile was last updated. |

---

**Error Responses**

| Status Code | Meaning | Description |
| --- | --- | --- |
| `404 Not Found` | Profile not found | No profile exists for the given `id`. |
| `500 Internal Server Error` | Server error | An unexpected error occurred on the server. |

**Example Error Response**

``` json
{
  "status": "error",
  "message": "Profile not found!"
}

 ```

### POST [/api/profiles](https://hng-backend-azure.vercel.app/api/profiles)

Creates a new gender profile for a given name. The API analyzes the name and returns predicted gender, age, and country of origin data, storing the result as a profile.

## Request

**Method & Path:** `POST {{baseUrl}}/api/profiles`

**Headers:**

| Header | Value |
| --- | --- |
| `Content-Type` | `application/json` |

**Body (JSON):**

``` json
{
  "name": "Ferdinard"
}

 ```

**Body Fields:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | ✅ Yes | The name to generate a gender profile for. |

---

## Response

**HTTP 201 Created**

Returns a success status along with the newly created profile object containing predicted gender, age, and country of origin data derived from the provided name.

**Example Response:**

``` json
{
  "status": "success",
  "data": {
    "id": "019dac0c-1698-72db-9e6a-5d35f5376767",
    "name": "ferdinard",
    "gender": "male",
    "gender_probability": 0.94,
    "sample_size": 157,
    "age": 44,
    "age_group": "adult",
    "country_id": "NG",
    "country_probability": 0.18,
    "updatedAt": "2026-04-20T17:59:26.617Z",
    "createdAt": "2026-04-20T17:59:26.617Z"
  }
}

 ```

**Response** **`data`** **Fields:**

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` (UUID) | Unique identifier for the created profile. |
| `name` | `string` | The normalized (lowercased) version of the submitted name. |
| `gender` | `string` | Predicted gender for the name (e.g. `"male"`, `"female"`). |
| `gender_probability` | `number` | Confidence score for the gender prediction, between `0` and `1`. |
| `sample_size` | `integer` | Number of data samples used to determine the gender prediction. |
| `age` | `integer` | Predicted average age associated with the name. |
| `age_group` | `string` | Age group classification (e.g. `"adult"`, `"senior"`, `"young"`). |
| `country_id` | `string` | ISO 3166-1 alpha-2 country code of the most likely country of origin. |
| `country_probability` | `number` | Confidence score for the country prediction, between `0` and `1`. |
| `createdAt` | `string` (ISO 8601) | Timestamp indicating when the profile was created. |
| `updatedAt` | `string` (ISO 8601) | Timestamp indicating when the profile was last updated. |

### DELETE [/api/profiles/:id](https://hng-backend-azure.vercel.app/api/profiles)

Deletes an existing profile by its unique ID. If the profile is found, it is permanently removed and no response body is returned. If no profile exists with the given ID, a `404 Not Found` error is returned.

## Request

**`DELETE {{baseUrl}}/api/profiles/:id`**

### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | Yes | The unique ID of the profile to delete |

---

## Responses

### 204 No Content

The profile was successfully deleted. No response body is returned.

---

### 404 Not Found

No profile with the specified ID was found.

``` json
{
  "status": "error",
  "message": "Profile not found!"
}

 ```

#### Error Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | Indicates the result — `"error"` |
| `message` | string | Human-readable description of the error |

---

### Search Profiles

Search for genderized profiles matching a natural-language query. The endpoint interprets descriptors such as gender, age range, age group, and country from the `q` parameter and returns matching profiles with probability scores.

#### Endpoint

`GET {{baseUrl}}/api/profiles/search`

#### Query Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `q` | string | Yes | Natural-language search query (e.g. `male and female teen above 17 in nigeria`). Must be a non-empty string. |
| `page` | integer | No | Page number of results. Non-integer or out-of-range values are currently tolerated by the server. |
| `limit` | integer | No | Maximum number of profiles per page. Non-integer or negative values are currently tolerated by the server. |

#### Example Request

```
GET {{baseUrl}}/api/profiles/search?q=male and female teen above 17 in nigeria

 ```

#### Responses

#### 200 OK — Success

``` json
{
  "status": "success",
  "count": 8,
  "data": [
    {
      "id": "019dbf75-0478-724b-9113-64527bc84379",
      "name": "Moussa Segla",
      "gender": "male",
      "gender_probability": 0.8,
      "sample_size": null,
      "age": 19,
      "age_group": "teenager",
      "country_id": "NG",
      "country_name": "Nigeria",
      "country_probability": 0.56,
      "createdAt": "2026-04-24T12:26:50.000Z",
      "updatedAt": "2026-04-24T12:26:50.000Z"
    },
    {
      "id": "019dbf75-0479-71fd-a2d7-b47186f6c8c1",
      "name": "Joseph Chukwu",
      "gender": "male",
      "gender_probability": 0.93,
      "sample_size": null,
      "age": 18,
      "age_group": "teenager",
      "country_id": "NG",
      "country_name": "Nigeria",
      "country_probability": 0.16,
      "createdAt": "2026-04-24T12:26:50.000Z",
      "updatedAt": "2026-04-24T12:26:50.000Z"
    }
  ]
}

 ```

#### 200 OK — No Matches

When no profiles match the query, the response is still `200 OK` with an empty `data` array.

``` json
{
  "status": "success",
  "count": 0,
  "data": []
}

 ```

#### 400 Bad Request — Missing or Empty `q`

Returned when `q` is absent or an empty string.

``` json
{
  "status": "error",
  "message": "Query parameter 'q' is required and must be a non-empty string"
}

 ```

#### Response Fields (Success)

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | Request status, `success` on 2xx responses. |
| `count` | integer | Number of profiles returned in `data`. |
| `data` | array | Array of matching profile objects (empty if no matches). |

#### Profile Object

| Field | Type | Description |
| --- | --- | --- |
| `id` | string (UUID) | Unique profile identifier. |
| `name` | string | Full name of the profile. |
| `gender` | string | Predicted gender (`male` / `female`). |
| `gender_probability` | number | Confidence score for gender prediction (0–1). |
| `sample_size` | integer | null | Sample size used to infer gender, if available. |
| `age` | integer | Predicted age in years. |
| `age_group` | string | Age group classification (e.g. `teenager`). |
| `country_id` | string | ISO country code (e.g. `NG`). |
| `country_name` | string | Country name. |
| `country_probability` | number | Confidence score for country prediction (0–1). |
| `createdAt` | string (ISO 8601) | When the profile was created. |
| `updatedAt` | string (ISO 8601) | When the profile was last updated. |

#### Error Response Shape

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | `"error"` on error responses. |
| `message` | string | Human-readable description of the error. |

#### Notes

- The `q` parameter is free-form natural language; the API parses gender, age, age group, and country cues.
    
- Probability fields (`gender_probability`, `country_probability`) range from `0` to `1`.
    
- `sample_size` may be `null` when the underlying dataset size is not reported.
    
- `page` and `limit` are currently permissive: non-numeric or negative values do not trigger a 400 and results are still returned. Prefer positive integers for predictable pagination.

---

## Profiles Export

This endpoint exports profile records as a CSV file based on a natural-language search query.

The route is mounted in `src/profiles/routes/index.routes.js` as:

- `GET /profiles/export`

The implementation lives in `src/profiles/controllers/export.profile.js`.

### Query Parameters

- `q` (required): natural-language query string used to filter profiles.
- `page` (optional): parsed by the controller but currently not applied to exported results.
- `limit` (optional): parsed by the controller but currently not applied to exported results.

### Supported Search Syntax

The `q` parameter can include any of the following filters together:

- Age ranges
  - `between 25 and 35`
  - `18-25 years`
  - `older than 30`
  - `under 40`
  - `young`

- Gender
  - `male`
  - `female`
  - `male and female`

- Age groups
  - `senior`
  - `adult`
  - `teenager`
  - `child`

- Country
  - `from nigeria`
  - `in canada`

- Registration / date range
  - `today`
  - `yesterday`
  - `this week`
  - `this month`
  - `this year`

- Sorting
  - `sort by age asc`
  - `order by name desc`
  - supported fields: `age`, `name`, `country`, `gender`, `registered`, `date`

- Free keyword search
  - searches `name` and `country_name` when no structured filter applies

### Response

On success, the endpoint returns a CSV attachment with headers:

- `id`
- `name`
- `gender`
- `gender_probability`
- `sample_size`
- `age`
- `age_group`
- `country_id`
- `country_name`
- `country_probability`
- `created_at`
- `updated_at`

Response headers include:

- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename=profiles_export.csv`

#### Error Handling

- `400 Bad Request` when:
  - `q` is missing, empty, or not a string.
  - the query contains incomplete filter language that cannot be parsed.

- `500 Internal Server Error` when the export fails on the server side.

#### Examples

```http
GET /profiles/export?q=young%20female%20from%20nigeria
```

```http
GET /profiles/export?q=between%2025%20and%2035%20sort%20by%20age%20asc
```

```http
GET /profiles/export?q=this%20month%20male
```

#### Notes

- The endpoint uses Sequelize to query `Profile` records.
- The current implementation does not apply `page` or `limit` to the exported results.
- If a query contains unsupported or incomplete syntax, the endpoint returns a parse error rather than a partial result.

---

## AUTH

---

### GitHub OAuth Authentication

Initiates the GitHub OAuth 2.0 authentication flow. When a user hits this endpoint, they will be redirected to GitHub to authorize the application. After successful authorization, GitHub will redirect back to the configured callback URL with an authorization code.

### Endpoint

`GET {{baseUrl}}/api/auth/github`

### Description

This endpoint starts the "Sign in with GitHub" flow. It does not return a JSON response directly — instead, it issues an HTTP redirect (302) to GitHub's OAuth authorization page, where the user can grant the application access to their GitHub account.

### Request

#### Method

`GET`

#### Headers

No custom headers are required.

#### Query Parameters

None required. The server handles the OAuth parameters (`client_id`, `redirect_uri`, `scope`, `state`) internally.

#### Body

None. This is a GET request.

### Authentication

No authentication is required to call this endpoint — this is the entry point to authenticate the user.

## Response

#### Success (302 Found)

On success, the server responds with a redirect to GitHub:

```
HTTP/1.1 302 Found
Location: https://github.com/login/oauth/authorize?client_id=...&redirect_uri=...&scope=...&state=...

 ```

#### Flow after redirect

1. The user authenticates on GitHub and authorizes the app.
    
2. GitHub redirects to the application's callback URL (see the `github callback` request) with a `code` query parameter.
    
3. The callback endpoint exchanges the `code` for an access token and creates/logs in the user.
    

#### Errors

| Status | Meaning |
| --- | --- |
| 500 | Server misconfiguration (missing GitHub OAuth credentials). |
| 503 | Upstream GitHub service unavailable. |

#### Notes

- Open this URL in a browser rather than a REST client to complete the flow end-to-end — REST clients typically cannot follow the interactive login on GitHub.
    
- Ensure the environment variable `baseUrl` is set to the correct API host.
    
- The related callback request is `github callback`.

---

## GitHub OAuth Callback

`GET {{baseUrl}}/api/auth/github/callback`

Handles the OAuth 2.0 callback from GitHub after a user authorizes the application. GitHub redirects the user to this endpoint with an authorization `code` and a `state` parameter, which the server exchanges for an access token and uses to create or update the user's Genderized profile session.

### How it works

1. The user initiates the GitHub OAuth flow from the client application.
    
2. GitHub redirects to this callback URL with `code` and `state` query parameters.
    
3. The server validates the `state` parameter to prevent CSRF attacks.
    
4. The server exchanges the `code` for an access token with GitHub.
    
5. The server fetches the user's GitHub profile and creates/updates the Genderized profile.
    
6. A session token or redirect response is returned to the client.
    

### Query Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | string | Yes | Authorization code returned by GitHub after the user approves the OAuth request. |
| `state` | string | Yes | Opaque value used to maintain state between the request and callback. Must match the value originally sent to GitHub to prevent CSRF. |

### Responses

#### 200 OK

Authentication succeeded. The response typically contains a session token or triggers a redirect to the application.

#### 400 Bad Request

Returned when the `state` parameter is missing, expired, or does not match the expected value.

``` json
{
  "status": "error",
  "message": "Invalid state parameter"
}

 ```

#### 401 Unauthorized

Returned when the authorization `code` is invalid or GitHub rejects the token exchange.

### Notes

- This endpoint is typically not called directly by clients — it is invoked by GitHub as part of the OAuth redirect flow.
    
- Ensure the redirect URI configured in your GitHub OAuth App matches this endpoint exactly.
    
- The `state` value should be generated server-side and stored (e.g., in a session or signed cookie) before starting the OAuth flow.


---

## Get Current Authenticated User

Returns information about the currently authenticated user based on the authorization token provided in the request.

### Endpoint

`GET {{baseUrl}}/api/auth/me`

### Authentication

This endpoint requires a valid authorization token. The token must be sent in the `Authorization` header using the Bearer scheme:

```
Authorization: Bearer <your_token>

 ```

If the token is missing or invalid, the API will respond with a `400` status and an error message: `Authorization Token Required`.

### Request

- **Method:** `GET`
    
- **URL:** `{{baseUrl}}/api/auth/me`
    
- **Headers:**
    
    - `Authorization: Bearer` (required)
        

No request body or query parameters are needed.

### Responses

#### 200 OK

Returns the profile of the authenticated user.

``` json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}

 ```

#### 400 Bad Request

Returned when the authorization token is missing.

``` json
{
  "success": false,
  "message": "Authorization Token Required"
}

 ```

#### 401 Unauthorized

Returned when the token is invalid or expired.

### Usage

Use this endpoint to verify a user's session and retrieve their profile information after logging in (e.g., via the GitHub OAuth callback flow).