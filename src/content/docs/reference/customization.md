---
title: Customization
description: Override generated service logic and repository behavior.
---

Sprout is designed to be the starting point, not the ceiling. Two extension mechanisms cover
most use cases: overriding service logic and overriding the repository interface.

## Override service logic (recommended)

The generated controller depends on the `Sprout{Name}Operations` **interface**, not the
concrete `Sprout{Name}Service`. Providing your own `@Primary` implementation of that
interface replaces the default behavior without touching any generated code.

The simplest approach is to extend the generated service and only override the methods you
need:

```java
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import com.example.domain.generated.services.SproutBookService;
import com.example.domain.generated.repositories.SproutBookRepository;

@Service
@Primary
public class CustomBookService extends SproutBookService {

    public CustomBookService(SproutBookRepository repository) {
        super(repository);
    }

    @Override
    public List<Book> findAll() {
        // Add filtering, sorting, tenant isolation, etc.
        return super.findAll();
    }

    @Override
    public Book create(Book book) {
        // Add business rules before or after calling super
        book.setCreatedAt(Instant.now());
        return super.create(book);
    }
}
```

Key points:

- You can override only the methods you need; all others delegate to the generated
  implementation automatically.
- The operations interface is regenerated on every build — **do not edit the generated
  `Operations` interface or `Service`** directly. Your custom class lives in your own source
  tree and is unaffected by rebuilds.

### With `authenticationPrincipal = true`

If you set `authenticationPrincipal = true` on `@SproutResource`, the generated
`Operations` interface methods include an `Authentication authentication` parameter. Your
override receives it and can use it for tenant isolation, audit logging, or fine-grained
access control:

```java
@Override
public List<Book> findAll(Authentication authentication) {
    String tenantId = authentication.getName();
    return repository.findByTenantId(tenantId);
}
```

---

## Override repository generation

If you need custom Spring Data query methods, you can tell Sprout to generate the repository
as `@NoRepositoryBean` (a base interface that Spring Data will not register as a bean), and
then provide your own interface that extends it.

### Step 1 — enable override mode

```java
@Entity
@SproutResource(overrideRepository = true)
public class Book { ... }
```

Sprout now generates `SproutBookRepository` annotated with `@NoRepositoryBean` instead of
`@Repository`.

### Step 2 — provide your own repository

```java
import org.springframework.stereotype.Repository;
import com.example.domain.generated.repositories.SproutBookRepository;

@Repository
public interface BookRepository extends SproutBookRepository {

    // Spring Data query methods
    List<Book> findByAuthor(String author);

    @Query("SELECT b FROM Book b WHERE b.title LIKE %:keyword%")
    List<Book> searchByTitle(@Param("keyword") String keyword);
}
```

Your `BookRepository` becomes the Spring Data bean. The generated service still uses
`SproutBookRepository` as its dependency type, which is satisfied by your extending interface.

:::tip
If you only need query methods but not the override-repository mechanism (for example, your
service override can call the extra methods via a cast or a second constructor arg), you can
skip `overrideRepository = true` and simply define your own `@Repository` interface
separately. The two approaches are independent.
:::
