<template>
  <div class="allReactions-container">
    <div class="allReactions">
      <h3 v-if="reactionsError" class="status">{{reactionsError}}</h3>
      <hr>
      <div class="reactions-by-type" v-for="(reactions, reaction) in reactionsByType" :key="reaction">
        <img class="reaction-image reaction-image-header" :src="reactionImages[reaction]" alt="">
        <avatar class="reaction-user" v-for="reaction in reactions" :key="reaction.user.login" :user="reaction.user"></avatar>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar';

export default {
  props: ['reactionsError', 'reactionsByType', 'reactionImages'],
  components: {
    Avatar
  }
};
</script>

<style>
.allReactions-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.allReactions {
  width: 90%;
}

.reaction-image-header {
  display: block;
}

.reactions-by-type {
  margin-left: 1em;
  margin-right: 1em;
}

.reaction-user {
  display: inline-block;
  margin: 1em;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #f1c500;
  margin: 1em 0;
  padding: 0;
}
</style>
