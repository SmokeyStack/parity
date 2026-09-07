import { ref } from 'vue';
import { toBlob } from 'html-to-image';

export function useCopyAsImage() {
    const copiedKey = ref<string | null>(null);

    async function copyAsImage(element: HTMLElement, key: string) {
        try {
            const blob = await toBlob(element, {
                filter: (node) =>
                    !(
                        node instanceof HTMLElement &&
                        node.hasAttribute('data-no-export')
                    ),
                backgroundColor: document.documentElement.classList.contains(
                    'dark'
                )
                    ? '#1b1b1f'
                    : '#ffffff'
            });
            if (!blob) return;

            if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
            } else {
                // Fallback: download the image
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'parity-cell.png';
                a.click();
                URL.revokeObjectURL(url);
            }

            copiedKey.value = key;
            setTimeout(() => {
                copiedKey.value = null;
            }, 2000);
        } catch {
            // Silent fail — nothing to show
        }
    }

    return { copyAsImage, copiedKey };
}
