<script setup lang="ts">
import { defineProps } from 'vue'
import type { RaceSummary } from '@/api/types'
import RaceCountdown from '@/components/RaceCountdown.vue'

const props = defineProps<{
  race: RaceSummary
}>()
</script>

<template>
  <div class="race-detail">
    <h2 class="race-meeting">{{ race.meeting_name }}</h2>
    <div class="race-number">{{ race.race_number }}</div>
    <RaceCountdown :start-time="race.advertised_start.seconds" />
  </div>
</template>

<style scoped>
.race-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  border-bottom: 1px solid #e0e0e0;
}

.race-meeting {
  flex-basis: 25%;
}

.race-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  font-size: 2em;
  font-weight: bold;
  color: white;
  background-color: #222222;
  margin-left: 1em;
  margin-right: 1em;
}
</style>
