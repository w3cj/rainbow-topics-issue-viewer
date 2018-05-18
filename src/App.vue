<template>
  <div class="app">
    <header>
      <a href="/">
        <div class="header-image"></div>
      </a>
    </header>
    <div class="wrapper" style="">
      <router-view></router-view>
      <small>Made with 🌈 and ❤️ by
        <a href="https://github.com/w3cj/rainbow-topics-issue-viewer">w3cj</a>
      </small>
    </div>
  </div>
</template>

<style>
h1 {
  text-align: center;
}

@keyframes rainbow {
  from {
    background-position: top left;
  }
  to {
    background-position: top right;
  }
}

.loading {
  background-image: linear-gradient(
    to left,
    #f35956,
    #f5720f,
    #f1c500,
    #49bb6c,
    #2494c1,
    #9659a7,
    #d9437f,
    #9659a7,
    #2494c1,
    #49bb6c,
    #f1c500,
    #f5720f,
    #f35956
  ) !important;
  animation: rainbow 2.5s forwards linear infinite !important;
  background-size: 50% auto !important;
}
</style>
