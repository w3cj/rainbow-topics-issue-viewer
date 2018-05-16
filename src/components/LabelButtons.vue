<template>
  <div class="buttons">
    <button
      class="label-button"
      :style="{
        background: label.selected ? '#' + label.color : 'grey'
      }"
      @click="setLabelSelected({ id: label.id, selected: !label.selected})"
      v-for="label in labels"
      :key="label.id">{{label.name}}</button>
  </div>
</template>
<script>
export default {
  props: ['labels', 'setLabelSelected']
};
</script>
