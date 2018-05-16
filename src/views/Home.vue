<template>
  <div class="home">
    <home-title></home-title>
    <form v-if="!loading">
      <label for="search">Search</label>
      <input type="text" id="search" @input="updateSearch($event.target.value)">
    </form>
    <label-buttons
      v-if="!loading"
      :labels="labels"
      :setLabelSelected="setLabelSelected"></label-buttons>
    <h2 class="data-info">Data last retrieved: {{cacheDate}}<br/> <button class="refresh-button" @click="loadIssues(false)">Refresh Data</button></h2>
    <h3 class="about" v-if="!loading">About: Sorted by number of positive emojis (👍, ❤️, 🎉 and 😁). Older issues with the same number of positive emojis will be listed first.</h3>
    <div class="issues">
      <h3 class="status">{{status}}</h3>
      <pagination
        ref="topButtons"
        v-if="!loading"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :setPage="setPage"></pagination>
      <transition-group class="issues" name="issues" tag="div">
        <issue
          v-if="!loading"
          v-for="issue in currentPageIssues"
          class="issues-item"
          :key="issue.id"
          :issue="issue"
          :reactions="reactions"
          :reactionImages="reactionImages"></issue>
      </transition-group>
      <pagination
        v-if="!loading"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :setPage="setPage"></pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

import HomeTitle from '@/components/HomeTitle';
import LabelButtons from '@/components/LabelButtons';
import Issue from '@/components/Issue';
import Pagination from '@/components/Pagination';

export default {
  name: 'home',
  components: {
    HomeTitle,
    LabelButtons,
    Issue,
    Pagination
  },
  mounted() {
    this.loadIssues();
  },
  watch: {
    currentPage() {
      this.$nextTick(() => {
        this.$refs.topButtons.$el.scrollIntoView();
      });
    }
  },
  computed: {
    ...mapGetters([
      'totalPages',
      'currentPageIssues',
      'cacheDate',
      'selectedLabels',
      'reactions'
    ]),
    ...mapState([
      'loading',
      'currentPage',
      'issues',
      'labels',
      'labelsById',
      'search',
      'status',
      'reactionImages'
    ])
  },
  methods: {
    ...mapMutations(['setPage', 'setLabelSelected']),
    ...mapActions(['loadIssues', 'updateSearch'])
  }
};
</script>

<style>
.home {
  margin-bottom: 2em;
}

.about {
  margin-top: 0em;
  color: #2494c1;
}

.status {
  font-family: 'Noto Serif', serif;
  color: #f35956;
}

.refresh-button {
  text-align: right;
  background: #49bb6c;
  color: white;
  font-size: 0.5em;
  padding: 10px;
}

.data-info {
  text-align: right;
  color: #49bb6c;
}

label {
  font-size: 1.5em;
  font-family: 'cubanoregular';
  letter-spacing: 0.4;
  font-weight: normal;
}

input,
select,
option {
  font-family: 'Noto Serif', serif;
  font-size: 2em;
  width: 100%;
  box-shadow: 0 10px 20px #eee, 0 6px 6px #d5d5d5;
  border-radius: 5px;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.issue-labels {
  margin-left: 1em;
}

.issues {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.issues-item {
  transition: all 1s;
}

.issues-enter,
.issues-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.issues-leave-active {
  position: absolute;
}

.label-button {
  font-size: 1.2em;
  margin: 1px;
  padding: 4px;
  color: white;
}
</style>
