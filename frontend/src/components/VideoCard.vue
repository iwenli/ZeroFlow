<script setup lang="ts">
import { ref } from 'vue';

import { downloadDirect } from '../utils/downloader';

const props = defineProps<{
  title: string;
  uploader: string;
  videoUrl: string;
}>();

const showModal = ref(false);
const modalReason = ref('');

const safeName = (value: string) => value.replace(/[\\/:*?"<>|]/g, '_');

async function handleDownload() {
  await downloadDirect(props.videoUrl, `${safeName(props.title || 'video')}.mp4`, (_url, reason) => {
    modalReason.value = reason;
    showModal.value = true;
  });
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
    <h2 class="text-xl font-semibold text-slate-900">{{ title }}</h2>
    <p class="mt-1 text-sm text-slate-500">发布者：{{ uploader }}</p>

    <video class="mt-4 w-full rounded-xl bg-black" :src="videoUrl" controls playsinline preload="metadata" />

    <button
      class="mt-4 w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
      @click="handleDownload"
    >
      立即下载视频
    </button>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
      @click.self="showModal = false"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 class="text-lg font-semibold text-slate-900">下载受限提示</h3>
        <p class="mt-3 text-sm leading-6 text-slate-600">
          由于平台防盗链限制，请
          <a :href="videoUrl" target="_blank" rel="noopener" class="font-medium text-sky-600 underline">
            点击在新标签页打开视频
          </a>
          ，随后在视频上右键选择“视频另存为”即可免费下载。
        </p>
        <p class="mt-2 text-xs text-slate-400">错误详情：{{ modalReason }}</p>
        <button
          class="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700"
          @click="showModal = false"
        >
          我知道了
        </button>
      </div>
    </div>
  </section>
</template>
