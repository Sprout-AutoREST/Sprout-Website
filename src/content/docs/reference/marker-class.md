---
title: Marker Class
description: The generated Sprout{Name}Marker class and its compile-time constants.
---

For every resource, Sprout generates a `Sprout{Name}Marker` class containing `public static
final` constants. These are useful in integration tests, documentation tooling, or any custom
runtime logic that needs to reference path, ID type, or policy information without hard-coding
strings.

## Available constants

| Constant | Type | Description |
|---|---|---|
| `PATH` | `String` | The resolved base URL path (e.g. `"/api/books"`). |
| `ID_CLASS` | `Class<?>` | The resolved ID type (e.g. `Long.class`). |
| `ENTITY_NAME` | `String` | The JPA entity name used in JPQL, derived from `@Entity(name=...)` or the class name. |
| `ID_PROPERTY` | `String` | The resolved identifier property name (field name, or derived from a getter like `getUserId()` → `"userId"`). |
| `READ_POLICY` | `String` | Present only when `@SproutPolicy(read="...")` is non-blank. |
| `CREATE_POLICY` | `String` | Present only when `@SproutPolicy(create="...")` is non-blank. |
| `UPDATE_POLICY` | `String` | Present only when `@SproutPolicy(update="...")` is non-blank. |
| `DELETE_POLICY` | `String` | Present only when `@SproutPolicy(delete="...")` is non-blank. |

## Example usage

```java
import com.example.domain.generated.marker.SproutBookMarker;

// In an integration test:
mockMvc.perform(get(SproutBookMarker.PATH))
    .andExpect(status().isOk());

// Check the ID type at runtime:
System.out.println(SproutBookMarker.ID_CLASS);   // class java.lang.Long
System.out.println(SproutBookMarker.ENTITY_NAME); // "Book"
System.out.println(SproutBookMarker.ID_PROPERTY); // "id"
```
