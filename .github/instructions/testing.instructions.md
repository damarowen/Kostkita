---
applyTo: "**/*.test.js,**/*.spec.js,**/test/**/*.js"
description: "Testing standards and practices for the newBlogs project"
---

# Testing Guidelines

## Testing Strategy

- Write unit tests for business logic in controllers and models
- Write integration tests for API endpoints
- Write tests for middleware functions
- Test error handling paths
- Test authentication and authorization flows
- Test edge cases and boundary conditions

## Testing Framework

- Use Jest or Mocha as the primary testing framework
- Use Supertest for HTTP endpoint testing
- Use MongoDB Memory Server for database testing
- Use Sinon for mocking and stubbing when necessary

## Test Structure

- Follow Arrange-Act-Assert pattern
- One assertion per test when possible
- Use descriptive test names that explain the behavior
- Group related tests using describe blocks
- Use beforeEach and afterEach for setup and teardown
- Keep tests independent and isolated

## Unit Testing

- Test functions in isolation
- Mock external dependencies
- Test all code paths and branches
- Test error conditions
- Use meaningful test data

## Integration Testing

- Test API endpoints with real HTTP requests
- Use in-memory database for testing
- Test request validation
- Test response format and status codes
- Test authentication middleware
- Clean up test data after tests

## Coverage Goals

- Aim for at least 80% code coverage
- Focus on testing critical business logic
- Don't sacrifice test quality for coverage percentage
- Test edge cases and error conditions

## Test Organization

- Mirror the source code structure in test directories
- Name test files with .test.js or .spec.js suffix
- Group tests by feature or module
- Keep test files close to the code they test

## Mocking Strategy

- Mock external services (Cloudinary, email services)
- Mock database calls when testing business logic
- Use real database for integration tests
- Don't over-mock - test real behavior when possible

## Best Practices

- Write tests before or alongside code (TDD/BDD)
- Keep tests simple and readable
- Avoid test interdependencies
- Run tests frequently during development
- Fix failing tests immediately
- Don't commit failing tests

