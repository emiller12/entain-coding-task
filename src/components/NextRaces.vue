<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, watch } from 'vue'
import { getNextRaces } from '@/api/races'
import RaceDetail from '@/components/RaceDetail.vue'

const props = defineProps<{
  selectedCategory: string
}>()

const races = ref<RaceSummary[]>(null)
const error = ref(null)
let interval: number

const updateRaceList = async () => {
  try {
    if (interval) {
      clearInterval(interval)
    }
    races.value = await getNextRaces(props.selectedCategory)

    // Calculate the time for the next update based on the start time of the next race
    const nextUpdateTime = (races.value[0].advertised_start.seconds + 60) * 1000
    interval = setInterval(updateRaceList, nextUpdateTime - Date.now())
  } catch (err) {
    error.value = err
  }
}

onMounted(() => {
  updateRaceList()
})

onUnmounted(() => {
  clearInterval(interval)
})

watch(
  () => props.selectedCategory,
  (newValue, oldValue) => {
    updateRaceList()
  }
)
</script>

<template>
  <div>
    <div v-if="error">
      <p>Error: {{ error.message }}</p>
    </div>
    <div v-else-if="races">
      <RaceDetail v-for="race in races" :key="race.race_id" :race="race" />
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>
