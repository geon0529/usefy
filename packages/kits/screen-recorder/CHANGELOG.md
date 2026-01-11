# @usefy/screen-recorder

## 0.1.3

### Patch Changes

- e2a04ba: ### @usefy/screen-recorder

  - Fix unlimited duration recording with `maxDuration={Infinity}`
  - Fix timer display showing "Infinity:NaN" for unlimited recordings
  - Fix Re-record button to immediately start new recording
  - Fix dark mode in preview modal (explicit theme prop support)
  - Add `theme` prop for explicit light/dark mode control

  ### @usefy/kits

  - Re-export ScreenRecorder with unlimited duration fix
