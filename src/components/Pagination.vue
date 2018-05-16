<template>
  <div class="page-buttons">
    <button
      v-if="currentPage > 0"
      class="label-button"
      style="background: #9659A7"
      @click="setPage(currentPage - 1)">Previous Page</button>
    <span></span>
    <button
      v-if="currentPage < totalPages"
      class="label-button"
      style="background: #9659A7;"
      @click="setPage(currentPage + 1)">Next Page</button>
  </div>
</template>
<script>
export default {
  props: ['currentPage', 'totalPages', 'setPage']
};
</script>

<style>
.page-buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
