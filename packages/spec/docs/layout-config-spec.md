# Layout Config Specification v1.0

## Overview

The Layout Config is a JSON document that an AI agent writes. It declares what the user's screen should look like — which components appear, in what order, with which fields visible. It contains no code. It does not modify the app. It is data that the renderer interprets.

**Schema:** [`layout-config.schema.json`](../schemas/layout-config.schema.json)

## Top-Level Structure

| Field              | Type       | Required | Description                                           |
| ------------------ | ---------- | -------- | ----------------------------------------------------- |
| `ouas_version`     | `string`   | Yes      | OUAS spec version (e.g. `"1.0"`)                      |
| `config_id`        | `string`   | Yes      | Unique config identifier (format: `cfg_[a-z0-9_]+`)   |
| `app_id`           | `string`   | Yes      | Must match the target app's manifest `app_id`         |
| `user_id`          | `string`   | Yes      | The user this config belongs to                       |
| `manifest_version` | `string`   | Yes      | The manifest version this config was written against  |
| `created_by_agent` | `string`   | Yes      | Identifier of the AI agent that generated this config |
| `created_at`       | `datetime` | Yes      | ISO 8601 timestamp                                    |
| `description`      | `string`   | Yes      | Human-readable description of this layout's intent    |
| `layout`           | `object`   | Yes      | The layout definition                                 |
| `theme`            | `object`   | No       | Theme overrides (density, accent color)               |

## Layout Object

| Field     | Type    | Required | Description                                                                                   |
| --------- | ------- | -------- | --------------------------------------------------------------------------------------------- |
| `type`    | `enum`  | Yes      | Layout type: `single-column`, `two-column`, `grid`, `masonry`, `calendar`, `kanban`, `custom` |
| `regions` | `array` | Yes      | Array of region definitions (min 1)                                                           |

## Region Object

Each region places and configures one component instance.

| Field            | Type           | Required | Description                                                           |
| ---------------- | -------------- | -------- | --------------------------------------------------------------------- |
| `id`             | `string`       | Yes      | Unique region identifier within the layout                            |
| `component`      | `string`       | Yes      | Component ID — must exist in the manifest                             |
| `variant`        | `string`       | No       | Which variant to render                                               |
| `visible_fields` | `array`        | Yes      | Fields to pass as props — each must exist in the component's manifest |
| `hidden_fields`  | `array`        | No       | Explicitly hidden fields (informational)                              |
| `sort`           | `object`       | No       | Sort instruction: `{ field, direction }`                              |
| `filter`         | `object\|null` | No       | Filter instruction: `{ field, operator, value }`                      |
| `slots`          | `object`       | No       | Map of slot names to component IDs                                    |
| `position`       | `enum`         | No       | Absolute position hint for floating components                        |

## Theme Object

| Field          | Type           | Description                                          |
| -------------- | -------------- | ---------------------------------------------------- |
| `density`      | `enum`         | `compact`, `comfortable`, or `spacious`              |
| `accent_color` | `string\|null` | Hex color (e.g. `"#4285F4"`) or null for app default |

## Rules

### Rule 5.2.1 — Component and Field Existence

A Layout Config may only reference component IDs and field names that exist in the app's published Manifest. The validator rejects any config referencing unknown components or fields. This is the primary safety guarantee.

### Rule 5.2.2 — No Data Logic

A Layout Config may never specify data fetching logic, API calls, authentication, or backend operations. It is purely a view declaration. All data flows through the app's existing data layer.

### Rule 5.2.3 — Required Fields Visible

Required fields (as declared in the Manifest) must appear in `visible_fields`. A config that hides a required field is invalid and will be rejected.

## Config Versioning

Every Layout Config stores the `manifest_version` it was written against. When the renderer detects a mismatch between the config's `manifest_version` and the current manifest's version, it triggers the config migration pipeline. See the [Validation Contract](./validation-contract.md) for migration details.

## Examples

- Executive task list: [`example-layout-config-executive.json`](../examples/example-layout-config-executive.json)
- Student calendar: [`example-layout-config-student.json`](../examples/example-layout-config-student.json)
- Researcher knowledge base: [`example-layout-config-researcher.json`](../examples/example-layout-config-researcher.json)
