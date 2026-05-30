# OUAS Spec Versioning Policy

The spec follows semantic versioning: MAJOR.MINOR.PATCH

**PATCH** (e.g. 1.0.1) — Clarifications, typo fixes, better examples. No changes to schemas. Existing implementations remain valid.

**MINOR** (e.g. 1.1.0) — New optional fields added to schemas. Backwards compatible. Existing configs and manifests remain valid. Implementations that don't use the new fields are unaffected.

**MAJOR** (e.g. 2.0.0) — Breaking changes to required fields, renamed fields, or changed validation rules. Existing configs or manifests MAY become invalid. A migration guide is published alongside the release.

**Current version:** 1.0.0

All OUAS packages (`@ouas/validator`, `@ouas/renderer`, `@ouas/react`) declare which spec version they implement via a `ouas_spec_version` field in their `package.json`. A validator built for spec 1.x will refuse to process a manifest declaring `ouas_version: "2.0"`.
