---
title: Endpoints & HTTP Semantics
description: The HTTP methods, paths, status codes, and content types Sprout generates.
---

## Default endpoints

Assuming the base path resolves to `/api/books`:

| Method | Path | Success response | Error response |
|---|---|---|---|
| `GET` | `/api/books` | `200 OK` — JSON array | — |
| `GET` | `/api/books/{id}` | `200 OK` — JSON object | `404 Not Found` |
| `POST` | `/api/books` | `201 Created` — saved entity as JSON | `400 Bad Request` (validation) |
| `PUT` | `/api/books/{id}` | `200 OK` — updated entity as JSON | `404 Not Found` |
| `DELETE` | `/api/books/{id}` | `204 No Content` | `404 Not Found` |

## Content types

- All endpoints produce `application/json` (set at controller level).
- `POST` and `PUT` require `Content-Type: application/json`.

## Validation

- `POST` and `PUT` request bodies are annotated with `@Valid`.
- What the client sees on validation errors depends on whether you include
  [`sprout-runtime`](/reference/sprout-runtime/). Without it, Spring Boot's default error
  response applies. With it, you get structured JSON with per-field details.

## Selecting endpoints

Use `@SproutResource` attributes to limit which endpoints are generated:

```java
// Read-only API (GET /api/books and GET /api/books/{id} only)
@SproutResource(readOnly = true)

// Only specific endpoints:
@SproutResource(include = { Endpoint.GET_BY_ID, Endpoint.DELETE })

// Everything except DELETE:
@SproutResource(exclude = { Endpoint.DELETE })

// readOnly + exclude a specific read:
@SproutResource(readOnly = true, exclude = { Endpoint.GET_ALL })
```

The `Endpoint` enum values are: `GET_ALL`, `GET_BY_ID`, `CREATE`, `UPDATE`, `DELETE`.

`exclude` always wins over `include`. If `include` is empty, all endpoints are considered
included by default.

## `authenticationPrincipal`

When `@SproutResource(authenticationPrincipal = true)`, every generated controller method
receives an `Authentication authentication` parameter and passes it through to the
`Operations` layer:

```java
// Generated signature (example for getById):
public ResponseEntity<Book> getById(
    @PathVariable Long id,
    Authentication authentication) { ... }
```

The default generated service accepts the parameter but ignores it — this feature is designed
for use with custom overrides that need the caller's identity for tenant isolation, audit, or
fine-grained access control. See [Customization](/reference/customization/).

:::note
`authenticationPrincipal = true` requires Spring Security on the **compile** classpath. If
it is missing, the generated code references `Authentication` and your project will not compile.
:::
