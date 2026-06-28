---
title: Troubleshooting
description: Common problems and how to resolve them.
---

## Reading Sprout's compile-time output

Sprout emits compiler notes prefixed with `[Sprout]`. During a Maven build you will see lines
like:

```
[Sprout] Processing: com.example.domain.Book
[Sprout] Resolved ID: field 'id' (type: java.lang.Long)
[Sprout] Base API path: /api/books
```

Warnings about missing optional dependencies also use this prefix, so check the full build
output if something is missing.

---

## "Nothing is generated"

**Symptoms:** No `Sprout*` files appear in the build output.

**Checklist:**

1. **Annotation processing is disabled in your IDE or build.**
   - Maven: verify `sprout-processor` is in `<annotationProcessorPaths>` inside
     `maven-compiler-plugin`, not in `<dependencies>`.
   - Gradle: verify it uses the `annotationProcessor` configuration, not `implementation`.
   - IDE: enable annotation processing (see [Installation](/guides/installation/)).

2. **The entity is not annotated.** `@SproutResource` has `RetentionPolicy.SOURCE`; it is
   absent from bytecode, so runtime reflection cannot find it. Sprout only sees it at compile
   time. Confirm the annotation is on the entity class.

3. **A compilation error earlier in the build aborted processing.** Sprout only runs when the
   source files it annotates compile without errors.

---

## "Generated controllers are not picked up by Spring"

**Symptoms:** App starts but endpoints return 404.

Generated controllers live in `{entity-package}.generated.controllers`. Spring's component
scan must include this package.

- If your `@SpringBootApplication` is in a parent package of the entity package, the scan
  covers it automatically.
- If your application class is in a different root package, add an explicit scan:

```java
@SpringBootApplication
@ComponentScan({ "com.example.app", "com.example.domain" })
public class MyApplication { ... }
```

---

## "Swagger/OpenAPI tags and responses are missing"

**Symptoms:** Sprout generated controllers, but they have no `@Tag` or `@ApiResponses`.

- Ensure `@SproutResource(generateSwaggerDocs = true)` (this is the default; check that it
  hasn't been set to `false`).
- Ensure SpringDoc OpenAPI types are on the **compile** classpath at the time Sprout runs.
  If they are present only at runtime (`runtimeOnly`/`runtime` scope) Sprout cannot see them
  and will skip annotation generation.

---

## "`@SproutPolicy` has no effect (endpoints not protected)"

`@PreAuthorize` is generated but has no runtime effect without method security enabled.

- Add `@EnableMethodSecurity` to a `@Configuration` class, **or**
- Set `sprout.security.method-security.enabled=true` via `sprout-runtime`.
- Also confirm Spring Security is on the classpath and you have a `SecurityFilterChain` bean
  configured.

---

## "Compilation error: multiple IDs / no ID found"

Sprout requires exactly one identifier field or getter per entity.

- **No ID found:** add `@jakarta.persistence.Id` to the primary key field, or use
  `@SproutId` on a different field.
- **Multiple IDs found:** ensure only one field/getter carries one of: `@SproutId`,
  `@jakarta.persistence.Id`, `@javax.persistence.Id`.
- **Using `@EmbeddedId`:** this is not supported. See [Limitations](/help/limitations/).

---

## "Compilation error: invalid SpEL in `@SproutPolicy`"

Sprout validates all SpEL expressions at compile time. A syntax error in any `@SproutPolicy`
string fails the build with a message pointing to the offending annotation. Fix the
expression and recompile.

---

## "Project doesn't compile after enabling `authenticationPrincipal = true`"

`authenticationPrincipal = true` causes Sprout to add `Authentication authentication`
parameters to generated controller methods. This type comes from
`spring-boot-starter-security`. If Spring Security is not on your compile classpath, the
generated files reference an unknown type and compilation fails.

- Add `spring-boot-starter-security` as a dependency, **or**
- Remove `authenticationPrincipal = true` (default is `false`).
