# Agent API Contract v1.0

## Overview

OUAS-compatible apps must expose a standard HTTP API that any AI agent can call. This is the bridge between the agent and the app. It has exactly four endpoints in v1.

## Base URL

All endpoints are relative to a configurable base URL. Default: `/ouas`

## Endpoints

### `GET /ouas/manifest`

Returns the full Component Manifest JSON for this app.

**Response:** `200 OK`

```json
{
  "ouas_version": "1.0",
  "app_id": "com.example.mailflow",
  "app_name": "MailFlow",
  ...
}
```

**Errors:**

- `404 Not Found` — App does not have a manifest
- `500 Internal Server Error` — Manifest generation failed

---

### `GET /ouas/config/:user_id`

Returns the current active Layout Config for a user, or the default layout if no custom config exists.

**Parameters:**

- `:user_id` — The user's unique identifier

**Response:** `200 OK`

```json
{
  "ouas_version": "1.0",
  "config_id": "cfg_exec_tasklist_v1",
  ...
}
```

**Headers:**

- `X-OUAS-Config-Source: custom | default` — Indicates whether this is a user's custom config or the app's default

**Errors:**

- `401 Unauthorized` — Missing or invalid auth token
- `404 Not Found` — User not found

---

### `POST /ouas/config/:user_id`

Accepts a new Layout Config, validates it against the manifest, and applies it if valid.

**Parameters:**

- `:user_id` — The user's unique identifier

**Request Body:** Full Layout Config JSON

**Response (valid):** `200 OK`

```json
{
  "applied": true,
  "validation": {
    "valid": true,
    "errors": [],
    "warnings": []
  }
}
```

**Response (invalid):** `422 Unprocessable Entity`

```json
{
  "applied": false,
  "validation": {
    "valid": false,
    "errors": [
      {
        "code": "FIELD_NOT_FOUND",
        "component": "email-row",
        "field": "urgency_score",
        "message": "Field 'urgency_score' does not exist in component 'email-row'. Available fields: sender, subject, preview, timestamp, unread, priority.",
        "suggestion": "Did you mean 'priority'?"
      }
    ],
    "warnings": []
  }
}
```

**Errors:**

- `400 Bad Request` — Malformed JSON
- `401 Unauthorized` — Missing or invalid auth token
- `422 Unprocessable Entity` — Config failed validation (see response body)

---

### `DELETE /ouas/config/:user_id`

Resets the user's layout to the default app layout.

**Parameters:**

- `:user_id` — The user's unique identifier

**Response:** `200 OK`

```json
{
  "reset": true,
  "message": "Layout reset to default."
}
```

**Errors:**

- `401 Unauthorized` — Missing or invalid auth token
- `404 Not Found` — User not found or no custom config exists

## Authentication

The Agent API must be authenticated. In v1, the app's existing auth token is sufficient. The agent must present the user's session token when calling these endpoints. OUAS does not define its own auth system.

**For the MailFlow demo:** Mock auth only. User IDs are hardcoded (`user_exec_001`, `user_student_001`, `user_researcher_001`). No real login required.

## Content Type

All requests and responses use `Content-Type: application/json`.

## Rate Limiting

Not specified in v1. Apps may implement their own rate limiting on these endpoints.
