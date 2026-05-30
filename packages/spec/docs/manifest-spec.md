# Component Manifest Specification v1.0

## Overview

The Component Manifest is a JSON file that a developer publishes alongside their app. It is the catalog of everything an AI agent is allowed to work with. The agent can only order from what is on the menu.

**Schema:** [`manifest.schema.json`](../schemas/manifest.schema.json)

## Top-Level Structure

| Field               | Type       | Required | Description                                                          |
| ------------------- | ---------- | -------- | -------------------------------------------------------------------- |
| `ouas_version`      | `string`   | Yes      | OUAS spec version (e.g. `"1.0"`)                                     |
| `app_id`            | `string`   | Yes      | Reverse-domain app identifier (e.g. `"com.example.emailapp"`)        |
| `app_name`          | `string`   | Yes      | Human-readable app name                                              |
| `generated_at`      | `datetime` | Yes      | ISO 8601 timestamp of manifest generation                            |
| `manifest_version`  | `string`   | No       | Semver of this manifest (e.g. `"1.0.0"`) — used for config migration |
| `components`        | `array`    | Yes      | Array of component definitions (min 1)                               |
| `data_sources`      | `array`    | Yes      | Array of available data streams                                      |
| `constraints`       | `object`   | No       | Global constraints the agent must respect                            |
| `component_aliases` | `object`   | No       | Map of old → new component IDs for migration                         |

## Component Definition

Each component describes a single UI element the agent can place and configure.

| Field          | Type     | Required | Description                                                                                     |
| -------------- | -------- | -------- | ----------------------------------------------------------------------------------------------- |
| `id`           | `string` | Yes      | Kebab-case unique identifier (e.g. `"email-row"`)                                               |
| `display_name` | `string` | Yes      | Human-readable name                                                                             |
| `description`  | `string` | Yes      | Machine-read description for agents (min 20 chars)                                              |
| `category`     | `enum`   | Yes      | One of: `list-item`, `detail`, `action`, `navigation`, `container`, `badge`, `input`, `display` |
| `data_source`  | `string` | Yes      | Which data source this component renders                                                        |
| `fields`       | `object` | Yes      | Map of field names → field definitions                                                          |
| `slots`        | `array`  | No       | Named insertion points for child components                                                     |
| `variants`     | `array`  | No       | Available visual variants                                                                       |
| `constraints`  | `object` | No       | Component-level constraints                                                                     |

## Field Definition

| Field      | Type      | Required | Description                                                                  |
| ---------- | --------- | -------- | ---------------------------------------------------------------------------- |
| `type`     | `enum`    | Yes      | One of: `string`, `number`, `boolean`, `datetime`, `enum`, `array`, `object` |
| `required` | `boolean` | Yes      | If true, must appear in `visible_fields` in any config                       |
| `label`    | `string`  | No       | Human-readable field label                                                   |
| `values`   | `array`   | No       | For enum fields, the allowed values                                          |

## Rules

### Rule 5.1.1 — Data Source Binding

Every component must declare a `data_source`. The agent cannot bind a component to a data source not listed in its definition. This prevents the agent from accidentally showing calendar events inside an email list component.

### Rule 5.1.2 — Description Quality

The `description` field is not cosmetic. It is machine-read by the agent. It must be precise, unambiguous, and describe **what** the component renders — not how it looks. Minimum 20 characters enforced by schema.

## Component Aliases

The `component_aliases` field at the top level maps old component IDs to their new names. This is used by the config migrator when a developer renames a component. Example:

```json
"component_aliases": {
  "email-row": "email-list-item"
}
```

If developers don't maintain this when renaming components, existing user configs will silently break.

## Example

See [`example-manifest.json`](../examples/example-manifest.json) for a complete MailFlow manifest.

## Agent Scope Control

Developers must be able to restrict what agents can touch. Two mechanisms exist for this.

### Component-level locking

When annotating a component with `withOUAS()`, pass `locked: true` to prevent any agent from hiding, moving, or modifying that component:

```json
{
  "id": "billing-cta",
  "display_name": "Upgrade button",
  "locked": true
}
```

A locked component always renders. It cannot appear in `hidden_fields`, cannot be removed from a region, and cannot have its `variant` changed by a Layout Config. Any config that attempts to modify a locked component is rejected with error code `COMPONENT_LOCKED`.

### App-level agent scope

The manifest top-level accepts an `agent_scope` object that restricts which parts of the app agents are allowed to work with:

```json
"agent_scope": {
  "allowed_regions": ["inbox", "sidebar", "compose"],
  "locked_components": ["billing-cta", "upgrade-banner", "nav-settings", "terms-footer"]
}
```

`allowed_regions` — only Layout Config regions with an `id` matching this list will be processed. Any region outside this list is silently dropped from the config before rendering.

`locked_components` — any component ID in this list behaves as if `locked: true` was set on the component itself. This is the app-level override — useful when a developer cannot modify individual component annotations (e.g. third-party components).

Both fields are optional. If `agent_scope` is omitted entirely, agents can work with all non-locked components across the entire app.
