# `@ouas/cli`

> The OpenUI Adaptive Standard (OUAS) Command Line Toolkit.

This package provides a command-line interface (CLI) to automatically extract annotated React component metadata (`withOUAS`), compile standard application manifests, and validate layout configurations locally during builds or pre-commit hooks.

---

## Installation

You can install the CLI globally or save it as a development dependency in your React monorepos:

```bash
pnpm add -D @ouas/cli
# or
npm install --save-dev @ouas/cli
```

---

## Core Commands

The CLI exposes two primary commands under the binary command `ouas`:

### 1. `ouas generate`
Scans your workspace directories for files containing `withOUAS(...)` HOC definitions, parses their AST, extracts fields/slots/variants metadata, and compiles them into a single compliant `manifest.ouas.json` specification file.

#### Parameters:
* `-d, --dir <directory>`: Source directory containing React components (defaults to `src`).
* `-o, --output <file>`: Destination path for the manifest output (defaults to `manifest.ouas.json`).
* `-a, --app-id <id>`: Uniquely identifies your application (e.g., `com.my.app`).
* `-n, --app-name <name>`: Display name of the application.

#### Example:
```bash
npx ouas generate --dir src/components --output public/manifest.json --app-id com.my.app --app-name "My Custom Dashboard"
```

---

### 2. `ouas validate`
Loads a local Layout Config JSON file and validates it against your application's Manifest file using the full 7-step validation pipeline. Handy for CI pipelines to catch faulty configurations.

#### Parameters:
* `-m, --manifest <file>`: Path to the generated manifest JSON file.
* `-c, --config <file>`: Path to the layout config JSON file to test.

#### Example:
```bash
npx ouas validate --manifest public/manifest.json --config config/layout.json
```

---

## Programmatic CLI Execution

You can also run the scanner directly in your node scripts:

```ts
import { generateManifest } from '@ouas/cli';

const manifest = generateManifest({
  dir: './src',
  appId: 'com.custom.app',
  appName: 'Custom App'
});

console.log("Successfully generated manifest:", JSON.stringify(manifest, null, 2));
```

---

## License

MIT © OUAS Team
