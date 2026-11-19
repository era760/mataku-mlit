<script setup>
import { RouterLink } from "vue-router";
import NewsItem from "../components/NewsItem.vue";
import { ref, onMounted } from "vue";
import defaultNewsList from "../data/news.json";

const newsList = ref([]);
const isLoading = ref(true);
const hasApiError = ref(false);
const apiErrorMessage = ref("");

const primeMinister = ref(null);
const totalSeats = ref(0);
const parties = ref([]);
const landMinister = ref(null);

async function fetchNews() {
  isLoading.value = true;
  hasApiError.value = false;
  apiErrorMessage.value = "";

  try {
    const res = await fetch("/api/news");

    if (res.ok) {
      const data = await res.json();

      if (Array.isArray(data)) {
        newsList.value = data;
        isLoading.value = false;
        return;
      } else {
        throw new Error("データの形式が不正です。");
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTPエラー: ${res.status}`);
    }
  } catch (e) {
    console.warn("APIからの取得に失敗しました:", e);
    hasApiError.value = true;
    apiErrorMessage.value =
      "最新ニュースの取得に失敗しました。サーバーがスリープ中か、通信エラーが発生しています。";

    const saved = localStorage.getItem("newsList");

    if (saved) {
      try {
        newsList.value = JSON.parse(saved);
      } catch {
        newsList.value = defaultNewsList;
      }
    } else {
      newsList.value = defaultNewsList;
    }
  } finally {
    isLoading.value = false;
  }
}

async function fetchPolitics() {
  try {
    const response = await fetch(
      "http://n3.host.ringonw.com:3315/diet.json"
    );

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();

    primeMinister.value = data.primeMinister;
    totalSeats.value = data.totalSeats;
    parties.value = data.parties ?? [];

    const foundMinister = data.cabinet?.find(
      member => member.role === "運営庁試験大臣"
    );

    landMinister.value = foundMinister?.name ?? null;

  } catch (e) {
    console.warn("政治APIの取得に失敗しました:", e);

    // APIが落ちていてもページ自体は動かす
    primeMinister.value = null;
    totalSeats.value = 0;
    parties.value = [];
    landMinister.value = null;
  }
}

onMounted(() => {
  fetchNews();
  fetchPolitics();
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
        <p>国土交通省に関する最新情報をお届けします。</p>
        <p>国土交通大臣：{{ landMinister ?? "不在" }}</p>
      </section>

      <section class="news-section">
        <h3>最新のニュース</h3>

        <!-- API取得失敗時のアラート表示 -->
        <div v-if="hasApiError" class="api-error-banner">
          <div class="error-header">
            <div class="error-title">
              <strong>{{ apiErrorMessage }}</strong>
            </div>
            <button type="button" class="retry-button" :disabled="isLoading" @click="fetchNews">
              {{ isLoading ? "再読み込み中..." : "再読み込み" }}
            </button>
          </div>
          <p class="error-subtext">
            データベース（Supabase）へのアクセスが失敗しました。7日間の未アクセスで一時スリープしている可能性があります。<br />
            Discordあんこもちへご連絡ください。
          </p>
        </div>

        <div v-if="isLoading && !hasApiError" class="loading-state">ニュースを読み込んでいます...</div>

        <NewsItem
          v-else-if="newsList.length > 0"
          :tag="newsList[0].tag"
          :title="newsList[0].title"
          :date="newsList[0].date"
          :content="newsList[0].content" />

        <p v-else class="empty">現在、ニュースはありません。</p>
      </section>

      <section class="news-section">
        <h3>過去のニュース</h3>

        <NewsItem
          v-for="item in newsList.slice(1)"
          :key="item.id"
          :tag="item.tag"
          :title="item.title"
          :date="item.date"
          :content="item.content" />

        <p v-if="newsList.length <= 1" class="empty">過去のニュースはありません。</p>
      </section>
    </main>
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
}

.news-section h3 {
  margin: 0;
  padding: 1rem 1.5rem;

  border-bottom: 1px solid #e2e8f0;

  color: #1e293b;
  font-size: 1.3rem;
  font-weight: 600;
}

/* APIエラー表示バナー */
.api-error-banner {
  margin: 1.25rem 1.5rem 0.5rem;
  padding: 1rem 1.25rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.error-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.4rem;
}

.error-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #991b1b;
  font-size: 0.95rem;
}

.error-subtext {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #b91c1c;
}

.retry-button {
  padding: 0.35rem 0.75rem;
  border: 1px solid #f87171;
  border-radius: 0.25rem;
  background: white;
  color: #b91c1c;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.retry-button:hover:not(:disabled) {
  background: #fee2e2;
}

.retry-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  padding: 2rem 1.5rem;
  color: #64748b;
  font-size: 0.95rem;
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
