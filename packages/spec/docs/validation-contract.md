# Validation Contract v1.0

## Overview

Before any Layout Config reaches the renderer, it must pass validation. This is the trust layer of OUAS. Validation runs server-side or in the browser — it does not matter — but it must run before any config is applied.

**Response Schema:** [`validation-response.schema.json`](../schemas/validation-response.schema.json)

## 7-Step Validation Pipeline

Checks run in this order. If a check fails, subsequent checks may still run to collect all errors at once.

| Step | Check                         | Description                                                                          |
| ---- | ----------------------------- | ------------------------------------------------------------------------------------ |
| 1    | **Schema check**              | Is the JSON structurally valid against the OUAS Layout Config JSON Schema?           |
| 2    | **App match check**           | Does `config.app_id` match the current app's manifest `app_id`?                      |
| 3    | **Component existence check** | Does every component ID in the config exist in the manifest?                         |
| 4    | **Field existence check**     | Does every field name referenced exist in that component's manifest definition?      |
| 5    | **Required field check**      | Are all required fields present in `visible_fields` for each component?              |
| 6    | **Constraint check**          | Does the config violate any component-level constraints (e.g. `min_fields_visible`)? |
| 7    | **Data source check**         | Is the `data_source` for each component available and authorized for this user?      |

## Error Codes

| Code                        | Step | Description                                                     |
| --------------------------- | ---- | --------------------------------------------------------------- |
| `SCHEMA_INVALID`            | 1    | JSON does not conform to the Layout Config schema               |
| `APP_ID_MISMATCH`           | 2    | Config's `app_id` doesn't match the current app                 |
| `COMPONENT_NOT_FOUND`       | 3    | Component ID doesn't exist in the manifest                      |
| `FIELD_NOT_FOUND`           | 4    | Field name doesn't exist in the component's definition          |
| `REQUIRED_FIELD_HIDDEN`     | 5    | A required field is missing from `visible_fields`               |
| `CONSTRAINT_VIOLATION`      | 6    | Component constraint violated (e.g. below `min_fields_visible`) |
| `DATA_SOURCE_INVALID`       | 7    | Data source unavailable or unauthorized                         |
| `VARIANT_NOT_FOUND`         | 3    | Variant doesn't exist in the component's declared variants      |
| `SLOT_NOT_FOUND`            | 3    | Slot name doesn't exist in the component's declared slots       |
| `MANIFEST_VERSION_MISMATCH` | —    | Config's `manifest_version` doesn't match current manifest      |
| `CONFIG_UNRECOVERABLE`      | —    | Config migration failed (>50% regions unresolvable)             |

## Validation Response Format

```json
{
  "valid": false,
  "errors": [
    {
      "code": "FIELD_NOT_FOUND",
      "component": "email-row",
      "field": "urgency_score",
      "message": "Field 'urgency_score' does not exist in component 'email-row'. Available fields: sender, subject, preview, timestamp, unread, priority.",
      "suggestion": "Did you mean 'priority'?",
      "available_values": ["sender", "subject", "preview", "timestamp", "unread", "priority"]
    }
  ],
  "warnings": [],
  "migration_applied": false,
  "migration_warnings": []
}
```

### Rule 5.3.1 — Agent-Readable Errors

Error messages are written for AI agents to read, not humans. They must:

- Be **specific** — include the exact field or component that failed
- **List available alternatives** — show what values are valid
- **Include suggestions** — "Did you mean X?"
- **Never use vague language** like "invalid configuration"

## Config Migration

When the renderer detects a `manifest_version` mismatch:

1. Load the saved config and the current manifest
2. For each component ID in the config, check if it exists in the current manifest
3. If not found, check the `component_aliases` map for renamed IDs
4. If an alias exists, rewrite the config with the new ID and log the migration
5. If no alias exists, remove that region and add to `migration_warnings[]`
6. If more than 50% of regions were removed → config is unrecoverable → fall back to default
7. Save the migrated config with the updated `manifest_version`

Migration warnings are included in the validation response under `migration_warnings[]`.
