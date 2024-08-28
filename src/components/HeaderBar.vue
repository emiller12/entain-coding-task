<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  selectedCategory: string
}>()

const emit = defineEmits(['update:selectedCategory'])

const handleCategoryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:selectedCategory', target.value)
}
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="75" height="75" />
    <h1>Next to go</h1>
    <select class="category-select" :value="selectedCategory" @change="handleCategoryChange">
      <option value="all">ALL</option>
      <option value="9daef0d7-bf3c-4f50-921d-8e818c60fe61">Greyhound racing</option>
      <option value="161d9be2-e909-4326-8c2c-35ed71fb460b">Harness racing</option>
      <option value="4a2788f8-e825-4d36-9894-efd4baf1cfae">Horse racing</option>
    </select>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  padding: 1em;
  text-transform: uppercase;
}

.logo {
  display: block;
  padding-right: 1em;
}

.category-select {
  margin-left: auto;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  position: relative;
}

.category-select:hover {
  border-color: #888;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.category-select:focus {
  border-color: #555;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
