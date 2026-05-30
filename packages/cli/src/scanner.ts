/**
 * OUAS CLI — Scanner
 *
 * Scans a TypeScript/JavaScript project for withOUAS() calls and extracts
 * the component metadata from the definition objects.
 *
 * Uses the TypeScript Compiler API to parse AST and find withOUAS() invocations.
 */

import * as ts from 'typescript';
import * as path from 'path';
import { glob } from 'glob';
import type { OUASComponentDefinition } from '@ouas/react';

interface ScanResult {
  components: OUASComponentDefinition[];
  files: string[];
  errors: string[];
}

/**
 * Scans a project directory for withOUAS() calls and extracts component definitions.
 *
 * @param projectDir - Root directory of the project to scan
 * @param include - Glob patterns to include (default: src/**\/*.{ts,tsx})
 * @returns ScanResult with extracted component definitions
 */
export async function scanProject(
  projectDir: string,
  include: string[] = ['src/**/*.{ts,tsx,js,jsx}'],
): Promise<ScanResult> {
  const components: OUASComponentDefinition[] = [];
  const errors: string[] = [];

  // Find all matching files
  const files: string[] = [];
  for (const pattern of include) {
    const matched = await glob(pattern, { cwd: projectDir, absolute: true });
    files.push(...matched);
  }

  // Parse each file
  for (const filePath of files) {
    try {
      const extracted = extractFromFile(filePath);
      components.push(...extracted);
    } catch (error) {
      errors.push(
        `Failed to parse ${path.relative(projectDir, filePath)}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  return {
    components,
    files,
    errors,
  };
}

/**
 * Extracts OUAS component definitions from a single file.
 */
function extractFromFile(filePath: string): OUASComponentDefinition[] {
  const program = ts.createProgram([filePath], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX,
    allowJs: true,
  });

  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) return [];

  const definitions: OUASComponentDefinition[] = [];

  function visit(node: ts.Node) {
    // Look for: withOUAS(Component, { ... })
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'withOUAS' &&
      node.arguments.length >= 2
    ) {
      const defArg = node.arguments[1];
      if (defArg && ts.isObjectLiteralExpression(defArg)) {
        const definition = parseObjectLiteral(defArg, sourceFile!);
        if (definition) {
          definitions.push(definition as unknown as OUASComponentDefinition);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return definitions;
}

/**
 * Parses an object literal AST node into a plain object.
 * Handles nested objects and arrays.
 */
function parseObjectLiteral(
  node: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
): Record<string, unknown> | null {
  const result: Record<string, unknown> = {};

  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;

    const name = prop.name.getText(sourceFile);
    const value = parseValue(prop.initializer, sourceFile);
    result[name] = value;
  }

  return result;
}

/**
 * Parses a TypeScript AST value node into a JavaScript value.
 */
function parseValue(node: ts.Expression, sourceFile: ts.SourceFile): unknown {
  // String literal
  if (ts.isStringLiteral(node)) {
    return node.text;
  }

  // Numeric literal
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }

  // Boolean
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;

  // Array literal
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((el) => parseValue(el, sourceFile));
  }

  // Object literal (nested)
  if (ts.isObjectLiteralExpression(node)) {
    return parseObjectLiteral(node, sourceFile);
  }

  // Fallback — return the raw text
  return node.getText(sourceFile);
}
