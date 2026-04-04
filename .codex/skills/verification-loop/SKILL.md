---
name: verification-loop
description: "A comprehensive verification system for Codex work sessions."
origin: ECC
---

# Verification Loop Skill

A comprehensive verification system for Codex work sessions.

## When to Use

Invoke this skill:
- After completing a feature or significant code change
- Before creating a PR
- When you want to ensure quality gates pass
- After refactoring

## Verification Phases

### Phase 1: Build Verification
```bash
# Check if the project builds
npm run build
# OR
pnpm build
```

If build fails, STOP and fix before continuing.

### Phase 2: Type Check
```bash
# TypeScript projects
npx tsc --noEmit

# Python projects
pyright .
```

Report all type errors. Fix critical ones before continuing.

### Phase 3: Lint Check
```bash
# JavaScript/TypeScript
npm run lint

# Python
ruff check .
```

### Phase 4: Test Suite
```bash
# Run tests with coverage
npm run test -- --coverage

# Check coverage threshold
# Target: 80% minimum
```

Report:
- Total tests: X
- Passed: X
- Failed: X
- Coverage: X%

### Phase 5: Security Scan
```bash
# Check for secrets
rg -n "sk-" -g "*.ts" -g "*.js" .
rg -n "api_key" -g "*.ts" -g "*.js" .

# Check for console.log
rg -n "console\\.log" -g "*.ts" -g "*.tsx" src
```

### Phase 6: Diff Review
```bash
# Show what changed
git diff --stat
git diff --name-only HEAD~1 HEAD
```

Review each changed file for:
- Unintended changes
- Missing error handling
- Potential edge cases

## Output Format

After running all phases, produce a verification report:

```
VERIFICATION REPORT
==================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY] for PR

Issues to Fix:
1. ...
2. ...
```

## Continuous Mode

For long sessions, run verification every 15 minutes or after major changes:

```markdown
Set a mental checkpoint:
- After completing each function
- After finishing a component
- Before moving to the next task

Re-run the checklist from Phase 1 to Phase 6.
```

## Integration with Hooks

This skill complements lightweight automated checks but provides deeper verification.
Automated checks catch issues quickly; this skill provides a comprehensive review pass.
