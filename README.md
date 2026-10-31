# workstyle

oobleck 공용 디자인 시스템 Workstyle. 뼈대만 있다.

`@oobleck/workstyle` 은 다크 토큰(`./tokens.css`)과 Vue 킷을 담는다. 워크벤치, Seed 스튜디오, 소싱 OS 가 이 패키지를 참조한다. 컬렉션 뷰는 React 라서 이 Vue 킷을 직접 붙이지 않고, 같은 토큰으로 `@oobleck/collection-views` 슬롯을 채운다.

정본은 아직 워크벤치 `ui/src/styles/tokens.css`(판 eb12e334)와 `ui/src/components/kit` 이다.

```json
{
  "@oobleck/workstyle": "github:oobleck-cloud/workstyle"
}
```
