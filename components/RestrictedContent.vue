<template>
  <template v-if="typeof unless === 'function' ? unless() : unless">
    <div :class="ui?.root">
      <slot name="default"></slot>
    </div>
  </template>
  <template v-else>
    <slot name="fallback">
      <div :class="ui?.fallback">
        <div>
          <span class="uppercase">Restricted content</span>
        </div>

        <div class="text-high-emphasis py-2">
          Sorry! You do not have sufficient privileges to view this content.
        </div>

        <div class="flex gap-4">
          <UButton
            @click="$router.back()"
            variant="outline"
            class="shadow shadow-black/40"
            icon="i-lucide-move-left"
            >Go Back</UButton
          >
          <slot name="mitigation">
            <UButton
              to="/"
              color="success"
              class="shadow shadow-black/40"
              prepend-icon="mdi-home-outline"
              >Take Me Home</UButton
            >
          </slot>
        </div>
      </div>
    </slot>
  </template>
</template>
<script setup lang="ts">
defineProps<{
  ui?: { fallback?: string; root?: string };
  unless: boolean | (() => boolean);
}>();
</script>
