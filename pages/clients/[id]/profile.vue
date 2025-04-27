<template>
  <div class="">
    <div class="container mx-auto mb-2 flex justify-between items-center">
      <UNavigationMenu
        :items="[
          {
            label: 'Home',
            icon: 'i-lucide-home',
            to: '/',
          },
        ]"
      >
      </UNavigationMenu>

      <div class="space-x-4">
        <ThemeSwitcher></ThemeSwitcher>
        <UButton
          v-if="authStore.loggedIn"
          @click="logout"
          trailing-icon="i-lucide-log-out"
          class="shadow shadow-black/40"
          >Logout</UButton
        >
        <UButton
          v-else
          to="/login"
          trailing-icon="i-lucide-log-out"
          class="shadow shadow-black/40"
          >Login</UButton
        >
      </div>
    </div>

    <ClientProfile class="container mx-auto mb-8" />
  </div>
</template>

<script setup lang="ts">
import { UButton } from "#components";
import ThemeSwitcher from "~/components/ThemeSwitcher.vue";
import { LOGOUT_ACTION_KEY } from "~/shared/utils/keys";

const authStore = useAuthStore();
const logout = inject<() => void>(LOGOUT_ACTION_KEY);

definePageMeta({
  layout: "client",
});
</script>
