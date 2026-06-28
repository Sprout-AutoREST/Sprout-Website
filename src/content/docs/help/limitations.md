---
title: Limitations
description: Things Sprout intentionally does not do and non-goals.
---

These are intentional non-goals of Sprout 1.x, not bugs. Some may be addressed in future
versions.

## No `@EmbeddedId` support

Entities with composite primary keys via `@EmbeddedId` are not supported. Sprout's ID
resolution logic handles single-field identifiers only. Using `@EmbeddedId` on an entity
annotated with `@SproutResource` causes a **compilation error** with a descriptive message.

**Workaround:** Use a surrogate single-column primary key for the entity if you need Sprout
to manage it.

---

## No paging, sorting, or filtering

Generated `GET /api/{resource}` returns the full collection. Sprout does not generate
`Page<T>` return types, `Pageable` parameters, query-by-example, or any filtering layer.

**Workaround:** Override `findAll()` in a custom service bean (see
[Customization](/reference/customization/)) and implement paging/filtering there, using
Spring Data's built-in `Pageable` support.

---

## Naive path pluralization

The default path derivation appends a literal `s`:
`Book` → `/api/books`, `Category` → `/api/categorys` (wrong).

**Workaround:** Always set `path` explicitly for entities with irregular plurals:

```java
@SproutResource(path = "/api/categories")
public class Category { ... }
```

---

## Shallow update (copies all properties except `"id"`)

The default update implementation uses:

```java
BeanUtils.copyProperties(entity, existing, "id");
```

This is a shallow, field-name-based copy. It does not support:

- **Partial updates (PATCH semantics):** all non-null and null fields are overwritten.
- **DTO mapping:** the request body is expected to be the entity type itself.
- **Safe handling of non-`"id"` identifiers:** if the identifier field is not literally
  named `id`, the copy will overwrite it — see the caveat in [ID Resolution](/reference/id-resolution/).

**Workaround:** Override `update(...)` in a custom service bean for any entity where the
default behavior is insufficient.

---

## No relationship management

Sprout generates flat CRUD for a single entity. It does not handle:

- Nested resource creation (`POST /api/books/{id}/chapters`)
- Cascade updates across associations
- DTO projection to hide or reshape related entities

**Workaround:** Implement nested-resource or relationship logic manually in a separate
controller and/or by overriding service methods.
