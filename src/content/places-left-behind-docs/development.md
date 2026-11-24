---
title: "Development notes"
version: "Not versioned"
docStatus: "Reference"
summary: "Naming, asset and general development rules used in the game repository."
sourceId: ""
sourcePath: "Documentation/Development.md"
category: "engineering"
order: 20
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: false
---
## General rules

- Keep engine functionality separate from game-specific functionality.
- Prefer small, understandable systems over large monolithic classes.
- Avoid unnecessary dependencies.
- Keep asset naming consistent.
- Use Git for meaningful development checkpoints.
- Do not commit generated build output.

## Naming conventions

- C# types: PascalCase
- Methods: PascalCase
- Public properties: PascalCase
- Private fields: _camelCase
- Local variables: camelCase
- Constants: PascalCase

## Asset naming

Use descriptive names.

Examples:

- AbandonedOffice_Chair.glb
- WoodenTable_BaseColor.png
- WoodenTable_Normal.png
- Office_Ambience.wav

## Development approach

Build one working system at a time.

Do not implement every planned engine subsystem before testing the first rendered scene.
