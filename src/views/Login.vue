<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const password = ref("");
const error = ref("");

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

function login() {
  if (password.value === ADMIN_PASSWORD) {
    localStorage.setItem("adminLoggedIn", "true");
    router.push("/admin");
  } else {
    error.value = "パスワードが正しくありません。";
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <div class="logo">
        <span>マタク鯖</span>
        <strong>国土交通省</strong>
      </div>

      <h1>管理者ログイン</h1>

      <form @submit.prevent="login">
        <label for="password">
          パスワード
        </label>

        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="パスワードを入力"
        />

        <p v-if="error" class="error">
          {{ error }}
        </p>

        <button type="submit">
          ログイン
        </button>
      </form>

      <RouterLink to="/" class="back">
        ← ホームへ戻る
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;

  display: grid;
  place-items: center;

  padding: 1rem;
}

.login-card {
  width: min(100%, 26rem);
  padding: 2.5rem;

  background: white;

  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;

  box-shadow: 0 8px 30px rgb(0 0 0 / 6%);
}

.logo {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  margin-bottom: 2rem;
}

.logo span {
  color: #64748b;
  font-size: 0.75rem;
}

.logo strong {
  font-size: 1.15rem;
  font-weight: 600;
}

h1 {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

form {
  display: grid;
  gap: 0.7rem;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.75rem;

  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;

  font: inherit;
}

input:focus {
  outline: 2px solid #93c5fd;
  outline-offset: 1px;
}

button {
  margin-top: 0.5rem;
  padding: 0.75rem;

  border: 0;
  border-radius: 0.25rem;

  background: #1e3a8a;
  color: white;

  font: inherit;
  font-weight: 600;

  cursor: pointer;
}

button:hover {
  background: #1e40af;
}

.error {
  margin: 0;
  color: #b91c1c;
  font-size: 0.85rem;
}

.back {
  display: block;
  margin-top: 1.5rem;

  color: #64748b;
  font-size: 0.85rem;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}
</style>
