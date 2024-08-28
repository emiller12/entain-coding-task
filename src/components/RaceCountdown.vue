<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  startTime: number
}>()

const remainingTime = ref('')
let interval: number

const updateCountdown = () => {
  const now = Date.now()
  const distance = props.startTime * 1000 - now

  // If the countdown is over, display 'NOW' and clear the interval
  if (distance <= 0) {
    remainingTime.value = 'NOW'
    clearInterval(interval)
    return
  }

  // Calculate number of full days
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))

  // Calculate remaining hours after extracting full days
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  // Calculate remaining minutes after extracting full hours
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

  // Calculate remaining seconds after extracting full minutes
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  // Format the result string for display
  let formattedResult = ''
  if (days > 0) {
    formattedResult += `${days}d `
  }
  if (hours > 0) {
    formattedResult += `${hours}h `
  }
  if (minutes > 0) {
    formattedResult += `${minutes}m `
  }
  if (seconds > 0) {
    formattedResult += `${seconds}s `
  }

  remainingTime.value = formattedResult
}

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div>{{ remainingTime }}</div>
</template>

<style scoped>
div {
  font-size: 1.5em;
  font-weight: bold;
  flex-basis: 25%;
  text-align: end;
  padding-right: 1em;
}
</style>
