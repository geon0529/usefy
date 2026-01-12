---
"@usefy/memory-monitor": patch
---

Fix HistoryChart tooltip showing duplicate "Total" labels

- Changed heapTotal label from "Total" to "Allocated" to differentiate from heapUsed
- Tooltip now correctly displays "Used" for heap used and "Allocated" for heap total
