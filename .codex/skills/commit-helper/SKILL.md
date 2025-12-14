---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.
---

# Generating Commit Messages

## Instructions

1. Run `git diff --staged` to see changes
2. I'll suggest a commit message with:
   - Summary under 50 characters
   - Detailed description
   - Affected components
   - Use prefix. type:
     - feat: new feature
     - fix: bug fix
     - docs: docs only
     - style: formatting (no behavior change)
     - refactor: refactor (no feature/bugfix)
     - perf: performance improvement
     - test: add/update tests
     - build: build/deps changes
     - ci: CI config/scripts

## Best practices

- Use present tense
- Explain what and why, not how
