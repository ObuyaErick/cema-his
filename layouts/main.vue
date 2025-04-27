<template>
  <div class="flex gap-3 p-3 fixed inset-0 vertical-scrollbar">
    <template v-if="authStore.loggedIn">
      <div class="min-w-[10rem] hidden lg:flex sticky top-0 flex-col">
        <AppLogo class="mb-3" />
        <USeparator></USeparator>
        <NavigationDrawer class="mt-2" />
      </div>
      <USlideover
        aria-describedby="NavigationDrawer"
        :overlay="false"
        class="lg:hidden rounded-l-lg"
        v-model:open="sideNavOpen"
        close
        :ui="{
          body: 'flex flex-col vertical-scrollbar',
        }"
      >
        <template #title>
          <AppLogo />
        </template>
        <template #description>
          <USeparator></USeparator>
        </template>
        <template #body>
          <div class="flex grow">
            <NavigationDrawer @select="() => (sideNavOpen = false)" />
          </div>
        </template>
      </USlideover>
    </template>

    <div class="flex flex-col grow gap-3">
      <div v-if="authStore.loggedIn" class="flex gap-3 items-center">
        <UButton class="p-1.5 lg:hidden" color="neutral" variant="subtle">
          <AnimatedMenu
            v-model:open="sideNavOpen"
            class="w-6 py-1"
          ></AnimatedMenu>
        </UButton>

        <div class="grow flex justify-end">
          <UAvatar
            class="bg-(--ui-bg-inverted)"
            :src="authStore.name || ''"
            :alt="authStore?.name ?? ''"
          ></UAvatar>
        </div>
      </div>
      <div class="flex flex-col grow">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const appStore = useAppStore();
const sideNavOpen = ref(false);

onMounted(async () => {
  appStore.setBusy(true);
  await authStore.fetchSession().catch((error) => {
    console.log(error);
  });
  appStore.setBusy(false);
});
</script>
