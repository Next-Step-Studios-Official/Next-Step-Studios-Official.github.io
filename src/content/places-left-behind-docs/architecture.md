---
title: "Architecture"
version: "Not versioned"
docStatus: "Reference"
summary: "The solution's engine and game split, world and entity architecture, rendering direction and asset pipeline."
sourceId: ""
sourcePath: "Documentation/Architecture.md"
category: "engineering"
order: 10
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: false
---
## Overall structure

The solution is divided into two primary projects.

### Engine

The Engine project provides reusable technical functionality.

Responsibilities include:

- Application lifecycle
- Window management
- Vulkan initialization
- Rendering
- Materials and textures
- Asset loading
- Input
- Audio
- Physics
- Scene management
- Entity management
- Component management
- Transform management
- Utilities

### Game

The Game project contains the game-specific implementation.

Responsibilities include:

- Player movement
- Interaction
- Investigation
- Photography
- Clue collection
- Narrative systems
- Location-specific gameplay
- User interface
- Saving and loading

## World architecture

The engine uses a scene-based world structure.

- Scenes contain entities.
- Entities have unique identifiers and transforms.
- Entities can be activated or deactivated.
- Scenes manage entity initialization, updating, and shutdown.
- The SceneManager controls the active scene.

## Entity component architecture

Entities use an object-component model.

- Entities can own multiple components.
- Each component belongs to one entity.
- Components have independent enabled states.
- Components receive lifecycle events from their owning entity.
- Components can be added or removed at runtime.
- Components are initialized, updated, and shut down through their owner.

Future component types may include:

- Camera components
- Rendering components
- Collider components
- Interaction components
- Investigation components
- Audio components

Parent-child transform hierarchies will be introduced as the engine develops.

## Rendering direction

The renderer uses Vulkan as its graphics API.

GLSL is used as the shader source language, with shaders compiled into SPIR-V.

The renderer is intended to support physically based rendering.

Planned material inputs include:

- Base color
- Normal
- Roughness
- Metallic
- Ambient occlusion
- Emissive
- Optional height or displacement

Environment lighting and image-based lighting are also planned.

## Asset pipeline

Blender is the primary modelling tool.

glTF 2.0 and GLB are the intended interchange formats.

Asset loading will be implemented as a reusable engine system.
