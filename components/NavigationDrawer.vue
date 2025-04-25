<template>
  <div class="flex flex-col zero-size-vertical-scrollbar grow">
    <UNavigationMenu
      orientation="vertical"
      arrow
      color="primary"
      variant="pill"
      :items="navigationItems"
    >
    </UNavigationMenu>
    <div class="grow flex flex-col justify-end">
      <div class="flex gap-2 items-center">
        <ThemeSwitcher></ThemeSwitcher>
        <UButton
          title="Logout"
          size="lg"
          class="rounded-full"
          icon="i-lucide-log-out"
          variant="soft"
          color="neutral"
        ></UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const emit = defineEmits<{
  (e: "select"): void;
}>();
const navigationItems = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Home",
      icon: "i-lucide-home",
      to: "/",
      onSelect: () => {
        emit("select");
      },
    },
  ],
  [
    {
      label: "Programs",
      description: "Health Programs",
      icon: "i-lucide-package",
      to: "/programs",
      onSelect: () => {
        emit("select");
      },
    },
    {
      label: "Clients",
      description: "View Clients",
      icon: "i-lucide-user",
      to: "/clients",
      onSelect: () => {
        emit("select");
      },
    },
  ],
]);
</script>
