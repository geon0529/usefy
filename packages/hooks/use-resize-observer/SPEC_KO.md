### useResizeObserver

**목적**: ResizeObserver API를 활용하여 엘리먼트의 크기 변화를 실시간으로 감지하고 추적합니다. 디바운싱, SSR 호환성, 성능 최적화 등 엔터프라이즈급 기능을 제공합니다.

**핵심 기능**:

- 실시간 엘리먼트 크기 추적 (width, height, contentRect)
- Border-box 및 Content-box 사이징 지원
- 고해상도 디스플레이를 위한 Device pixel content box 지원
- 성능 최적화를 위한 디바운스/스로틀 옵션
- 일관된 정수 크기를 위한 반올림 옵션
- 콜백 기반 및 상태 기반 관찰 모드
- 여러 엘리먼트 동시 관찰 지원
- SSR 안전 및 우아한 폴백 처리
- TypeScript 엄격한 타입 안전성
- 언마운트 시 메모리 효율적인 정리
- 유연한 엘리먼트 바인딩을 위한 Ref 콜백 패턴

**API**:

```typescript
const {
  // 크기 상태
  ref,              // 대상 엘리먼트에 연결할 Ref 콜백
  width,            // 현재 엘리먼트 너비 (px)
  height,           // 현재 엘리먼트 높이 (px)
  entry,            // 전체 ResizeObserverEntry 객체

  // Content Rect 상세
  contentRect,      // DOMRectReadOnly (x, y, width, height, top, right, bottom, left)

  // Border Box 크기 (가능한 경우)
  borderBoxSize,    // { inlineSize, blockSize } - 패딩과 보더 포함

  // Content Box 크기
  contentBoxSize,   // { inlineSize, blockSize } - 콘텐츠 영역만

  // Device Pixel Content Box (고해상도)
  devicePixelContentBoxSize, // { inlineSize, blockSize } - 디바이스 픽셀 단위

  // 상태
  isSupported,      // ResizeObserver API 사용 가능 여부
  isObserving,      // 현재 엘리먼트 관찰 중 여부

  // 액션
  observe,          // 특정 엘리먼트 수동 관찰 시작
  unobserve,        // 특정 엘리먼트 관찰 중지
  disconnect,       // 모든 관찰 연결 해제
} = useResizeObserver(options);
```

**사용 예시**:

```typescript
// 기본 사용법 - 엘리먼트 크기 추적
function ResponsiveComponent() {
  const { ref, width, height } = useResizeObserver();

  return (
    <div ref={ref}>
      크기: {width}px x {height}px
    </div>
  );
}

// 성능을 위한 디바운스 적용
function DebouncedResize() {
  const { ref, width, height } = useResizeObserver({
    debounce: 100, // 최대 100ms마다 업데이트
    onResize: ({ width, height }) => {
      console.log('크기 변경:', width, height);
    },
  });

  return <div ref={ref}>디바운스된 크기 추적</div>;
}

// 정확한 레이아웃 측정을 위한 Border-box 사이징
function AccurateLayout() {
  const { ref, borderBoxSize } = useResizeObserver({
    box: 'border-box',
  });

  return (
    <div ref={ref} style={{ padding: 20, border: '1px solid black' }}>
      Border box: {borderBoxSize?.inlineSize}px x {borderBoxSize?.blockSize}px
    </div>
  );
}

// Canvas/WebGL을 위한 고해상도 인식 크기
function CanvasComponent() {
  const { ref, devicePixelContentBoxSize } = useResizeObserver({
    box: 'device-pixel-content-box',
  });

  return (
    <canvas
      ref={ref}
      width={devicePixelContentBoxSize?.inlineSize ?? 300}
      height={devicePixelContentBoxSize?.blockSize ?? 150}
    />
  );
}

// 콜백 전용 모드 (상태 업데이트 없음)
function CallbackOnlyMode() {
  const handleResize = useCallback((entry: ResizeObserverEntry) => {
    // 애니메이션을 위한 직접 DOM 조작
    entry.target.style.setProperty(
      '--aspect-ratio',
      String(entry.contentRect.width / entry.contentRect.height)
    );
  }, []);

  const { ref } = useResizeObserver({
    onResize: handleResize,
    updateState: false, // 최대 성능을 위해 상태 업데이트 비활성화
  });

  return <div ref={ref}>애니메이션 컨테이너</div>;
}

// 일관된 정수 크기를 위한 반올림
function IntegerDimensions() {
  const { ref, width, height } = useResizeObserver({
    round: Math.round, // Math.floor, Math.ceil 또는 커스텀 함수도 가능
  });

  return <div ref={ref}>{width} x {height}</div>;
}

// 여러 엘리먼트 관찰
function MultipleElements() {
  const [sizes, setSizes] = useState<Map<Element, DOMRectReadOnly>>(new Map());
  const { observe, unobserve } = useResizeObserver({
    onResize: (entry) => {
      setSizes(prev => new Map(prev).set(entry.target, entry.contentRect));
    },
  });

  return (
    <div>
      <div ref={(el) => el && observe(el)}>엘리먼트 1</div>
      <div ref={(el) => el && observe(el)}>엘리먼트 2</div>
      <div ref={(el) => el && observe(el)}>엘리먼트 3</div>
    </div>
  );
}

// 반응형 그리드 열 계산
function ResponsiveGrid() {
  const { ref, width } = useResizeObserver();
  const columns = width ? Math.max(1, Math.floor(width / 200)) : 1;

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {items.map(item => <GridItem key={item.id} {...item} />)}
    </div>
  );
}

// 크기 조절 처리가 있는 차트 컨테이너
function ResponsiveChart() {
  const { ref, width, height } = useResizeObserver({
    debounce: 200,
    onResize: ({ width, height }) => {
      // 새 크기로 차트 다시 렌더링
      chartInstance.current?.resize(width, height);
    },
  });

  return (
    <div ref={ref} style={{ width: '100%', height: '400px' }}>
      <Chart width={width ?? 0} height={height ?? 0} data={data} />
    </div>
  );
}

// 미지원 환경 처리
function SafeResizeComponent() {
  const { ref, width, height, isSupported } = useResizeObserver();

  if (!isSupported) {
    return <div>이 브라우저에서는 ResizeObserver를 지원하지 않습니다</div>;
  }

  return <div ref={ref}>{width} x {height}</div>;
}
```

