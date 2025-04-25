<template>
  <div @click="open = !open" class="flex items-center justify-center">
    <div class="relative flex flex-col min-w-4 min-h-4 justify-center grow">
      <span
        class="transition-all duration-500 h-0.5 bg-neutral-900 dark:bg-neutral-100 absolute rounded-full w-full"
        :class="{
          '-translate-y-[300%]': !open,
          'translate-y-0 -rotate-45': open,
        }"
      ></span>
      <span
        class="transition-all duration-500 h-0.5 bg-neutral-900 dark:bg-neutral-100 absolute rounded-full"
        :class="{
          'left-0 w-2/3': !open,
          'left-4 w-0': open,
        }"
      ></span>
      <span
        class="transition-all duration-500 h-0.5 bg-neutral-900 dark:bg-neutral-100 absolute rounded-full"
        :class="{
          'w-1/3 translate-y-[300%]': !open,
          'translate-y-0 w-full rotate-45': open,
        }"
      ></span>
    </div>
  </div>
</template>
<script lang="ts" setup>
const open = defineModel<boolean>("open", { default: false });
</script>
