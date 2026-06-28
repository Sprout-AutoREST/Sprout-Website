---
title: Optional Integrations
description: How to enable Swagger/OpenAPI documentation and Spring Security policy enforcement.
---

Sprout detects optional dependencies on the compile classpath and adjusts generated code
accordingly. Both integrations degrade gracefully — if a required class is missing, Sprout
logs a warning and generates without that feature rather than failing the build.

## Swagger / OpenAPI (SpringDoc)

When SpringDoc is on the compile classpath, Sprout adds OpenAPI annotations to generated
controllers automatically (controlled by `@SproutResource(generateSwaggerDocs = true)`, which
is the default).

### Setup

Add SpringDoc to your dependencies:

```xml
<!-- Maven -->
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.x.x</version>
</dependency>
```

```kotlin
// Gradle
implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.x.x")
```

### What gets generated

Sprout checks for:
- `io.swagger.v3.oas.annotations.tags.Tag`
- `io.swagger.v3.oas.annotations.responses.ApiResponses`

When present, generated controllers receive:
- `@Tag(name = "...", description = "...")` on the controller class, using `@SproutResource`'s
  `tag` and `summary` fields (falls back to the entity name if not set).
- `@ApiResponses` on each endpoint method with the appropriate HTTP status code annotations.

### Disable for a specific entity

```java
@SproutResource(generateSwaggerDocs = false)
public class InternalEntity { ... }
```

---

## Spring Security (`@SproutPolicy`)

When Spring Security is on the compile classpath and `@SproutPolicy` has non-blank policy
strings, Sprout adds `@PreAuthorize("...")` to the corresponding controller methods.

### Setup

1. Add Spring Security:

```xml
<!-- Maven -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

2. Enable method security — choose one:

   **Option A** — manual annotation on a config class:
   ```java
   @Configuration
   @EnableMethodSecurity
   public class SecurityConfig { ... }
   ```

   **Option B** — via `sprout-runtime` property (see [sprout-runtime](/reference/sprout-runtime/)):
   ```properties
   sprout.security.method-security.enabled=true
   ```

3. Annotate your entity:

```java
@Entity
@SproutResource
@SproutPolicy(
    read   = "isAuthenticated()",
    create = "hasRole('ADMIN')",
    update = "hasRole('ADMIN')",
    delete = "hasRole('ADMIN')"
)
public class Book { ... }
```

### How policies map to endpoints

| `@SproutPolicy` field | Applies to endpoints |
|---|---|
| `read` | `GET_ALL` and `GET_BY_ID` |
| `create` | `CREATE` (POST) |
| `update` | `UPDATE` (PUT) |
| `delete` | `DELETE` |

Leaving a field blank means no `@PreAuthorize` is added for that operation.

### Compile-time SpEL validation

Sprout parses all policy strings at compile time. An invalid SpEL expression causes a
**compilation error**, not a runtime failure:

```java
// This will fail at compile time:
@SproutPolicy(read = "hasRole(")  // syntax error
```

### Authentication principal

If you need the caller's identity inside your custom service logic, use
`authenticationPrincipal = true` together with `@SproutPolicy`:

```java
@SproutResource(
    authenticationPrincipal = true
)
@SproutPolicy(read = "isAuthenticated()")
public class Book { ... }
```

Generated controller methods will receive the `Authentication` object and pass it through to
the operations layer, where your custom service override can consume it.
