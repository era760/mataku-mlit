<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap');

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #f1f5f9;
  color: #111827;
  font-family:
  "Noto Sans JP"
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
