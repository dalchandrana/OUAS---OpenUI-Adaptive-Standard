/**
 * OUAS Core Types
 *
 * Shared TypeScript types for the OUAS validator, renderer, and SDK.
 * These types mirror the JSON Schema definitions in @ouas/spec.
 */

// ─── Field Types ─────────────────────────────────────────────────────────────

export type OUASFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'datetime'
  | 'enum'
  | 'array'
  | 'object';

export interface FieldDefinition {
  type: OUASFieldType;
  required: boolean;
  label?: string;
  values?: string[];
}

// ─── Component Types ─────────────────────────────────────────────────────────

export type ComponentCategory =
  | 'list-item'
  | 'detail'
  | 'action'
  | 'navigation'
  | 'container'
  | 'badge'
  | 'input'
  | 'display';

export interface ComponentConstraints {
  min_fields_visible?: number;
  required_fields_always_visible?: string[];
}

export interface ComponentDefinition {
  id: string;
  display_name: string;
  description: string;
  category: ComponentCategory;
  data_source: string;
  fields: Record<string, FieldDefinition>;
  slots?: string[];
  variants?: string[];
  constraints?: ComponentConstraints;
  locked?: boolean;
}

// ─── Data Source Types ───────────────────────────────────────────────────────

export interface DataSource {
  id: string;
  description: string;
  fields?: string[];
}

// ─── Manifest Types ──────────────────────────────────────────────────────────

export interface GlobalConstraints {
  max_components_per_layout?: number;
  [key: string]: unknown;
}

export interface Manifest {
  ouas_version: string;
  app_id: string;
  app_name: string;
  generated_at: string;
  manifest_version?: string;
  components: ComponentDefinition[];
  data_sources: DataSource[];
  constraints?: GlobalConstraints;
  component_aliases?: Record<string, string>;
  agent_scope?: {
    allowed_regions?: string[];
    locked_components?: string[];
  };
}

// ─── Layout Config Types ─────────────────────────────────────────────────────

export type LayoutType =
  | 'single-column'
  | 'two-column'
  | 'grid'
  | 'masonry'
  | 'calendar'
  | 'kanban'
  | 'custom';

export interface SortInstruction {
  field: string;
  direction: 'asc' | 'desc';
}

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'not_contains'
  | 'in'
  | 'not_in';

export interface FilterInstruction {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export type RegionPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Region {
  id: string;
  component: string;
  variant?: string;
  visible_fields: string[];
  hidden_fields?: string[];
  sort?: SortInstruction;
  filter?: FilterInstruction | null;
  slots?: Record<string, string | string[]>;
  position?: RegionPosition;
}

export interface Layout {
  type: LayoutType;
  regions: Region[];
}

export type ThemeDensity = 'compact' | 'comfortable' | 'spacious';

export interface Theme {
  density?: ThemeDensity;
  accent_color?: string | null;
}

export interface LayoutConfig {
  ouas_version: string;
  config_id: string;
  app_id: string;
  user_id: string;
  manifest_version: string;
  created_by_agent: string;
  created_at: string;
  description: string;
  layout: Layout;
  theme?: Theme;
}

// ─── Validation Types ────────────────────────────────────────────────────────

export type ValidationErrorCode =
  | 'SCHEMA_INVALID'
  | 'APP_ID_MISMATCH'
  | 'COMPONENT_NOT_FOUND'
  | 'FIELD_NOT_FOUND'
  | 'REQUIRED_FIELD_HIDDEN'
  | 'CONSTRAINT_VIOLATION'
  | 'DATA_SOURCE_INVALID'
  | 'VARIANT_NOT_FOUND'
  | 'SLOT_NOT_FOUND'
  | 'MANIFEST_VERSION_MISMATCH'
  | 'CONFIG_UNRECOVERABLE'
  | 'COMPONENT_LOCKED'
  | 'REGION_NOT_IN_SCOPE'
  | 'CONFIG_TOO_LARGE'
  | 'TOO_MANY_REGIONS'
  | 'STRING_TOO_LONG';

export interface ValidationError {
  code: ValidationErrorCode;
  component?: string;
  field?: string;
  region?: string;
  message: string;
  suggestion?: string;
  available_values?: string[];
}

export interface ValidationWarning {
  code: string;
  component?: string;
  field?: string;
  message: string;
}

export type MigrationWarningType = 'component_renamed' | 'component_removed' | 'field_removed';

export interface MigrationWarning {
  type: MigrationWarningType;
  old_id?: string;
  new_id?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  migration_applied?: boolean;
  migration_warnings?: MigrationWarning[];
}

// ─── Migration Types ─────────────────────────────────────────────────────────

export interface MigrationResult {
  migrated: boolean;
  config: LayoutConfig;
  warnings: MigrationWarning[];
  unrecoverable: boolean;
}
