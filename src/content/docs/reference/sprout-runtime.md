---
title: sprout-runtime
description: The optional runtime module for unified error responses and method-security autoconfiguration.
---

`sprout-runtime` is an **optional** Spring Boot auto-configuration module. Add it only if you
want its features; Sprout's code generation works without it.

## Installation

```xml
<!-- Maven -->
<dependency>
  <groupId>de.flix29</groupId>
  <artifactId>sprout-runtime</artifactId>
  <version>1.3.0</version>
</dependency>
```

```kotlin
// Gradle
implementation("de.flix29:sprout-runtime:1.3.0")
```

---

## Unified error responses

When enabled, `sprout-runtime` registers a `@RestControllerAdvice` (`GlobalExceptionHandler`)
that converts common exceptions into a consistent JSON structure.

### Response format

```json
{
  "timestamp": "2026-01-23T12:34:56.789+01:00",
  "path": "/api/books",
  "status": 400,
  "error": "Bad Request",
  "code": "validation_failed",
  "message": "Request body validation failed",
  "errors": [
    {
      "field": "title",
      "code": "NotBlank",
      "message": "must not be blank",
      "rejectedValue": ""
    }
  ]
}
```

The `errors` array is present only for validation failures (HTTP 400); it is omitted for
other error types.

### Configuration properties

All properties use Spring Boot's relaxed binding (snake_case, kebab-case, or camelCase
accepted):

| Property | Default | Description |
|---|---|---|
| `sprout.errors.enabled` | `true` | Enable/disable the controller advice. Set to `false` to fall back to Spring Boot's default error handling. |
| `sprout.errors.log-stacktraces` | `false` | Log stack traces to the application log. Stack traces are **never** included in the API response. |
| `sprout.errors.internal-error-code` | `internal_error` | The `code` field value for HTTP 500 responses. |

Example `application.properties`:

```properties
sprout.errors.enabled=true
sprout.errors.log-stacktraces=false
sprout.errors.internal-error-code=internal_error
```

---

## Method-security auto-configuration

When Spring Security is on the runtime classpath, `sprout-runtime` can enable method security
for you — equivalent to placing `@EnableMethodSecurity` on a configuration class.

| Property | Default | Description |
|---|---|---|
| `sprout.security.method-security.enabled` | `false` | Set to `true` to activate `@EnableMethodSecurity`, making `@PreAuthorize` from `@SproutPolicy` take effect. |

```properties
sprout.security.method-security.enabled=true
```

:::note
This property only activates method security; Spring Security itself must still be on the
classpath. If Spring Security is absent, this property has no effect.
:::
