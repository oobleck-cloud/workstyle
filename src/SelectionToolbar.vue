<script setup lang="ts">
// Workstyle SelectionToolbar. kind=text 는 글 꾸미기, kind=records 는 고른 기록 도구.
import Icon from './Icon.vue';
import Button from './Button.vue';
import IconButton from './IconButton.vue';

export type Mark = 'bold' | 'italic' | 'underline' | 'strike' | 'code';
withDefaults(
  defineProps<{ kind?: 'text' | 'records'; active?: Mark[]; block?: string; count?: string }>(),
  { kind: 'text', block: '글', count: '3개 고름' },
);
const emit = defineEmits<{
  block: [];
  mark: [m: Mark];
  link: [];
  comment: [];
  agent: [];
  edit: [];
  export: [];
  archive: [];
  primary: [];
  clear: [];
}>();
const MARKS: { id: Mark; label: string; title: string }[] = [
  { id: 'bold', label: 'B', title: '굵게(⌘B)' },
  { id: 'italic', label: 'I', title: '기울임(⌘I)' },
  { id: 'underline', label: 'U', title: '밑줄(⌘U)' },
  { id: 'strike', label: 'S', title: '취소선' },
  { id: 'code', label: '코드', title: '코드(⌘E)' },
];
</script>

<template>
  <div v-if="kind === 'records'" class="sel-toolbar" role="toolbar" aria-label="고른 기록">
    <span class="count">{{ count }}</span>
    <span class="vsep"></span>
    <Button size="sm" @click="emit('edit')"><Icon name="pen" :size="16" />속성 바꾸기</Button>
    <Button size="sm" @click="emit('export')"><Icon name="external" :size="16" />내보내기</Button>
    <Button size="sm" @click="emit('archive')"><Icon name="archive" :size="16" />보관</Button>
    <span class="vsep"></span>
    <Button kind="primary" size="sm" @click="emit('primary')"><Icon name="send" :size="16" />적용</Button>
    <IconButton size="sm" label="선택 해제" @click="emit('clear')"><Icon name="close" :size="16" /></IconButton>
  </div>
  <div v-else class="sel-toolbar" role="toolbar" aria-label="글 꾸미기" @mousedown.prevent>
    <Button size="sm" @click="emit('block')"><Icon name="file" :size="16" />{{ block }}</Button>
    <span class="marks"><button v-for="m in MARKS" :key="m.id" type="button" :title="m.title" :aria-pressed="active?.includes(m.id) ? 'true' : 'false'" @click="emit('mark', m.id)">{{ m.label }}</button></span>
    <IconButton size="sm" label="링크" title="링크(⌘K)" @click="emit('link')"><Icon name="link" :size="16" /></IconButton>
    <Button size="sm" @click="emit('comment')"><Icon name="assistant" :size="16" />코멘트</Button>
    <Button size="sm" title="에이전트에게 물어보기" @click="emit('agent')"><Icon name="person" :size="16" />물어보기</Button>
  </div>
</template>
