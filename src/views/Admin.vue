<script setup>
import { RouterLink } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import defaultNewsList from "../data/news.json";

const router = useRouter();

function getInitialNews() {
  const saved = localStorage.getItem("newsList");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultNewsList;
    }
  }
  return defaultNewsList;
}

const newsList = ref(getInitialNews());

const tag = ref("お知らせ");
const title = ref("");
const date = ref(new Date().toISOString().slice(0, 10));
const content = ref("");

const message = ref("");
const error = ref("");

const editingId = ref(null);
const fileInputRef = ref(null);

const isEditing = computed(() => editingId.value !== null);

onMounted(() => {
  // 認証チェック
  if (localStorage.getItem("adminLoggedIn") !== "true") {
    router.push("/login");
  }
});

function saveNews() {
  error.value = "";
  message.value = "";

  if (!title.value.trim()) {
    error.value = "タイトルを入力してください。";
    return;
  }

  if (!date.value) {
    error.value = "日付を入力してください。";
    return;
  }

  if (!content.value.trim()) {
    error.value = "内容を入力してください。";
    return;
  }

  if (isEditing.value) {
    const index = newsList.value.findIndex(
      (item) => item.id === editingId.value
    );

    if (index !== -1) {
      newsList.value[index] = {
        id: editingId.value,
        tag: tag.value,
        title: title.value.trim(),
        date: date.value,
        content: content.value.trim(),
      };
    }

    message.value = "記事を更新しました。";
  } else {
    newsList.value.unshift({
      id: Date.now(),
      tag: tag.value,
      title: title.value.trim(),
      date: date.value,
      content: content.value.trim(),
    });

    message.value = "記事を追加しました。";
  }

  saveToStorage();
  resetForm();
}

function saveToStorage() {
  localStorage.setItem(
    "newsList",
    JSON.stringify(newsList.value)
  );
}

