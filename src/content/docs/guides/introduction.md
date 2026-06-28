---
title: Introduction
description: What Sprout is, what it generates, and how the three modules fit together.
---

Sprout is a **compile-time annotation processor** that generates Spring Boot REST scaffolding from
your JPA entities. Annotate an entity, compile, and Sprout writes the REST layer into your build
output. You ship less boilerplate; Spring picks it up automatically.

## What Sprout generates

For every entity annotated with `@SproutResource`, Sprout produces five Java source files:

| Generated type | What it is |
|---|---|
| `Sprout{Name}Controller` | `@RestController` exposing CRUD endpoints |
| `Sprout{Name}Operations` | Interface the controller depends on (your override point) |
| `Sprout{Name}Service` | Default implementation of the operations interface |
| `Sprout{Name}Repository` | `JpaRepository` subinterface with a custom JPQL `deleteById` |
| `Sprout{Name}Marker` | Class with `public static final` constants (path, ID type, entity name, policies) |

Generated sources land in the entity's package under a `.generated` subpackage, so Spring's
component scan picks them up automatically as long as your `@SpringBootApplication` covers the
entity package.

## The three modules

Sprout is published as three separate artifacts so you only pull in what you need:

### `sprout-annotations`

Contains the public API:

- `@SproutResource` — marks an entity for generation and controls what is generated.
- `@SproutPolicy` — attaches SpEL-based security expressions per HTTP operation.
- `@SproutId` — overrides which field or getter Sprout treats as the entity identifier.
- `Endpoint` — enum used with `include`/`exclude` to select individual endpoints.

These annotations have `RetentionPolicy.SOURCE`; they exist only at compile time and are not
present in the compiled bytecode.

Add this as a regular `compile`/`implementation` dependency.

### `sprout-processor`

The `javax.annotation.processing.Processor` implementation. Registered automatically via Google
AutoService so no `META-INF/services` wiring is needed on your end.

Configure this as an **annotation processor** in your build tool — not a normal dependency.
See [Installation](/guides/installation/) for the exact Maven and Gradle snippets.

### `sprout-runtime` *(optional)*

Provides Spring Boot auto-configuration for two optional features:

- **Unified error responses** — a `@RestControllerAdvice` that converts common exceptions
  (validation failures, 404s, internal errors) into a consistent JSON structure.
- **Method-security auto-configuration** — enables `@EnableMethodSecurity` via a property so
  `@SproutPolicy` policies are enforced without any manual setup.

Add this only if you want these runtime features; Sprout works without it.
