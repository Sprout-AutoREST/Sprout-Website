---
title: Generated Code Layout
description: Where Sprout puts generated files and how it names them.
---

## Package structure

Sprout writes generated sources into the entity's package under a `.generated` subpackage,
then further splits by responsibility:

```
{entity-package}.generated.controllers
{entity-package}.generated.services
{entity-package}.generated.repositories
{entity-package}.generated.marker
```

For an entity `com.example.domain.Book`, the full set of generated types is:

| Type | Fully-qualified name |
|---|---|
| Controller | `com.example.domain.generated.controllers.SproutBookController` |
| Operations interface | `com.example.domain.generated.services.SproutBookOperations` |
| Service | `com.example.domain.generated.services.SproutBookService` |
| Repository | `com.example.domain.generated.repositories.SproutBookRepository` |
| Marker | `com.example.domain.generated.marker.SproutBookMarker` |

## Naming rules

- The base name (`Book` in the example) comes from `@SproutResource(name = "...")`. If `name`
  is not set, the entity class name is used.
- All generated classes are prefixed with `Sprout`.

## Build output path

Maven writes generated sources to:
```
target/generated-sources/annotations/{package-path}/
```

Gradle typically uses:
```
build/generated/sources/annotationProcessor/java/main/{package-path}/
```

Most IDEs mark these directories as generated source roots automatically.

## Important behavior

- Generated sources are **overwritten on every rebuild**. Never edit them directly; your
  changes will be lost.
- The controller depends on the `Operations` **interface**, not the concrete service class.
  This is the intentional override point — see [Customization](/reference/customization/).
- Generated types are standard Spring components (`@RestController`, `@Service`,
  `@Repository`) and are picked up by component scanning like any hand-written bean.
  Ensure your `@SpringBootApplication` scans the entity's package (or a parent package).
