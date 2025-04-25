<template>
  <ClientOnly>
    <UDropdownMenu v-model:open="themeDropdownOpen" :items="themeItems">
      <UButton
        class="rounded-full"
        title="Change Theme"
        size="lg"
        variant="soft"
        color="neutral"
      >
        <UIcon
          :name="$colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
        ></UIcon>
        <template #trailing>
          <UIcon
            class="transition-all duration-300"
            :class="{
              '-rotate-180': themeDropdownOpen,
            }"
            name="i-lucide-chevron-down"
          ></UIcon>
        </template>
      </UButton>
      <template #item-trailing="{ item }">
        <UIcon
          name="i-lucide-check"
          v-if="item.label?.toLowerCase() === $colorMode.preference"
        ></UIcon>
      </template>
    </UDropdownMenu>
  </ClientOnly>
</template>
<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const themeDropdownOpen = ref(false);
const colorMode = useColorMode();
const themeItems = shallowRef<DropdownMenuItem[]>([
  {
    label: "System",
    icon: "i-lucide-monitor",
    onSelect: () => {
      colorMode.preference = "system";
    },
  },
  {
    label: "Light",
    icon: "i-lucide-sun",
    onSelect: () => {
      colorMode.preference = "light";
    },
  },
  {
    label: "Dark",
    icon: "i-lucide-moon",
    onSelect: () => {
      colorMode.preference = "dark";
    },
  },
]);
</script>
