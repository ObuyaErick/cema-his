<template>
  <NuxtRouteAnnouncer />
  <UApp
    :toaster="{
      duration: 5000,
      position: 'top-center',
      expand: false,
    }"
    ><div data-vaul-drawer-wrapper>
      <div
        v-if="appStore.busy"
        class="fixed inset-0 z-[9999] light:bg-white/10 dark:bg-black/10 backdrop-blur flex items-center justify-center"
      >
        <div class="h-10 w-10 border-x-4 rounded-full animate-spin"></div>
      </div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { LOGOUT_ACTION_KEY } from "~/shared/utils/keys";

const appStore = useAppStore();
const authStore = useAuthStore();

const logout = () => {
  appStore.setBusy(true);

  authStore
    .logout()
    .then((res) => {
      useToast().add({
        color: res.status,
        title: res.status === "success" ? "Success" : "Failed",
        description: res.message,
      });
    })
    .finally(() => appStore.setBusy(false));
};

provide(LOGOUT_ACTION_KEY, logout);
</script>
