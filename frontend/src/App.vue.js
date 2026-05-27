import { computed, ref } from 'vue';
import ImageGrid from './components/ImageGrid.vue';
import VideoCard from './components/VideoCard.vue';
const inputUrl = ref('');
const loading = ref(false);
const errorMessage = ref('');
const result = ref(null);
const canSubmit = computed(() => !!inputUrl.value.trim() && !loading.value);
async function pasteFromClipboard() {
    try {
        inputUrl.value = await navigator.clipboard.readText();
    }
    catch (_error) {
        errorMessage.value = '读取剪贴板失败，请手动粘贴链接。';
    }
}
async function parseUrl() {
    if (!canSubmit.value)
        return;
    loading.value = true;
    errorMessage.value = '';
    result.value = null;
    try {
        const response = await fetch('http://127.0.0.1:8000/api/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: inputUrl.value.trim() }),
        });
        const payload = (await response.json());
        if (!payload.success || !payload.data) {
            throw new Error(payload.message || '解析失败');
        }
        result.value = payload.data;
    }
    catch (error) {
        errorMessage.value = error instanceof Error ? error.message : '网络异常，请稍后重试。';
    }
    finally {
        loading.value = false;
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 p-4 text-slate-900" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mx-auto max-w-4xl py-10" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "mb-8 text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-3xl font-bold tracking-tight" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-2 text-sm text-slate-500" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
    ...{ class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-lg" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    for: "url-input",
    ...{ class: "mb-2 block text-sm font-medium text-slate-600" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-col gap-3 sm:flex-row" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "url-input",
    type: "url",
    ...{ class: "h-12 flex-1 rounded-xl border border-slate-300 px-4 outline-none ring-sky-500 transition focus:ring-2" },
    placeholder: "https://...",
});
(__VLS_ctx.inputUrl);
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.pasteFromClipboard) },
    ...{ class: "h-12 rounded-xl bg-slate-900 px-4 text-white hover:bg-slate-700" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.parseUrl) },
    ...{ class: "h-12 rounded-xl bg-sky-600 px-5 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50" },
    disabled: (!__VLS_ctx.canSubmit),
});
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 break-words [overflow-wrap:anywhere]" },
    });
    (__VLS_ctx.errorMessage);
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mb-4 flex items-center gap-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: "inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-sm text-slate-600" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "space-y-3" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ class: "h-4 w-2/3 animate-pulse rounded bg-slate-200" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ class: "h-4 w-1/2 animate-pulse rounded bg-slate-200" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ class: "h-44 w-full animate-pulse rounded-xl bg-slate-200" },
    });
}
if (__VLS_ctx.result) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)({
        ...{ class: "mt-6" },
    });
    if (__VLS_ctx.result.type === 'video') {
        /** @type {[typeof VideoCard, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(VideoCard, new VideoCard({
            title: (__VLS_ctx.result.title),
            uploader: (__VLS_ctx.result.uploader),
            videoUrl: (__VLS_ctx.result.media_list[0]),
        }));
        const __VLS_1 = __VLS_0({
            title: (__VLS_ctx.result.title),
            uploader: (__VLS_ctx.result.uploader),
            videoUrl: (__VLS_ctx.result.media_list[0]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
    }
    else {
        /** @type {[typeof ImageGrid, ]} */ ;
        // @ts-ignore
        const __VLS_3 = __VLS_asFunctionalComponent(ImageGrid, new ImageGrid({
            title: (__VLS_ctx.result.title),
            uploader: (__VLS_ctx.result.uploader),
            images: (__VLS_ctx.result.media_list),
        }));
        const __VLS_4 = __VLS_3({
            title: (__VLS_ctx.result.title),
            uploader: (__VLS_ctx.result.uploader),
            images: (__VLS_ctx.result.media_list),
        }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    }
}
/** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-gradient-to-b']} */ ;
/** @type {__VLS_StyleScopedClasses['from-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['via-white']} */ ;
/** @type {__VLS_StyleScopedClasses['to-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['max-w-4xl']} */ ;
/** @type {__VLS_StyleScopedClasses['py-10']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-3xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['block']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex-row']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['ring-sky-500']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['h-12']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-sky-600']} */ ;
/** @type {__VLS_StyleScopedClasses['px-5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-sky-700']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:cursor-not-allowed']} */ ;
/** @type {__VLS_StyleScopedClasses['disabled:opacity-50']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-red-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-50']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['break-words']} */ ;
/** @type {__VLS_StyleScopedClasses['[overflow-wrap:anywhere]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['p-5']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['border-2']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-300']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t-sky-600']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2/3']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-1/2']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['h-44']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-6']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ImageGrid: ImageGrid,
            VideoCard: VideoCard,
            inputUrl: inputUrl,
            loading: loading,
            errorMessage: errorMessage,
            result: result,
            canSubmit: canSubmit,
            pasteFromClipboard: pasteFromClipboard,
            parseUrl: parseUrl,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
