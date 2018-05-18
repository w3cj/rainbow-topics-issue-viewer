const BASE_URL = 'https://api.github.com/';
const owner = 'CodingTrain';
const repo = 'Rainbow-Topics';

let cache = localStorage.cache ? JSON.parse(localStorage.cache) : null;
localStorage.cache_date = localStorage.cache_date || '';

export default {
  async getAllIssues(use_cache = true, statusCallback) {
    if (use_cache && cache) return Promise.resolve(cache);
    const allIssues = await getAll(
      `${BASE_URL}repos/${owner}/${repo}/issues`,
      'issues',
      statusCallback
    );
    cache = allIssues;
    localStorage.cache = JSON.stringify(allIssues);
    localStorage.cache_date = JSON.stringify(+new Date());
    statusCallback('');
    return allIssues;
  },
  getIssues(page) {
    return get(`${BASE_URL}repos/${owner}/${repo}/issues?page=${page}`);
  },
  getIssue(number) {
    return get(`${BASE_URL}repos/${owner}/${repo}/issues/${number}`);
  },
  getReactions(number) {
    return getAll(
      `${BASE_URL}repos/${owner}/${repo}/issues/${number}/reactions`
    );
  },
  getComments(number) {
    return getAll(
      `${BASE_URL}repos/${owner}/${repo}/issues/${number}/comments`
    );
  }
};

async function getAll(url, type, statusCallback) {
  statusCallback = statusCallback || (() => {});
  let all = [];
  return get(`${url}?page=1`).then(async ({ result, lastPage }) => {
    all = all.concat(result);
    let currentPage = 2;
    while (currentPage <= lastPage) {
      statusCallback(
        `Retrieved ${currentPage - 1} out of ${lastPage} pages of ${type}.`
      );
      let result;
      try {
        result = await get(`${url}?page=${currentPage}`);
      } catch (error) {
        statusCallback(error.message);
        return Promise.reject(error);
      }
      all = all.concat(result.result);
      currentPage++;
    }

    statusCallback('');
    return all;
  });
}

async function get(url) {
  url = localStorage.GITHUB_ACCESS_TOKEN
    ? `${url}${url.indexOf('?') > -1 ? '&' : '?'}access_token=${
        localStorage.GITHUB_ACCESS_TOKEN
      }`
    : url;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.squirrel-girl-preview'
    }
  });
  if (response.status == 403 || response.status == 401) {
    return Promise.reject(
      new Error(
        'Github API Rate Limit Exceded on this IP. Try again in 1 hour OR set localStorage.GITHUB_ACCESS_TOKEN to be a token with public_repo access generated here: https://github.com/settings/tokens'
      )
    );
  }
  const result = await response.json();
  const link = response.headers.get('Link');

  return {
    lastPage: link ? link.split(',')[1].match(/page=(\d*)/)[1] : '',
    result
  };
}
