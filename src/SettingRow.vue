<script setup lang="ts">
// 디자인 시스템 부품 SettingRow: 설정 한 줄(Workstyle · SettingRow). 왼쪽 이름 + 고른 것의 설명, 오른쪽 조작(기본 칸: Segment · Select · Switch · 단추)
// 여럿을 .setting-group 카드로 묶는다. 스타일 ds.css
defineProps<{ title: string; desc?: string }>();
</script>

<template>
  <div class="setting-row">
    <div class="setting-row-text">
      <span class="t-title">{{ title }}</span>
      <span v-if="desc || $slots.desc" class="t-small ink3"><slot name="desc">{{ desc }}</slot></span>
    </div>
    <div class="setting-row-ctl"><slot /></div>
  </div>
</template>
