<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New&display=swap');

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #f5f5f5;
  color: #111827;
  font-family:
    "Zen Kaku Gothic New",
    "游ゴシック体",
    "Yu Gothic",
    YuGothic,
    sans-serif
}

a {
  color: inherit;
}
</style>
