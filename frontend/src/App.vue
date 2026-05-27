<script setup lang="ts">
import { computed, ref } from 'vue';

import ImageGrid from './components/ImageGrid.vue';
import VideoCard from './components/VideoCard.vue';

type MediaType = 'video' | 'images';

interface MediaData {
  title: string;
  uploader: string;
  platform: string;
  type: MediaType;
  media_list: string[];
}

interface ParseResponse {
  success: boolean;
  data: MediaData | null;
  message: string;
}

const inputUrl = ref('');
const loading = ref(false);
const errorMessage = ref('');
const result = ref<MediaData | null>(null);

const canSubmit = computed(() => !!inputUrl.value.trim() && !loading.value);

async function pasteFromClipboard() {
  try {
    inputUrl.value = await navigator.clipboard.readText();
  } catch (_error) {
    errorMessage.value = '读取剪贴板失败，请手动粘贴链接。';
  }
}

async function parseUrl() {
  if (!canSubmit.value) return;
  loading.value = true;
  errorMessage.value = '';
  result.value = null;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: inputUrl.value.trim() }),
    });

    const payload = (await response.json()) as ParseResponse;
    if (!payload.success || !payload.data) {
      throw new Error(payload.message || '解析失败');
    }

    result.value = payload.data;
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : '网络异常，请稍后重试。';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 p-4 text-slate-900">
    <div class="mx-auto max-w-4xl py-10">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-bold tracking-tight">Media Parser Pro</h1>
        <p class="mt-2 text-sm text-slate-500">后端只解析链接，下载完全走浏览器本地网络</p>
      </header>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <label for="url-input" class="mb-2 block text-sm font-medium text-slate-600">粘贴媒体页面链接</label>
        <div class="flex flex-col gap-3 sm:flex-row">
          <input
            id="url-input"
            v-model="inputUrl"
            type="url"
            class="h-12 flex-1 rounded-xl border border-slate-300 px-4 outline-none ring-sky-500 transition focus:ring-2"
            placeholder="https://..."
          />
          <button class="h-12 rounded-xl bg-slate-900 px-4 text-white hover:bg-slate-700" @click="pasteFromClipboard">
            一键粘贴
          </button>
          <button
            class="h-12 rounded-xl bg-sky-600 px-5 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!canSubmit"
            @click="parseUrl"
          >
            立即解析
          </button>
        </div>
      </section>

      <div v-if="errorMessage" class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMessage }}
      </div>

      <section v-if="loading" class="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
        <div class="mb-4 flex items-center gap-3">
          <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
          <span class="text-sm text-slate-600">正在解析资源...</span>
        </div>
        <div class="space-y-3">
          <div class="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
          <div class="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          <div class="h-44 w-full animate-pulse rounded-xl bg-slate-200" />
        </div>
      </section>

      <section v-if="result" class="mt-6">
        <VideoCard
          v-if="result.type === 'video'"
          :title="result.title"
          :uploader="result.uploader"
          :video-url="result.media_list[0]"
        />
        <ImageGrid v-else :title="result.title" :uploader="result.uploader" :images="result.media_list" />
      </section>
    </div>
  </main>
</template>
