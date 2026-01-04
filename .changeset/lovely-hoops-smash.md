---
"@usefy/use-timer": patch
---

refactor(use-timer): simplify API by removing rawTime and decomposedTime

- Remove `initialTime`, `formattedTime` fields from return object
- Remove `hours`, `minutes`, `seconds`, `milliseconds` decomposed fields
- Change `time` to return formatted string directly (was `number`)
- Simplify hook internals by removing decompose utility usage
- Update tests and stories to match new API
