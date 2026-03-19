---
applyTo: "**/*.js"
description: "JavaScript and Node.js development best practices for the newBlogs project"
---

# JavaScript and Node.js Development Guidelines

## Code Style

- Use camelCase for variable and function names
- Use PascalCase for class and constructor names
- Use UPPER_SNAKE_CASE for constants
- Use descriptive and meaningful variable names
- Prefer const over let, avoid var
- Use template literals for string interpolation

## Modern JavaScript Practices

- Use async/await instead of callbacks or raw promises when possible
- Destructure objects and arrays for cleaner code
- Use arrow functions for callbacks and short functions
- Use spread operator for array and object manipulation
- Leverage optional chaining (?.) for safe property access
- Use nullish coalescing (??) for default values

## Express.js Best Practices

- Keep route handlers thin - delegate to controllers
- Use middleware for cross-cutting concerns
- Implement proper error handling middleware
- Use router-level middleware for route-specific logic
- Validate request parameters and body
- Use appropriate HTTP status codes
- Return consistent response formats

## MongoDB and Mongoose

- Define clear and validated schemas
- Use schema methods for model-specific logic
- Use query helpers for common database operations
- Implement proper indexing for performance
- Use transactions for operations requiring atomicity
- Avoid N+1 query problems with populate
- Use lean() for read-only operations to improve performance

## Error Handling

- Use try-catch blocks for async operations
- Create custom error classes for different error types
- Use centralized error handling middleware
- Log errors appropriately (don't expose sensitive info)
- Return meaningful error messages to clients
- Handle promise rejections properly

## Security Practices

- Validate and sanitize all user inputs
- Use bcrypt for password hashing
- Implement proper session management
- Protect against common vulnerabilities (XSS, CSRF, SQL injection)
- Use HTTPS in production
- Keep dependencies up to date
- Never commit sensitive data or credentials

## Asynchronous Code

- Always handle promise rejections
- Use Promise.all for parallel operations
- Avoid blocking the event loop
- Use async/await for better readability
- Properly propagate errors in async functions

## Module Organization

- One module per file with clear responsibility
- Export only what's necessary
- Use index.js files to aggregate exports when appropriate
- Keep module dependencies minimal and explicit
- Avoid circular dependencies

