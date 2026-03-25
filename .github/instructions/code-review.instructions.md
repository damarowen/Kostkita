---
applyTo: "**"
description: "Code review standards and GitHub review guidelines"
---

# Code Review Guidelines

## Code Review Principles

- Review code thoroughly but constructively
- Focus on code quality, not personal preferences
- Provide specific, actionable feedback
- Explain the reasoning behind suggestions
- Distinguish between critical issues and suggestions
- Review for functionality, security, and maintainability

## What to Review

- Code correctness and logic
- Error handling and edge cases
- Security vulnerabilities
- Performance implications
- Code readability and maintainability
- Test coverage and quality
- Documentation completeness
- Adherence to project standards

## Review Checklist

### Functionality
- Does the code work as intended?
- Are all requirements met?
- Are edge cases handled?
- Is error handling appropriate?

### Security
- Is user input validated and sanitized?
- Are there potential security vulnerabilities?
- Are credentials or secrets exposed?
- Is authentication/authorization properly implemented?

### Performance
- Are there obvious performance issues?
- Are database queries optimized?
- Is caching used appropriately?
- Are resources properly released?

### Code Quality
- Is the code readable and understandable?
- Are functions and variables named descriptively?
- Is the code properly organized?
- Are there code smells or anti-patterns?

### Testing
- Are there adequate tests?
- Do tests cover critical paths?
- Are tests meaningful and maintainable?
- Do all tests pass?

### Documentation
- Is the code properly documented?
- Are complex sections explained?
- Is API documentation updated?
- Are breaking changes documented?

## Review Process

- Review code within 24 hours when possible
- Use GitHub review features (comments, suggestions)
- Request changes for critical issues
- Approve when code meets standards
- Follow up on requested changes
- Test code locally for complex changes

## Providing Feedback

- Be respectful and constructive
- Use "we" instead of "you"
- Ask questions rather than making demands
- Provide examples or alternatives
- Acknowledge good practices
- Focus on the code, not the person

## Receiving Feedback

- Be open to suggestions
- Ask for clarification when needed
- Explain your reasoning if you disagree
- Make requested changes promptly
- Thank reviewers for their time
- Learn from feedback

## GitHub Review Guidelines

- Use inline comments for specific issues
- Use review comments for general feedback
- Suggest code changes when appropriate
- Mark conversations as resolved when addressed
- Use appropriate review status (approve, request changes, comment)
- Link to relevant documentation or examples

## Common Issues to Watch For

- Hardcoded values that should be configurable
- Missing error handling
- Security vulnerabilities
- Performance bottlenecks
- Inconsistent code style
- Missing tests
- Inadequate documentation
- Breaking changes without migration path

