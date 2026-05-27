<script setup lang="ts">
import { computed, ref } from 'vue';

import { downloadDirect } from '../utils/downloader';

const props = defineProps<{
  title: string;
  uploader: string;
  images: string[];
}>();

const selected = ref<Set<number>>(new Set());
const showModal = ref(false);
const fallbackUrl = ref('');
const modalReason = ref('');

const selectedCount = computed(() => selected.value.size);
const allSelected = computed(() => props.images.length > 0 && selected.value.size === props.images.length);

const safeName = (value: string) => value.replace(/[\\/:*?"<>|]/g, '_');

function toggleSelect(index: number) {
  const next = new Set(selected.value);
  if (next.has(index)) {
    next.delete(index);
  } else {
    next.add(index);
  }
  selected.value = next;
}

function toggleAll() {
  if (allSelected.value) {
    selected.value = new Set();
    return;
  }
  selected.value = new Set(props.images.map((_, idx) => idx));
}

async function downloadSelected() {
  for (const index of selected.value) {
    const url = props.images[index];
    await downloadDirect(url, `${safeName(props.title || 'image')}-${index + 1}.jpg`, (targetUrl, reason) => {
      fallbackUrl.value = targetUrl;
      modalReason.value = reason;
      showModal.value = true;
    });
  }
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
    <h2 class="text-xl font-semibold text-slate-900">{{ title }}</h2>
    <p class="mt-1 text-sm text-slate-500">发布者：{{ uploader }}</p>

    <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <article v-for="(img, idx) in images" :key="`${img}-${idx}`" class="group relative overflow-hidden rounded-xl border">
        <img :src="img" :alt="`image-${idx + 1}`" class="h-40 w-full object-cover transition group-hover:scale-105" />
        <label class="absolute right-2 top-2 rounded bg-white/90 p-1">
          <input type="checkbox" :checked="selected.has(idx)" @change="toggleSelect(idx)" />
        </label>
      </article>
    </div>

    <div class="mt-5 flex flex-wrap items-center gap-3">
      <button class="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700" @click="toggleAll">
        {{ allSelected ? '取消全选' : '全选' }}
      </button>
      <button
        class="rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="selectedCount === 0"
        @click="downloadSelected"
      >
        下载选中（{{ selectedCount }}）
      </button>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4"
      @click.self="showModal = false"
    >
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 class="text-lg font-semibold text-slate-900">下载受限提示</h3>
        <p class="mt-3 text-sm leading-6 text-slate-600">
          由于平台防盗链限制，请
          <a :href="fallbackUrl" target="_blank" rel="noopener" class="font-medium text-sky-600 underline">
            点击在新标签页打开图片
          </a>
          ，随后右键选择“图片另存为”完成下载。
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
