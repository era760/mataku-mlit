<script setup>
defineProps({
  tag: String,
  title: String,
});
</script>

<template>
  <div class="news-item">
    <span class="news-tag">{{ tag }}</span>
    <p>{{ title }}</p>
  </div>
</template>

<style scoped>
.news-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}

.news-item p {
  margin: 0;
  font-size: 1rem;
}

.news-tag {
  flex-shrink: 0;
  padding: 0.25rem 0.6rem;
  color: white;
  background: #b91c1c;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
