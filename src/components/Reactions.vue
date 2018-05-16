<template>
  <div class="buttons reactions">
    <div :key="reaction" v-if="issueReactions[reaction] > 0" v-for="reaction in reactions">
      <span class="badge">{{issueReactions[reaction]}}</span>
      <img class="reaction-image" :src="reactionImages[reaction]" alt="">
    </div>
  </div>
</template>
<script>
export default {
  props: ['issueReactions', 'reactions', 'reactionImages']
};
</script>
<style>
.reactions {
  padding-top: 0.5em !important;
  margin-left: 1em;
  justify-content: flex-start !important;
}

.badge {
  background: #f35956;
  color: white;
  border-radius: 50%;
  width: 27px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: -8px;
}

.reaction-image {
  height: 50px;
}
</style>