function editNews(item) {
  editingId.value = item.id;
  tag.value = item.tag;
  title.value = item.title;
  date.value = item.date;
  content.value = item.content;

  message.value = "";
  error.value = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function deleteNews(id) {
  if (!confirm("この記事を削除しますか？")) {
    return;
  }

  newsList.value = newsList.value.filter(
    (item) => item.id !== id
  );

  saveToStorage();

  if (editingId.value === id) {
    resetForm();
  }

  message.value = "記事を削除しました。";
}

function resetForm() {
  editingId.value = null;
  tag.value = "お知らせ";
  title.value = "";
  date.value = new Date().toISOString().slice(0, 10);
  content.value = "";
}

function exportJson() {
  const jsonStr = JSON.stringify(newsList.value, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "news.json";
  a.click();
  URL.revokeObjectURL(url);
  message.value = "news.json をダウンロードしました。";
}

function triggerImport() {
  fileInputRef.value?.click();
}

function handleFileImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        newsList.value = data;
        saveToStorage();
        message.value = "JSONファイルから記事を読み込みました。";
        error.value = "";
      } else {
        error.value = "JSONファイルの形式が不正です（配列である必要があります）。";
      }
    } catch {
      error.value = "JSONファイルの解析に失敗しました。";
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function resetToDefaultJson() {
  if (!confirm("記事データを初期の news.json の状態にリセットしますか？現在の編集内容は失われます。")) {
    return;
  }
  newsList.value = [...defaultNewsList];
  saveToStorage();
  resetForm();
  message.value = "初期の news.json の状態にリセットしました。";
}

function logout() {
  localStorage.removeItem("adminLoggedIn");
  router.push("/login");
}
</script>

<template>
  <main class="admin-page">
    <header class="admin-header">
      <div>
        <div class="ministry">
          <span>マタク鯖</span>
          <strong>国土交通省</strong>
        </div>

        <h1>記事管理</h1>
      </div>

      <div class="header-actions">
        <RouterLink to="/">
          公開ページ
        </RouterLink>

        <button
          class="logout-button"
          type="button"
          @click="logout"
        >
          ログアウト
        </button>
      </div>
    </header>

    <!-- JSON管理セクション -->
    <section class="json-section">
      <div class="section-header">
        <div>
          <h2>JSONファイル管理</h2>
          <p>
            記事データのJSON書き出し（エクスポート）や、外部JSONファイルの読み込みを行います。
          </p>
        </div>
      </div>

      <div class="json-actions">
        <button
          type="button"
          class="action-btn"
          @click="exportJson"
        >
          📄 news.json をダウンロード
        </button>

        <button
          type="button"
          class="action-btn"
          @click="triggerImport"
        >
          📂 JSONファイルをインポート
        </button>
        <input
          ref="fileInputRef"
          type="file"
          accept=".json,application/json"
          style="display: none"
          @change="handleFileImport"
        />

        <button
          type="button"
          class="action-btn text-danger"
          @click="resetToDefaultJson"
        >
          🔄 初期JSONデータにリセット
        </button>
      </div>
    </section>

    <section class="form-section">
      <div class="section-header">
        <div>
          <h2>
            {{ isEditing ? "記事を編集" : "新しい記事を追加" }}
          </h2>

          <p>
            ホームページに掲載するニュースを管理します。
          </p>
        </div>
      </div>

      <form @submit.prevent="saveNews">
        <div class="form-row">
          <label>
            <span>タグ</span>

            <select v-model="tag">
              <option value="重要">重要</option>
              <option value="お知らせ">お知らせ</option>
              <option value="その他">その他</option>
            </select>
          </label>

          <label>
            <span>日付</span>

            <input
              v-model="date"
              type="date"
            />
          </label>
        </div>

        <label>
          <span>タイトル</span>

          <input
            v-model="title"
            type="text"
            placeholder="記事のタイトル"
          />
        </label>

        <label>
          <span>内容</span>

          <textarea
            v-model="content"
            placeholder="記事の内容を入力してください。"
          ></textarea>
        </label>

        <div class="form-actions">
          <button
            type="submit"
            class="primary-button"
          >
            {{ isEditing ? "記事を更新" : "記事を追加" }}
          </button>

          <button
            v-if="isEditing"
            type="button"
            class="secondary-button"
            @click="resetForm"
          >
            編集をキャンセル
          </button>
        </div>
      </form>

      <p v-if="message" class="message">
        {{ message }}
      </p>

      <p v-if="error" class="error">
        {{ error }}
      </p>
    </section>

    <section class="articles-section">
      <div class="section-header">
        <div>
          <h2>登録済みの記事</h2>

          <p>
            全 {{ newsList.length }} 件
          </p>
        </div>
      </div>

      <div
        v-if="newsList.length === 0"
        class="empty"
      >
        登録されている記事はありません。
      </div>

      <article
        v-for="item in newsList"
        :key="item.id"
        class="article"
      >
        <div class="article-top">
          <span
            class="tag"
            :class="{ important: item.tag === '重要' }"
          >
            {{ item.tag }}
          </span>

          <time :datetime="item.date">
            {{ item.date }}
          </time>
        </div>

        <h3>{{ item.title }}</h3>

        <p>{{ item.content }}</p>

        <div class="article-actions">
          <button
            type="button"
            @click="editNews(item)"
          >
            編集
          </button>

          <button
            type="button"
            class="delete"
            @click="deleteNews(item.id)"
          >
            削除
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.admin-page {
  width: min(100% - 2rem, 64rem);
  margin: 0 auto;
  padding: 2rem 0 5rem;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 2rem;
}

.ministry {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  color: #64748b;
  font-size: 0.8rem;
}

.ministry strong {
  color: #1e293b;
  font-size: 1.2rem;
}

h1 {
  margin: 0.5rem 0 0;
  font-size: 2rem;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-actions a {
  color: #334155;
  font-size: 0.85rem;
  text-decoration: none;
}

.header-actions a:hover {
  text-decoration: underline;
}

.logout-button {
  padding: 0.5rem 0.8rem;

  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;

  background: white;
  color: #334155;

  cursor: pointer;
}

.json-section,
.form-section,
.articles-section {
  margin-bottom: 2rem;
  padding: 2rem;

  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
}

.json-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.6rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: #f8fafc;
  color: #334155;
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.action-btn:hover {
  background: #e2e8f0;
}

.action-btn.text-danger {
  color: #b91c1c;
  border-color: #fecaca;
}

.action-btn.text-danger:hover {
  background: #fef2f2;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.section-header p {
  margin: 0.4rem 0 0;
  color: #64748b;
  font-size: 0.85rem;
}

form {
  display: grid;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  display: grid;
  gap: 0.4rem;
}

label span {
  color: #334155;
  font-size: 0.85rem;
  font-weight: 600;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.7rem;

  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;

  background: white;

  font: inherit;
}

textarea {
  min-height: 12rem;
  resize: vertical;
  line-height: 1.7;
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #93c5fd;
  outline-offset: 1px;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.primary-button,
.secondary-button {
  padding: 0.7rem 1rem;

  border-radius: 0.25rem;

  font: inherit;
  font-weight: 600;

  cursor: pointer;
}

.primary-button {
  border: 0;
  background: #1e3a8a;
  color: white;
}

.primary-button:hover {
  background: #1e40af;
}

.secondary-button {
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
}

.message {
  margin: 1rem 0 0;
  color: #166534;
  font-size: 0.85rem;
}

.error {
  margin: 1rem 0 0;
  color: #b91c1c;
  font-size: 0.85rem;
}

.article {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.article:last-child {
  border-bottom: none;
}

.article-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tag {
  padding: 0.2rem 0.55rem;

  background: #475569;
  color: white;

  border-radius: 0.2rem;

  font-size: 0.75rem;
  font-weight: 600;
}

.tag.important {
  background: #b91c1c;
}

time {
  color: #64748b;
  font-size: 0.8rem;
}

.article h3 {
  margin: 0.6rem 0 0.4rem;

  color: #1e293b;
  font-size: 1.1rem;
}

.article p {
  margin: 0;

  color: #475569;
  font-size: 0.9rem;
  line-height: 1.8;

  white-space: pre-wrap;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.article-actions button {
  padding: 0.45rem 0.8rem;

  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;

  background: white;
  color: #334155;

  cursor: pointer;
}

.article-actions .delete {
  border-color: #fecaca;
  color: #b91c1c;
}

.empty {
  padding: 2rem 0;
  color: #64748b;
  text-align: center;
}

@media (max-width: 600px) {
  .admin-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .json-section,
  .form-section,
  .articles-section {
    padding: 1.25rem;
  }
}
</style>
