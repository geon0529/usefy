---
"@usefy/memory-monitor": patch
---

Fix HistoryChart tooltip showing duplicate labels

- Fixed formatter to correctly check Area component's name prop instead of dataKey
- Changed heapTotal label from "Total" to "Allocated" to clarify the difference
- Tooltip now correctly displays "Used" (current heap usage) and "Allocated" (total heap size)
