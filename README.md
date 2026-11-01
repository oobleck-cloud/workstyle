# workstyle

`@oobleck/workstyle`. 다크 토큰, 화면 스타일(`ds.css`), Vue 킷, React 킷.

워크벤치가 Vue 킷을 쓴다. Seed 스튜디오와 소싱 OS 는 색 토큰(`colors.css`)만 쓴다. 컬렉션 뷰(`@oobleck/collection-views`)는 React 킷을 부품 자리에 끼운다(`kit/workstyle`).

```json
{ "@oobleck/workstyle": "github:oobleck-cloud/workstyle" }
```

## React 킷

```tsx
import '@oobleck/workstyle/react.css'
import { Button, Select } from '@oobleck/workstyle/react'

<div className="ws-scope">
  <Button kind="primary">적용</Button>
</div>
```

- 이름·변형은 Vue 킷과 같다(Button kind ghost|secondary|primary|danger, size sm|md|lg …).
- 스타일 `src/react/ws.css` 는 `ds.css` 에서 만든다(`npm run css`). 모든 클래스에 `ws-` 를 붙이고, 요소 규칙(button·svg·*)은 `.ws-scope` 안에만, 부품 규칙은 `@layer components` 에 넣어 Tailwind 앱(MVOS)의 `.row`·`.grow` 와 겹치지 않고 유틸리티 className 이 이긴다. `ds.css` 를 고치면 다시 만든다(`npm run check` 가 어긋남을 잡는다).
- 떠 있는 층(Select·Tooltip 의 `Float`)은 body 로 나가며 스스로 `ws-scope` 다.
