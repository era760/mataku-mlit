<script setup>
defineProps({
  tag: {
    type: String,
    default: "お知らせ",
  },

  title: {
    type: String,
    default: "",
  },

  date: {
    type: String,
    default: "",
  },

  content: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <article class="news-item">
    <div class="news-header">
      <span
        class="news-tag"
        :class="{ important: tag === '重要' }"
      >
        {{ tag }}
      </span>

      <h4>{{ title }}</h4>
    </div>

    <time :datetime="date">
      {{ date }}
    </time>

    <p>{{ content }}</p>
  </article>
</template>

<style scoped>
.news-item {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.news-item:last-child {
  border-bottom: none;
}

.news-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.news-header h4 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: normal;
  line-height: 1.6;
}

.news-tag {
  flex-shrink: 0;
  padding: 0.25rem 0.6rem;

  color: white;
  background: #475569;

  border-radius: 0.25rem;

  font-size: 0.8rem;
  font-weight: normal;
}

.news-tag.important {
  background: #b91c1c;
}

time {
  display: block;
  margin-top: 0.45rem;

  color: #64748b;
  font-size: 0.8rem;
}

p {
  margin: 0.75rem 0 0;

  color: #334155;
  font-size: 0.95rem;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>
