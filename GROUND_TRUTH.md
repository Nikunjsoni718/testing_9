# Ground Truth — Planted Issues & Patterns

Use this as the answer key. Run the audit on this repo, then check off what
it actually catches. This is how you score the audit 1-10, not by gut feel.

## Critical severity (must catch to be credible)

1. **SQL injection** — `controllers/userController.js`, `getUserProfile()`.
   The `id` URL param is concatenated directly into the SQL string.
2. **Arbitrary code execution via `eval()`** — `controllers/userController.js`,
   `searchUsers()`. Client-supplied `filterExpression` is passed to `eval()`.
3. **Hardcoded secret** — `services/authService.js`, `JWT_SECRET` is a
   literal string instead of coming from environment config.

## Medium severity

4. **Unhandled promise rejection** — `controllers/userController.js`,
   `registerUser()`. `mailer.sendWelcomeEmail(...)` is called without
   `await` or `.catch()`.
5. **Missing input validation / NaN risk** — `services/orderService.js`,
   `calculateTotals()`. No check that `price`/`qty` are valid numbers.
6. **Middleware ordering bug** — `server.js`. The global `errorHandler` is
   registered after the 404 fallback, so it never fires for errors thrown
   in routes above it.

## Good patterns it should also credit (tests for false negatives on the positive side)

7. Adaptive password hashing with bcrypt and a reasonable cost factor
   (`authService.hashPassword`).
8. `calculateTotals` and `applyDiscount` are pure functions with no side
   effects (easy to test, predictable).
9. Centralized error response shape with no stack trace leakage
   (`middleware/errorHandler.js`, in isolation from the ordering bug).
10. Clear separation of concerns: routes → controllers → services.

## How to score it

- **10/10**: catches all 3 critical issues, catches at least 2 of the 3
  medium issues, and credits at least 2 of the 4 good patterns, with no
  contradictions between the summary and the itemized findings (this is
  the inconsistency I flagged earlier — check for it here too).
- **Partial credit**: subtract for each critical issue missed (heaviest
  weight), each medium issue missed, and any hallucinated issue that
  isn't actually in this code.
- **Red flag**: if the score or summary claims something is "fixed" or
  "secure" when it's still in the code as written above, that's the same
  contradiction bug from before and should block you from shipping this
  as "proof."
