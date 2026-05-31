# OUAS Skill: Prompt Engineering (v1.0)

> This skill teaches how to build the system prompt that turns user instructions into valid Layout Configs.

## Context
When building the backend Agent, you must prompt the LLM correctly so it outputs valid JSON that matches the OUAS Layout Config schema.

## Rules
1. The system prompt must always include the current UI state and the `manifest.ouas.json` definitions.
2. The LLM must be explicitly instructed to output *only* valid JSON.

## Code patterns

### Template System Prompt
```text
You are a UI layout engine. Your job is to generate an OUAS Layout Config.
You will be given:
1. The Component Manifest (definitions of available components)
2. The Current UI State
3. A User Request (e.g. "Move the search bar to the top")

You must respond ONLY with a valid JSON Layout Config. Do not include markdown formatting or explanations.

Schema:
{
  "layout": {
    "type": "box",
    "direction": "vertical",
    "children": [
      { "type": "component", "componentName": "SearchBar", "props": {} }
    ]
  }
}
```
