<template>
  <picture>
    <template v-for="(srcset, key) in sources">
      <source
        v-for="(src, index) of srcset"
        :key="`${key}-${index}`"
        :srcset="src"
        :media="getMediaQuery(key)"
        :type="getType(src)"
      />
    </template>
    <img :src="getFallbackImg(sources)" :alt />
  </picture>
</template>

<script setup lang="ts">
  const { sources, alt = '' } = defineProps<{
    sources: { sm?: string[]; lg?: string[] };
    alt?: string;
  }>();

  function getType(src: string) {
    let type: RegExpMatchArray | string | null = src.match(/(?=.)\w+$/);
    type = type ? type[0] : null;
    return type ? `image/${type}` : undefined;
  }

  function getFallbackImg(srcObj: typeof sources) {
    const srcs = srcObj.lg || srcObj.sm;
    return srcs ? srcs.find((src: string) => src.match(new RegExp('\.(jpg|png)$'))) : undefined;
  }

  function getMediaQuery(mqString: 'lg' | 'sm'): string {
    if (mqString === 'lg') return '(min-width: 728px)';
    return '(max-width: 727px)';
  }
</script>
