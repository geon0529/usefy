### useTimer

**Purpose**: 카운트다운 타이머를 관리하고 다양한 시간 단위로 제어

**Key Features**:

- 다양한 시간 단위 지원 (ms, seconds, minutes, hours)
- Play, pause, stop, reset 제어
- 타이머 완료 콜백
- 자동 시작 옵션
- 남은 시간을 다양한 포맷으로 반환
- 진행률 계산 (percentage)
- 시간 추가/감소 기능

**API**:
```typescript
const {
  time,           // 남은 시간 (ms)
  formattedTime,  // 포맷된 시간 문자열 (HH:MM:SS)
  progress,       // 진행률 (0-100)
  isRunning,      // 실행 중 여부
  isFinished,     // 완료 여부
  start,          // 타이머 시작
  pause,          // 타이머 일시정지
  stop,           // 타이머 정지 및 리셋
  reset,          // 초기 시간으로 리셋
  addTime,        // 시간 추가
  subtractTime,   // 시간 감소
} = useTimer(initialTime, options);
```

**Usage Example**:
```typescript
// 기본 사용 (초 단위)
const timer = useTimer(60, {
  interval: 1000,
  onComplete: () => alert('Time is up!'),
  autoStart: true,
});

// 분 단위로 10분 타이머
const timer = useTimer(10, {
  unit: 'minutes',
  interval: 1000,
  onComplete: () => console.log('Done!'),
  onTick: (remainingTime) => console.log(remainingTime),
});

// 밀리초 단위로 정밀한 타이머
const preciseTimer = useTimer(5000, {
  unit: 'ms',
  interval: 10, // 10ms마다 업데이트
  format: 'mm:ss:SSS',
});

return (
  <div>
    <p>Time: {timer.formattedTime}</p>
    <p>Progress: {timer.progress}%</p>
    <button onClick={timer.isRunning ? timer.pause : timer.start}>
      {timer.isRunning ? 'Pause' : 'Start'}
    </button>
    <button onClick={timer.stop}>Stop</button>
    <button onClick={timer.reset}>Reset</button>
    <button onClick={() => timer.addTime(10, 'seconds')}>+10s</button>
  </div>
);
```

**Implementation Points**:

- `useRef`로 interval ID 관리 및 메모리 누수 방지
- `useEffect`로 cleanup 처리 (컴포넌트 언마운트 시)
- 시간 단위 변환 유틸리티 함수 (ms, seconds, minutes, hours)
- 정확한 시간 측정을 위해 `Date.now()` 또는 `performance.now()` 사용
- requestAnimationFrame 옵션 제공 (더 부드러운 애니메이션용)
- 포맷 옵션: 'HH:MM:SS', 'MM:SS', 'SS', 'mm:ss:SSS' 등
- 타이머가 0 이하로 가지 않도록 보호
- TypeScript 타입 안정성 (unit, format enum 등)
- 브라우저 탭 비활성화 시에도 정확한 시간 유지
- Options 객체 메모이제이션으로 불필요한 재렌더링 방지

**Options Interface**:
```typescript
interface UseTimerOptions {
  unit?: 'ms' | 'seconds' | 'minutes' | 'hours';
  interval?: number; // 업데이트 간격 (ms)
  format?: 'HH:MM:SS' | 'MM:SS' | 'SS' | 'mm:ss:SSS' | 'custom';
  autoStart?: boolean;
  onComplete?: () => void;
  onTick?: (remainingTime: number) => void;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  useRAF?: boolean; // requestAnimationFrame 사용 여부
}
```

**Advanced Features**:

- 타이머 상태 저장/복원 (localStorage 연동)
- 여러 타이머 동시 관리
- 타이머 체인 (순차 실행)
- 반복 타이머 (loop 옵션)
- 백그라운드에서도 정확한 시간 유지 (visibility API 활용)