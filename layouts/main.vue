<script setup lang="ts">
const sideNavOpen = ref(false);
</script>

<template>
  <div class="flex gap-3 p-3 fixed inset-0 vertical-scrollbar">
    <div class="min-w-[12rem] hidden lg:flex sticky top-0 flex-col">
      <AppLogo class="mb-3" />
      <USeparator></USeparator>
      <NavigationDrawer class="mt-2" />
    </div>
    <USlideover
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
      <template #body>
        <div class="flex grow">
          <NavigationDrawer @select="() => (sideNavOpen = false)" />
        </div>
      </template>
    </USlideover>

    <div class="flex flex-col grow gap-3">
      <div class="flex gap-3">
        <UButton class="p-1.5 lg:hidden" color="neutral" variant="subtle">
          <AnimatedMenu
            v-model:open="sideNavOpen"
            class="w-6 py-1"
          ></AnimatedMenu>
        </UButton>

        <div class="grow flex">
          <!-- <UModal>
            <UButton
              leading-icon="i-lucide-search"
              size="lg"
              class="pl-4 justify-start grow max-w-lg"
              variant="subtle"
              color="neutral"
              >Search...
            </UButton>

            <template #content>
              <UCommandPalette></UCommandPalette>
            </template>
          </UModal> -->
        </div>
      </div>
      <div class="flex flex-col grow">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
