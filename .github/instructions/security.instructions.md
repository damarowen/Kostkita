---
applyTo: "**"
description: "Security best practices for the newBlogs project"
---

# Security Best Practices

## Input Validation and Sanitization

- Validate all user inputs on the server side
- Sanitize HTML input to prevent XSS attacks
- Use parameterized queries to prevent injection attacks
- Validate file uploads (type, size, content)
- Implement rate limiting for API endpoints
- Validate and sanitize URL parameters

## Authentication and Authorization

- Use strong password hashing with bcrypt
- Implement secure session management
- Use httpOnly and secure flags for cookies
- Implement proper logout functionality
- Check authorization on every protected route
- Use middleware for authentication checks
- Never expose user passwords in responses

## Data Protection

- Never commit sensitive data (API keys, passwords, secrets)
- Use environment variables for configuration
- Encrypt sensitive data at rest
- Use HTTPS in production
- Implement proper CORS policies
- Protect against CSRF attacks

## Database Security

- Use Mongoose schema validation
- Implement proper access controls
- Avoid exposing internal database IDs
- Use projections to limit exposed data
- Implement audit logging for sensitive operations
- Regular backups and disaster recovery plans

## Dependency Management

- Keep dependencies up to date
- Regularly audit dependencies for vulnerabilities
- Use npm audit to check for known vulnerabilities
- Remove unused dependencies
- Use lock files to ensure consistent installs

## Error Handling

- Don't expose stack traces in production
- Log errors securely without exposing sensitive data
- Use generic error messages for users
- Implement proper error monitoring
- Handle all promise rejections

## File Upload Security

- Validate file types and sizes
- Scan uploaded files for malware
- Store uploaded files outside web root
- Use unique filenames to prevent overwrites
- Implement access controls for uploaded files

## Session Security

- Use secure session configuration
- Implement session timeout
- Regenerate session IDs after login
- Protect against session fixation
- Clear sessions on logout

## API Security

- Implement rate limiting
- Use API authentication tokens
- Validate content-type headers
- Implement request size limits
- Use HTTPS for all API communications

