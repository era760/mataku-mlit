<script setup>
import NewsItem from "./components/NewsItem.vue";
const newsList = [
  {
    id: 1,
    tag: "重要",
    title: "衆議院解散！",
    date: "2026-10-18",
    content: "衆議院が解散したため、国土交通大臣が変わります。",
  },
  {
    id: 2,
    tag: "重要",
    title: "マタク鯖国土交通省ホームページが作られました。",
    date: "2026-10-17",
  },
  {
    id: 3,
    tag: "重要",
    title: "マタク鯖国土交通省が建てられました。",
  },
];
</script>

<template>
  <main>
    <h1>マタク鯖国土交通省ホームページ</h1>
    <h2>建築、鉄道、道路</h2>
    <p>国土交通省ホームページへようこそ。</p>
    <p>国土に関する最新情報をお届けします。</p>
    <div class="latest-news">
      <h3>最新ニュース</h3>
      <div class="news-item">
        <span class="news-tag">重要</span>
        <p>衆議院解散！</p>
      </div>
    </div>
    <div class="news">
      <h3>過去のニュース</h3>
      <div v-for="item in newsList" :key="item.id" class="news-item">
        <NewsItem :tag="item.tag" :title="item.title" />
      </div>
    </div>
  </main>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap");
body {
  background-color: #f5f5f5;
  color: black;
  font-family: "Noto Sans JP", "Yu Gothic UI", "Meiryo", sans-serif;
}
h1 {
  font-weight: 400;
  font-size: clamp(2.5rem, 4vw, 4rem);
  letter-spacing: -0.04em;
}

h2 {
  font-weight: 400;
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  color: #64748b;
}

p {
  font-size: 1.25rem;
}

.latest-news,
.news {
  box-sizing: border-box;
  width: min(100% - 2rem, 50rem);
  margin: 3rem auto;
  padding: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 16px rgb(0 0 0 / 5%);
}

h3 {
  margin: 0;
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: left;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
}

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
