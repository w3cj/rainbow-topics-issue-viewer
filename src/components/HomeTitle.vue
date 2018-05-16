<template>
  <h1>
    <span
      :style="{ color: getColor(index) }"
      v-for="(char, index) in title_1"
      :key="index+char">{{char}}</span> 
    <span
      :style="{ color: getColor(index) }"
      v-for="(char, index) in title_2"
      :key="index+char">{{char}}</span>
  </h1>
</template>

<script>
import { getColor } from '@/colors';

export default {
  name: 'home-title',
  data: () => ({
    title_1: 'Rainbow',
    title_2: 'Topics'
  }),
  methods: {
    getColor
  }
};
</script>
