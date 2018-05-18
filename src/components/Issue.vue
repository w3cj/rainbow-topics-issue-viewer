<template>
  <div class="video-card" :class="{ moreInfo: moreInfo }">
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
      <avatar class="user" :user="issue.user"></avatar>
    </div>
    <div class="video-description">
      <p class="issue-summary" v-html="issue.summary"></p>
    </div>
    <all-reactions
      v-if="moreInfo"
      :reactionsError="reactionsError"
      :reactionsByType="reactionsByType"
      :reactionImages="reactionImages">
    </all-reactions>
    <reactions
      :issueReactions="issue.reactions"
      :reactions="reactions"
      :reactionImages="reactionImages"></reactions>
    <div class="buttons">
      <button
        :class="{ loading: loading }"
        :disabled="loading"
        class="view-reactions-button"
        @click="getMoreInfo()">{{moreInfo ? 'Hide' : 'View'}} Reactions</button>
      <a class="view-github-button" :href="issue.html_url" target="blank">View on Github</a>
    </div>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar';
import Reactions from '@/components/Reactions';
import AllReactions from '@/components/AllReactions';
import GithubAPI from '@/GithubAPI';

export default {
  props: ['issue', 'reactions', 'reactionImages'],
  components: {
    Reactions,
    Avatar,
    AllReactions
  },
  data: () => ({
    loading: false,
    hasMoreInfo: false,
    reactionsError: '',
    moreInfo: false,
    reactionsByType: {}
  }),
  methods: {
    async getMoreInfo() {
      if (!this.moreInfo && !this.hasMoreInfo) {
        this.loading = true;
        let reactions = [];
        try {
          reactions = await GithubAPI.getReactions(this.issue.number);
          this.reactionsError = '';
          this.hasMoreInfo = true;
        } catch (error) {
          this.reactionsError = error.message;
          this.hasMoreInfo = false;
        }

        const reactionsByType = reactions.reduce((byType, reaction) => {
          byType[reaction.content] = byType[reaction.content] || [];
          byType[reaction.content].push(reaction);
          return byType;
        }, {});
        this.reactionsByType = reactionsByType;
        this.moreInfo = true;
        this.loading = false;
      } else {
        this.moreInfo = !this.moreInfo;
      }
    }
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

a {
  text-decoration: none;
}

a:hover {
  color: #d9437f;
}

.moreInfo {
  width: 100%;
}

.view-reactions-button {
  background: #f1c500;
  color: white;
  font-size: 1em;
}

.view-github-button {
  padding: auto;
  background: #49bb6c !important;
}
</style>
