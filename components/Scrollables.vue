<template>
  <div class="flex items-center">
    <slot name="backward" :arrivedState>
      <div
        :class="{
          hidden: arrivedState.left,
        }"
        class="transition-all pr-2"
      >
        <UButton
          class="rounded-full"
          variant="ghost"
          icon="i-lucide-chevron-left"
          @click="x -= 100"
        ></UButton>
      </div>
    </slot>
    <div class="grid grow">
      <div
        class="flex items-center truncate zero-size-horizontal-scrollbar"
        v-if="items"
        ref="scrollContainerRef"
      >
        <slot v-for="(item, index) in props.items" :item :index></slot>
      </div>
    </div>
    <slot name="forward" :arrivedState>
      <div
        :class="{
          hidden: arrivedState.right,
        }"
        class="transition-all pl-2"
      >
        <UButton
          class="rounded-full"
          variant="ghost"
          icon="i-lucide-chevron-right"
          @click="x += 100"
        ></UButton>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
  items?: T[] | null;
}>();
const scrollContainerRef = useTemplateRef("scrollContainerRef");
const { x, arrivedState } = useScroll(scrollContainerRef, {
  behavior: "smooth",
});
</script>
