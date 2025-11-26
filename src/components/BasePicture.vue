<template>
  <picture>
    <template v-for="(srcset, key) in sources">
      <template v-if="Array.isArray(srcset)">
        <source
          v-for="(src, index) of srcset"
          :key="`${key}-${index}`"
          :src="src"
          :media="getMediaQuery(key)"
          :type="getType(src)"
        />
      </template>
      <source v-else :src="`https://res.cloudinary.com/dmez1qk98/image/upload/q_65,f_webp,dpr_auto/${srcset}`" :key="key" :media="getMediaQuery(key)" :type="getType(srcset || '')" />
    </template>
    <img :src="`https://res.cloudinary.com/dmez1qk98/image/upload/q_65,f_webp,dpr_auto/${sources.lg}`" :alt :loading />
  </picture>
</template>

<script setup lang="ts">
  const { sources, alt = '', loading = 'lazy' } = defineProps<{
    sources: { sm?: string; lg?: string };
    alt?: string;
    loading?: 'lazy' | 'eager';
  }>();

  function getType(src: string) {
    let type: RegExpMatchArray | string | null = src.match(/(?<=\.)\w+$/);
    type = type ? type[0] : null;
    return type ? `image/${type}` : undefined;
  }

  function getMediaQuery(mqString: 'lg' | 'sm'): string {
    if (mqString === 'lg') return '(min-width: 728px)';
    return '(max-width: 727px)';
  }
</script>
