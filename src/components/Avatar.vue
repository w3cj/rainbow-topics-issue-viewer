<template>
  <div>
    <a class="avatar-name" :href="user.html_url">
      <img class="avatar" :src="user.avatar_url">
      <span>{{user.login}}</span>
    </a>
  </div>
</template>

<script>
export default {
  props: ['user']
};
</script>

<style>
.avatar-name {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.avatar {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
</style>
