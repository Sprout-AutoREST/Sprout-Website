---
title: Installation
description: How to add Sprout to a Maven or Gradle project.
---

Sprout is published to Maven Central under the group `de.flix29`.

```
Current version: 1.3.0
```

## Maven

Add `sprout-annotations` as a compile-time dependency and wire `sprout-processor` into the
`maven-compiler-plugin`'s annotation processor paths:

```xml
<properties>
  <sprout.version>1.3.0</sprout.version>
</properties>

<dependencies>
  <dependency>
    <groupId>de.flix29</groupId>
    <artifactId>sprout-annotations</artifactId>
    <version>${sprout.version}</version>
  </dependency>

  <!-- Optional: unified error handling + security autoconfig -->
  <dependency>
    <groupId>de.flix29</groupId>
    <artifactId>sprout-runtime</artifactId>
    <version>${sprout.version}</version>
  </dependency>
</dependencies>

<build>
  <plugins>
    <plugin>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.13.0</version>
      <configuration>
        <release>21</release>
        <parameters>true</parameters>
        <annotationProcessorPaths>
          <path>
            <groupId>de.flix29</groupId>
            <artifactId>sprout-processor</artifactId>
            <version>${sprout.version}</version>
          </path>
        </annotationProcessorPaths>
      </configuration>
    </plugin>
  </plugins>
</build>
```

:::note
`sprout-processor` must go in `annotationProcessorPaths`, not in `<dependencies>`. If you put
it in `<dependencies>`, Maven will include it on your application's runtime classpath, which is
unnecessary. Placed in `annotationProcessorPaths`, it runs only during compilation.
:::

## Gradle (Kotlin DSL)

```kotlin
val sproutVersion = "1.3.0"

dependencies {
    implementation("de.flix29:sprout-annotations:$sproutVersion")
    annotationProcessor("de.flix29:sprout-processor:$sproutVersion")

    // Optional: unified error handling + security autoconfig
    implementation("de.flix29:sprout-runtime:$sproutVersion")
}
```

:::note
If you use Lombok or other annotation processors, list them all together in the
`annotationProcessor` configuration — order does not matter for Sprout.
:::

## IDE setup

Annotation processing must be **enabled in your IDE** so that generated sources are visible
while you code:

- **IntelliJ IDEA**: Settings → Build, Execution, Deployment → Compiler → Annotation Processors
  → Enable annotation processing.
- **Eclipse**: Project Properties → Java Compiler → Annotation Processing → Enable.

Generated sources end up in your build output directory (Maven:
`target/generated-sources/annotations`). Most IDEs mark this directory as a generated source
root automatically.
