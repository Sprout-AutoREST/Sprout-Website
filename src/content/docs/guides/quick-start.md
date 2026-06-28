---
title: Quick Start
description: From zero to a working REST API in four steps.
---

## 1. Add dependencies

Follow the [Installation guide](/guides/installation/) to add `sprout-annotations` and
`sprout-processor` to your project.

## 2. Annotate your entity

```java
import de.flix29.sprout.annotations.SproutResource;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
@SproutResource
public class Book {
    @Id
    private Long id;
    private String title;
    private String author;

    // getters / setters ...
}
```

`@SproutResource` with no attributes uses all defaults:

- Resource name: `Book` (the class name)
- Base path: `/api/books` (lowercase + `s`)
- All five CRUD endpoints are generated

## 3. Build

```bash
mvn clean package
# or
./gradlew build
```

During compilation you will see Sprout's log output prefixed with `[Sprout]`:

```
[Sprout] Processing: com.example.domain.Book
[Sprout] Resolved ID: field 'id' (type: java.lang.Long)
[Sprout] Base API path: /api/books
[Sprout] Generating: SproutBookController, SproutBookService, ...
```

Generated sources land at:
```
target/generated-sources/annotations/com/example/domain/generated/
├── controllers/SproutBookController.java
├── services/SproutBookOperations.java
├── services/SproutBookService.java
├── repositories/SproutBookRepository.java
└── marker/SproutBookMarker.java
```

## 4. Run and test

Start your Spring Boot application. The generated controller is a standard `@RestController`,
picked up by component scanning as long as your `@SpringBootApplication` covers the entity's
package (or a parent package).

```bash
# List all books
curl http://localhost:8080/api/books

# Create a book
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Clean Code","author":"Robert C. Martin"}'

# Get by ID
curl http://localhost:8080/api/books/1

# Update
curl -X PUT http://localhost:8080/api/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Clean Code (2nd Ed.)","author":"Robert C. Martin"}'

# Delete
curl -X DELETE http://localhost:8080/api/books/1
```

## Next steps

- [Annotations reference](/reference/annotations/) — learn all `@SproutResource` options
- [Customization](/reference/customization/) — override service logic for your entity
- [Security Policies](/reference/integrations/) — add `@PreAuthorize` per endpoint
