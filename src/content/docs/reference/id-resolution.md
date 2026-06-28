---
title: ID Resolution
description: How Sprout finds the entity identifier and important caveats.
---

## Detection priority

Sprout searches the entity class for exactly one non-static field or getter method annotated
with one of these, in order:

1. `@de.flix29.sprout.annotations.SproutId`
2. `@jakarta.persistence.Id`
3. `@javax.persistence.Id`

**Rules:**
- Exactly one ID element must be found. Zero or more than one causes a **compilation error**.
- Getter methods are considered only when they are non-static, have no parameters, and return
  a non-void type.
- `@EmbeddedId` is **not supported** and causes a compilation error.

## What the resolved ID affects

| Generated element | How the ID is used |
|---|---|
| Controller path variable | `{id}` is typed to the resolved ID's Java type |
| Repository delete query | `delete from {EntityName} e where e.{idProperty} = :id` |
| Marker class constants | `ID_CLASS`, `ID_PROPERTY` |

## Using `@SproutId` to override

`@SproutId` lets you route Sprout's operations through a different property than the JPA
primary key:

```java
@Entity
@SproutResource
public class User {
    @Id
    private Long dbId;     // JPA primary key — NOT used by Sprout for URLs

    @SproutId
    private String username; // Sprout routes GET/PUT/DELETE by this
}
```

Generated endpoints become `/api/users/{username}` (path variable type: `String`).

## Caveat: default update ignores only `"id"`

The generated update service method uses:

```java
BeanUtils.copyProperties(entity, existing, "id");
```

This explicitly skips copying a property literally named `id`. If your identifier property
has a different name (e.g. `username`, `bookId`), the default update logic **will overwrite
it** with whatever the client sends in the request body.

**Recommendation:** if you use `@SproutId` or `@Id` on a field not named `id`, override
the `update(...)` method in your custom operations bean:

```java
@Override
public Book update(String username, Book incoming) {
    Book existing = repository.findById(username)
        .orElseThrow(() -> new NoSuchElementException("Not found: " + username));
    // Copy safely, excluding your ID property explicitly:
    BeanUtils.copyProperties(incoming, existing, "username");
    return repository.save(existing);
}
```

See [Customization](/reference/customization/) for the full override pattern.