**구현 포인트**:

- disconnect()를 통한 적절한 정리와 함께 ResizeObserver API 사용
- 유연한 엘리먼트 바인딩을 위한 ref 콜백 패턴 구현
- 모든 박스 모델 지원: content-box, border-box, device-pixel-content-box
- typeof window 체크와 우아한 폴백으로 SSR 안전
- setTimeout 또는 requestAnimationFrame을 통한 선택적 디바운스/스로틀
- 옵저버 재생성 방지를 위한 콜백과 옵션 메모이제이션
- 단일 콜백에서 여러 항목 처리 (배치 업데이트)
- 메모리 누수 방지를 위해 옵저버 인스턴스에 useRef 사용
- 상태 기반과 콜백 전용 모드 모두 제공
- 정수 크기를 위한 반올림 함수 옵션
- 완전한 타입 추론과 TypeScript 엄격 모드
- 엣지 케이스 처리: 엘리먼트 제거, 빠른 ref 변경
- React Strict Mode 더블 마운트 시나리오 고려
- 폴리필 감지 및 우아한 폴백
- 크로스 브라우저 호환성 (모던 브라우저 + Edge)

**옵션 인터페이스**:

```typescript
interface UseResizeObserverOptions<T extends Element = Element> {
  // 박스 모델
  box?: ResizeObserverBoxOptions; // 'content-box' | 'border-box' | 'device-pixel-content-box'

  // 성능
  debounce?: number;              // 디바운스 지연 시간 (ms)
  throttle?: number;              // 스로틀 간격 (ms) (디바운스 대안)

  // 값 처리
  round?: (value: number) => number; // 크기 값 반올림 함수

  // 콜백
  onResize?: (entry: ResizeObserverEntry) => void;
  onError?: (error: Error) => void;

  // 동작
  updateState?: boolean;          // React 상태 업데이트 여부 (기본값: true)
  enabled?: boolean;              // 관찰 활성화/비활성화 (기본값: true)

  // 초기값
  initialWidth?: number;
  initialHeight?: number;
}
```

**반환 타입**:

```typescript
interface UseResizeObserverReturn<T extends Element = Element> {
  // Ref
  ref: (element: T | null) => void;

  // 크기 (첫 관찰 전까지 undefined일 수 있음)
  width: number | undefined;
  height: number | undefined;

  // 전체 Entry
  entry: ResizeObserverEntry | undefined;

  // 상세 크기
  contentRect: DOMRectReadOnly | undefined;
  borderBoxSize: ResizeObserverSize | undefined;
  contentBoxSize: ResizeObserverSize | undefined;
  devicePixelContentBoxSize: ResizeObserverSize | undefined;

  // 상태
  isSupported: boolean;
  isObserving: boolean;

  // 액션
  observe: (element: T) => void;
  unobserve: (element: T) => void;
  disconnect: () => void;
}

interface ResizeObserverSize {
  inlineSize: number;
  blockSize: number;
}
```

