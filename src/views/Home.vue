<script setup>
import { RouterLink } from "vue-router";
import NewsItem from "../components/NewsItem.vue";
import { ref, onMounted } from "vue";
import defaultNewsList from "../data/news.json";

const newsList = ref([]);

onMounted(() => {
  const saved = localStorage.getItem("newsList");

  if (saved) {
    try {
      newsList.value = JSON.parse(saved);
    } catch {
      newsList.value = defaultNewsList;
    }
  } else {
    newsList.value = defaultNewsList;
    localStorage.setItem("newsList", JSON.stringify(defaultNewsList));
  }
});
</script>

<template>
  <div class="home-page">
    <header class="site-header">
      <div class="header-inner">
        <div class="government-name">
          <span>マタク鯖</span>
          <strong>国土交通省</strong>
        </div>

        <nav>
          <RouterLink to="/login">管理者ログイン</RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero">
        <h1>マタク鯖国土交通省</h1>

        <h2>建築、鉄道、道路</h2>

        <p>国土交通省ホームページへようこそ。</p>
        <p>国土に関する最新情報をお届けします。</p>
      </section>

      <section class="news-section">
        <h3>最新のニュース</h3>

        <NewsItem
          v-if="newsList.length > 0"
          :tag="newsList[0].tag"
          :title="newsList[0].title"
          :date="newsList[0].date"
          :content="newsList[0].content"
        />

        <p v-else class="empty">
          現在、ニュースはありません。
        </p>
      </section>

      <section class="news-section">
        <h3>過去のニュース</h3>

        <NewsItem
          v-for="item in newsList.slice(1)"
          :key="item.id"
          :tag="item.tag"
          :title="item.title"
          :date="item.date"
          :content="item.content"
        />

        <p v-if="newsList.length <= 1" class="empty">
          過去のニュースはありません。
        </p>
      </section>
    </main>

    <footer>
      <div>
        <p>マタク鯖国土交通省</p>
        <p>Copyright © マタク鯖国土交通省 All Rights Reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  background: white;
  border-bottom: 1px solid #dbe2e8;
}

.header-inner {
  width: min(100% - 2rem, 64rem);
  min-height: 4.5rem;
  margin: auto;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.government-name {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
}

.government-name span {
  color: #64748b;
  font-size: 0.8rem;
}

.government-name strong {
  font-size: 1.35rem;
  font-weight: 600;
}

nav a {
  color: #334155;
  font-size: 0.85rem;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

main {
  width: min(100% - 2rem, 64rem);
  margin: auto;
  flex: 1;
}

.hero {
  padding: 4rem 0 2rem;
}

h1 {
  margin: 0;
  font-weight: 400;
  font-size: clamp(2.5rem, 4vw, 4rem);
  letter-spacing: -0.04em;
}

h2 {
  margin: 0.5rem 0 2rem;
  color: #64748b;
  font-weight: 400;
  font-size: clamp(1.25rem, 2vw, 1.75rem);
}

.hero p {
  margin: 0.4rem 0;
  font-size: 1rem;
}

.news-section {
  width: 100%;
  margin: 2rem 0;
  overflow: hidden;

  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;

  box-shadow: 0 4px 16px rgb(0 0 0 / 5%);
}

.news-section h3 {
  margin: 0;
  padding: 1rem 1.5rem;

  border-bottom: 1px solid #e2e8f0;

  color: #1e293b;
  font-size: 1.3rem;
  font-weight: 600;
}

.empty {
  margin: 0;
  padding: 1.5rem;
  color: #64748b;
}

footer {
  margin-top: 5rem;
  padding: 2rem 1rem;

  background: #1e293b;
  color: #cbd5e1;
}

footer div {
  width: min(100%, 64rem);
  margin: auto;
}

footer p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
}
</style>
