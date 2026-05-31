# OUAS Skill: Component Manifest (v1.0)

> This skill teaches you how to write meaningful JSDoc descriptions so the CLI generates a good manifest.

## Context
The AI agent uses the `manifest.ouas.json` to understand what components are available. This manifest is generated automatically by parsing your code's JSDoc comments.

## Rules
1. Write descriptive JSDoc comments immediately above the `withOUAS()` wrapper.
2. Focus descriptions on *what* the component does and *when* to use it, not just what it looks like.
3. After writing or modifying a component, always run `npx ouas generate` to update the manifest.

## Anti-patterns
- BAD: `/** A button component. */`
- GOOD: `/** A primary action button. Use this for the main submit action on forms. Supports 'primary' and 'secondary' variants. */`

## Validation checklist
- [ ] Every registered component has a clear JSDoc block.
- [ ] `npx ouas generate` runs without errors.
- [ ] The generated `manifest.ouas.json` accurately reflects the components.