**브라우저 호환성**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 기능                              │ Chrome │ Firefox │ Safari │ Edge │ IE  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ResizeObserver                    │ ✅ 64+  │ ✅ 69+   │ ✅ 13.1+│ ✅ 79+│ ❌  │
│ content-box                       │ ✅ 64+  │ ✅ 69+   │ ✅ 13.1+│ ✅ 79+│ ❌  │
│ border-box                        │ ✅ 84+  │ ✅ 92+   │ ✅ 15.4+│ ✅ 84+│ ❌  │
│ device-pixel-content-box          │ ✅ 84+  │ ✅ 93+   │ ❌       │ ✅ 84+│ ❌  │
│ borderBoxSize/contentBoxSize      │ ✅ 84+  │ ✅ 92+   │ ✅ 15.4+│ ✅ 84+│ ❌  │
└─────────────────────────────────────────────────────────────────────────────┘
✅ 지원  ❌ 미지원

참고:
- Safari는 device-pixel-content-box를 지원하지 않음
- 구형 브라우저는 resize-observer-polyfill이 필요할 수 있음
- borderBoxSize/contentBoxSize는 스펙상 배열을 반환 (단일 엘리먼트는 [0] 사용)
```

**서버 사이드 렌더링 (SSR) 호환성**:

```typescript
// SSR 감지 및 처리
function useResizeObserver<T extends Element = Element>(
  options?: UseResizeObserverOptions<T>
): UseResizeObserverReturn<T> {
  // 1. 브라우저 환경 확인
  const isSupported = typeof window !== 'undefined' &&
                      typeof ResizeObserver !== 'undefined';

  // 2. SSR을 위한 안전한 기본값 반환
  if (!isSupported) {
    return {
      ref: () => {},
      width: options?.initialWidth,
      height: options?.initialHeight,
      entry: undefined,
      contentRect: undefined,
      borderBoxSize: undefined,
      contentBoxSize: undefined,
      devicePixelContentBoxSize: undefined,
      isSupported: false,
      isObserving: false,
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
    };
  }

  // 3. 클라이언트 사이드 구현...
}

// 프레임워크 고려사항:
// - Next.js: App Router와 Pages Router 모두 호환
// - Remix: 서버 사이드 로더에서 안전
// - Gatsby: 빌드 중 window 접근 없음
```

**고급 기능**:

- 단일 훅 인스턴스로 여러 엘리먼트 관찰
- 크기 값을 위한 커스텀 반올림 함수
- 콜백 전용 성능 모드 (상태 업데이트 없음)
- 고빈도 크기 변경 이벤트를 위한 디바운스/스로틀 통합
- Canvas/WebGL 애플리케이션을 위한 디바이스 픽셀 비율 인식
- 우아한 실패 처리를 위한 에러 바운더리 통합
- 크기 변경 이벤트 콘솔 로깅 디버그 모드
- 반응형 디자인을 위한 CSS 커스텀 프로퍼티 통합
- CSS 컨테이너 쿼리 폴리필 통합 지원
- 여러 엘리먼트를 위한 메모리 효율적인 관찰 맵

**테스트 고려사항**:

- 유닛 테스트를 위한 ResizeObserver 모킹
- 모든 박스 모델 옵션 테스트 (content-box, border-box, device-pixel-content-box)
- 디바운스/스로틀 타이밍 동작 검증
- SSR 환경 테스트 (window undefined)
- 빠른 엘리먼트 마운트/언마운트 테스트
- 여러 엘리먼트 관찰 테스트
- 컴포넌트 언마운트 시 정리 테스트
- ref 콜백 안정성 테스트 (무한 루프 없음)
- React Strict Mode 테스트 (더블 마운트)
- 크기 배열 형식 차이에 대한 크로스 브라우저 테스트
- 다양한 반올림 전략으로 반올림 함수 테스트
- 고빈도 크기 변경 이벤트 성능 테스트

**마일스톤**:

1. **핵심 구현**
   - 기본 ResizeObserver 통합
   - Ref 콜백 패턴
   - Width/height 상태 관리
   - SSR 호환성
   - 언마운트 시 정리

2. **박스 모델 지원**
   - content-box (기본값)
   - border-box
   - device-pixel-content-box
   - 크로스 브라우저 크기 배열 처리

3. **성능 최적화**
   - 디바운스 옵션
   - 스로틀 옵션
   - 콜백 전용 모드 (updateState: false)
   - 옵저버와 콜백 메모이제이션

4. **고급 기능**
   - 여러 엘리먼트 관찰
   - 반올림 함수 옵션
   - 에러 처리 및 콜백
   - 활성화/비활성화 토글

5. **테스트 및 문서화**
   - 포괄적인 유닛 테스트 (90%+ 커버리지)
   - 모든 사용 사례를 포함한 스토리북 스토리
   - 스토리북 인터랙션 테스트
   - TypeScript 타입 안전성 검증
