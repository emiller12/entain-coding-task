<script setup lang="ts">
import { ref } from 'vue'
import NextRaces from '@/components/NextRaces.vue'
import HeaderBar from '@/components/HeaderBar.vue'

const selectedCategory = ref('all')
</script>

<template>
  <HeaderBar
    :selectedCategory="selectedCategory"
    @update:selectedCategory="selectedCategory = $event"
  />
  <NextRaces :selectedCategory="selectedCategory" />
</template>
