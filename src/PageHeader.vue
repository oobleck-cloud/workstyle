<script setup lang="ts">
// 디자인 시스템 부품 PageHeader: 모든 객체 페이지(프로젝트 · 문서 · 데이터베이스 · 디자인 · 아티팩트 · 세션 · 에이전트 · 티켓)가 같이 쓰는 머리(총본 3판).
// 위: 경로(crumbs) · 오른쪽 단추(#actions). 가운데: PageIcon · 제목(#title-after 는 제목 옆). 아래: 속성 줄 · 뱃지(#props). 스타일 ds.css
// #subtitle 은 제목 아래 한 줄(설명 · 지금 요약 · 경로): 아이콘 옆, 제목과 한 덩어리로 둔다
// #icon 으로 PageIcon 대신 다른 그림(에이전트 아바타 등)을 둘 수 있다
// 설정의 머리 밀도가 compact 거나, auto 에서 열린 칸 하나가 낮아지면 한 줄로 그린다(density.ts): 경로는 첫 마디만, #subtitle · #props 는 정보 단추로 펴고, 단추는 아이콘만
// variant: object(기본 · 위 설명) · tool(설정 · AI 계정처럼 도구 화면: 제목 줄 + #tabs 구역 탭) · collection(티켓 · 루틴처럼 목록: 제목 줄 + #filters 거르기 줄).
// tool · collection 은 경로 · 속성 줄이 없고 아이콘 28 · 제목 16, 촘촘이면 탭 · 거르기를 제목 옆 한 줄로(시안 「설정 · AI 계정 화면 개선과 머리 변형 시안」)
// editable 이면 제목을 눌러 그 자리에서 고친다(Enter · 밖을 누르면 rename, Esc 는 그만)
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import Icon from './Icon.vue';
import PageIcon from './PageIcon.vue';
import { headCompact as compact, watchPanel } from './density';
import type { IconName } from './icons';

const props = defineProps<{ crumbs?: string[]; icon: IconName; title: string; size?: 'lg' | 'md'; editable?: boolean; variant?: 'object' | 'tool' | 'collection' }>();
const emit = defineEmits<{ rename: [name: string] }>();
const root = ref<HTMLElement | null>(null);
let unwatch = () => {};
onMounted(() => root.value && (unwatch = watchPanel(root.value)));
onBeforeUnmount(() => unwatch());
const more = ref(false); // compact 에서 설명 · 속성을 편 때
const editing = ref(false);
const input = ref<HTMLInputElement | null>(null);
async function edit() {
  if (!props.editable) return;
  editing.value = true;
  await nextTick();
  input.value?.focus();
  input.value?.select();
}
function done(v: string | null) {
  if (!editing.value) return;
  editing.value = false;
  const name = v?.trim();
  if (name && name !== props.title) emit('rename', name);
}
</script>

<template>
  <header ref="root" class="page-head" :class="[variant && variant !== 'object' ? `ph-${variant}` : size === 'md' ? 'ph-md' : 'ph-lg', { compact }]">
    <!-- tool · collection: 제목 줄 하나 + 구역 탭 / 거르기 줄. 촘촘이면 그 줄을 제목 옆으로 -->
    <template v-if="variant === 'tool' || variant === 'collection'">
      <div class="page-head-bar">
        <slot name="icon"><PageIcon :icon="icon" size="sm" /></slot>
        <h1 class="ellip" :class="compact ? 't-title' : 't-h4'">{{ title }}</h1>
        <slot name="title-after" />
        <span v-if="!compact && $slots.subtitle" class="page-head-sub t-small ink3"><slot name="subtitle" /></span>
        <template v-if="compact && ($slots.tabs || $slots.filters)"><span class="page-head-sep"></span><span class="page-head-inline"><slot name="tabs" /><slot name="filters" /></span></template>
        <span class="grow"></span>
        <span class="page-head-actions"><slot name="actions" /></span>
      </div>
      <div v-if="!compact && $slots.tabs" class="page-head-tabs"><slot name="tabs" /></div>
      <div v-if="!compact && $slots.filters" class="page-head-filters"><slot name="filters" /></div>
    </template>
    <template v-else-if="compact">
      <div class="page-head-bar">
        <slot name="icon"><PageIcon :icon="icon" size="sm" /></slot>
        <span v-if="crumbs && crumbs.length > 1" class="page-head-root t-small ink3">{{ crumbs[0] }} ›</span>
        <input v-if="editing" ref="input" class="page-head-input t-title" :value="title" aria-label="이름" @keydown.enter.prevent="done(($event.target as HTMLInputElement).value)" @keydown.esc.prevent="done(null)" @blur="done(($event.target as HTMLInputElement).value)" />
        <h1 v-else class="ellip t-title" :class="{ editable }" :title="editable ? '눌러 이름 바꾸기' : title" @click="edit">{{ title }}</h1>
        <slot name="title-after" />
        <span class="grow"></span>
        <button v-if="$slots.subtitle || $slots.props" class="btn icon sm" :class="{ on: more }" :aria-expanded="more" aria-label="설명 · 속성" title="설명 · 속성" @click="more = !more"><Icon name="info" /></button>
        <span class="page-head-actions"><slot name="actions" /></span>
      </div>
      <div v-if="more" class="page-head-more">
        <div v-if="$slots.subtitle" class="page-head-sub t-small ink3"><slot name="subtitle" /></div>
        <div v-if="$slots.props" class="page-head-props"><slot name="props" /></div>
      </div>
    </template>
    <template v-else>
      <div v-if="crumbs?.length" class="page-head-top">
        <nav class="breadcrumb" aria-label="경로"><span v-for="(c, i) in crumbs" :key="i" :aria-current="i === crumbs.length - 1 ? 'page' : undefined">{{ c }}</span></nav>
        <span class="grow"></span>
        <slot name="actions" />
      </div>
      <div class="page-head-title" :class="{ 'has-sub': !!$slots.subtitle }">
        <slot name="icon"><PageIcon :icon="icon" :size="size === 'md' ? 'md' : 'lg'" /></slot>
        <div class="page-head-name">
          <div class="page-head-name-row">
            <input v-if="editing" ref="input" class="page-head-input" :class="size === 'md' ? 't-display' : 't-heading'" :value="title" aria-label="이름" @keydown.enter.prevent="done(($event.target as HTMLInputElement).value)" @keydown.esc.prevent="done(null)" @blur="done(($event.target as HTMLInputElement).value)" />
            <h1 v-else class="ellip" :class="[size === 'md' ? 't-display' : 't-heading', { editable }]" :title="editable ? '눌러 이름 바꾸기' : undefined" @click="edit">{{ title }}</h1>
            <slot name="title-after" />
          </div>
          <div v-if="$slots.subtitle" class="page-head-sub t-small ink3"><slot name="subtitle" /></div>
        </div>
        <!-- 경로가 없으면 단추는 제목 줄 오른쪽에(빈 윗줄을 두지 않는다) -->
        <template v-if="!crumbs?.length && $slots.actions"><span class="grow"></span><span class="page-head-actions"><slot name="actions" /></span></template>
      </div>
      <div v-if="$slots.props" class="page-head-props"><slot name="props" /></div>
    </template>
  </header>
</template>
