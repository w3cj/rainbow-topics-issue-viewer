import Vue from 'vue';
import Vuex from 'vuex';
import { debounce } from 'lodash';
import marked from 'marked';
import github from '@/GithubAPI';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: true,
    issues: [],
    labels: [],
    labelsById: {},
    search: '',
    status: '',
    cache_date: null,
    reactionImages: {
      '+1':
        'https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png',
      '-1':
        'https://assets-cdn.github.com/images/icons/emoji/unicode/1f44e.png',
      confused:
        'https://assets-cdn.github.com/images/icons/emoji/unicode/1f615.png',
      heart:
        'https://assets-cdn.github.com/images/icons/emoji/unicode/2764.png',
      hooray:
        'https://assets-cdn.github.com/images/icons/emoji/unicode/1f389.png',
      laugh:
        'https://assets-cdn.github.com/images/icons/emoji/unicode/1f604.png'
    },
    currentPage: 0,
    pageSize: 12,
    negativeReactions: {
      '-1': true,
      confused: true
    }
  },
  getters: {
    currentPageIssues(state, getters) {
      const start = state.currentPage * state.pageSize;
      return getters.filteredIssues.slice(start, start + state.pageSize);
    },
    totalPages(state, getters) {
      return Math.floor(getters.filteredIssues.length / state.pageSize);
    },
    cacheDate(state) {
      if (state.cache_date) {
        return (
          new Date(+state.cache_date).toLocaleDateString() +
          ' ' +
          new Date(+state.cache_date).toLocaleTimeString()
        );
      }
      return 'Retrieving...';
    },
    reactions(state) {
      return Object.keys(state.reactionImages);
    },
    selectedLabelsById(state, getters) {
      return getters.selectedLabels.reduce((byId, label) => {
        byId[label.id] = true;
        return byId;
      }, {});
    },
    selectedLabels(state) {
      return state.labels.filter(label => label.selected);
    },
    filteredIssues(state, getters) {
      const issues = state.issues;
      if (state.search || getters.selectedLabels.length > 0) {
        const searchRexExp = new RegExp(
          state.search.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'),
          'gi'
        );

        return issues.filter(issue => {
          let matchesLabels = true;
          if (getters.selectedLabels.length == 1) {
            matchesLabels = issue.labels.some(
              label => getters.selectedLabelsById[label.id]
            );
          } else if (getters.selectedLabels.length > 1) {
            matchesLabels = getters.selectedLabels.every(
              label => issue.labelIds[label.id]
            );
          }
          return (
            matchesLabels &&
            (state.search
              ? (issue.user.login + issue.title + issue.body).match(
                  searchRexExp
                )
              : true)
          );
        });
      }

      const reactionScore = issue =>
        getters.reactions.reduce((sum, reaction) => {
          if (!state.negativeReactions[reaction]) {
            sum += issue.reactions[reaction];
          }
          return sum;
        }, 0);

      return issues.sort((a, b) => {
        const diff = reactionScore(b) - reactionScore(a);

        if (diff == 0) {
          return +new Date(a.created_at) - +new Date(b.created_at);
        }

        return diff;
      });
    }
  },
  mutations: {
    setLoading: (state, value) => (state.loading = value),
    setPage: (state, page) => (state.currentPage = page),
    setCacheDate: (state, date) => (state.cache_date = date),
    setIssues: (state, issues) => (state.issues = issues),
    setLabels: (state, labels) => (state.labels = labels),
    setLabelsById: (state, labelsById) => (state.labelsById = labelsById),
    setSearch: (state, search) => (state.search = search),
    setLabelSelected: (state, { id, selected }) => {
      state.currentPage = 0;
      state.labelsById[id].selected = selected;
    },
    setLoadingStatus: (state, status) => (state.status = status)
  },
  actions: {
    updateSearch: debounce(function(context, value) {
      context.commit('setPage', 0);
      context.commit('setSearch', value);
    }, 200),
    async loadIssues(context, use_cache) {
      context.commit('setLoading', true);
      context.commit('setIssues', []);
      context.commit('setCacheDate', null);
      let issues = [];
      try {
        issues = await github.getAllIssues(use_cache, status => {
          context.commit('setLoadingStatus', status);
        });
      } catch (error) {
        issues = localStorage.cache ? JSON.parse(localStorage.cache) : [];
        context.commit('setLoadingStatus', error.message);
      }
      const labels = [];
      const labelsById = {};

      issues.forEach(issue => {
        issue.labelIds = {};
        issue.summary = marked(issue.body);

        // if (issue.summary.length > 200) {
        //   issue.summary = issue.body.substring(0, 200) + '...';
        // }

        issue.formattedDate = new Date(issue.created_at).toLocaleDateString();

        if (issue.labels.length > 0) {
          issue.labels.forEach(label => {
            if (!labelsById[label.id]) {
              label.selected = false;
              labelsById[label.id] = label;
              labels.push(label);
            }
            issue.labelIds[label.id] = true;
          });
        }
      });
      context.commit('setCacheDate', localStorage.cache_date);
      context.commit('setIssues', issues);
      context.commit('setLabels', labels);
      context.commit('setLabelsById', labelsById);
      context.commit('setLoading', false);
    }
  }
});
