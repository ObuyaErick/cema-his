<template>
  <div class="flex flex-col zero-size-vertical-scrollbar grow">
    <UNavigationMenu
      orientation="vertical"
      arrow
      color="primary"
      variant="pill"
      :items="
        authStore.role === 'doctor' ? navigationItems : [navigationItems[0], []]
      "
    >
    </UNavigationMenu>

    <UButton
      :disabled="!authStore.authClientId"
      v-if="authStore.role === 'client'"
      :to="`/clients/${authStore.authClientId}/profile`"
      size="lg"
      variant="outline"
      class="shadow mx-1"
      icon="i-lucide-book-user"
      >My Profile</UButton
    >
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
          @click="logout"
          >Logout</UButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { LOGOUT_ACTION_KEY } from "~/shared/utils/keys";

const authStore = useAuthStore();

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
      label: "Users",
      description: "Users",
      icon: "i-lucide-users",
      to: "/users",
      onSelect: () => {
        emit("select");
      },
    },
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
      description: "Clients",
      icon: "i-lucide-user",
      to: "/clients",
      onSelect: () => {
        emit("select");
      },
    },
  ],
  [],
]);

const logout = inject<() => void>(LOGOUT_ACTION_KEY);
</script>
