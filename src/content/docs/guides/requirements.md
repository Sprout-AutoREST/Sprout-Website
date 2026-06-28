---
title: Requirements
description: Build-time and runtime compatibility requirements for Sprout.
---

## Build-time requirements

These apply to the project that _uses_ Sprout (your application, not Sprout's own build):

| Requirement | Minimum |
|---|---|
| JDK | 21+ |
| Maven | 3.9+ (if using Maven) |
| Gradle | Any modern version that supports `annotationProcessor` configuration |

Sprout's annotation processor is compiled with `maven.compiler.release=21` and declares
`@SupportedSourceVersion(RELEASE_21)`. You must compile your application with JDK 21 or later.

## Runtime requirements

Generated code is standard Spring Boot code. You need the usual Spring Boot stack:

| Dependency | Version |
|---|---|
| Spring Boot | 3.5.x or later |
| `spring-boot-starter-web` | for the generated `@RestController` |
| `spring-boot-starter-data-jpa` | for the generated `JpaRepository` |
| A JPA provider (e.g. Hibernate) and a database driver | as normal |

## Optional runtime requirements

These are only needed when you use the corresponding Sprout features:

| Feature | Required dependency |
|---|---|
| Bean validation on POST/PUT (`@Valid`) | `spring-boot-starter-validation` |
| `@SproutPolicy` security expressions | `spring-boot-starter-security` |
| `authenticationPrincipal = true` | `spring-boot-starter-security` |
| OpenAPI / Swagger docs | `springdoc-openapi-starter-webmvc-ui` (or equivalent SpringDoc artifact) |
| Unified error handling + security autoconfig | `sprout-runtime` |

:::tip
If a required optional dependency is missing, Sprout **degrades gracefully**: it logs a
compile-time warning and generates the controller without the missing annotation
(`@ApiResponses`, `@PreAuthorize`, etc.). Your app still compiles and runs; only the optional
feature is absent.
:::

:::caution
If `authenticationPrincipal = true` is set and Spring Security is not on the compile classpath,
the generated controller will reference `org.springframework.security.core.Authentication` and
your project **will not compile**. Either add Spring Security or leave `authenticationPrincipal`
at its default (`false`).
:::
