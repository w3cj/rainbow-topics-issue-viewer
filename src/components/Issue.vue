<template>
  <div class="video-card">
    <div class="video-header">
      <h3>{{issue.title}}</h3>
      <span class="video-date">{{issue.formattedDate}}</span>
      <div class="issue-labels" v-if="issue.labels.length > 0">
        <button
          class="label-button"
          :style="{
            background: '#' + label.color
          }"
          v-for="label in issue.labels"
          :key="label.id">{{label.name}}</button>
      </div>
      <div class="user">
        <a class="avatar-name" :href="issue.user.html_url">
          <img class="avatar" :src="issue.user.avatar_url">
          <span>{{issue.user.login}}</span>
        </a>
      </div>
    </div>
    <div class="video-description">
      <p class="issue-summary" v-html="issue.summary"></p>
    </div>
    <reactions
      :issueReactions="issue.reactions"
      :reactions="reactions"
      :reactionImages="reactionImages"></reactions>
    <div class="buttons">
      <a style="background: #49BB6C" :href="issue.html_url" target="blank">View on Github</a>
    </div>
  </div>
</template>
<script>
import Reactions from '@/components/Reactions';

export default {
  props: ['issue', 'reactions', 'reactionImages'],
  components: {
    Reactions
  }
};
</script>
<style>
@media (min-width: 576px) {
  .video-card {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .video-card {
    width: 50%;
  }
}

@media (min-width: 992px) {
  .video-card {
    width: 50%;
  }
}

@media (min-width: 1200px) {
  .video-card {
    width: 33%;
  }
}

.video-header h3 {
  font-size: 2em !important;
}

.user {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  font-family: 'Noto Serif', serif;
  margin-right: 1em;
  justify-content: space-between;
}

.avatar-name {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.video-description {
  max-height: 400px;
  overflow: auto;
}

.video-description img {
  width: 100%;
}

.issue-summary h1,
.issue-summary h2,
.issue-summary h3,
.issue-summary h4,
.issue-summary h5,
.issue-summary h6 {
  font-family: 'Open Sans', sans-serif;
}

.avatar {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}

a {
  text-decoration: none;
}

a:hover {
  color: #d9437f;
}
</style>
