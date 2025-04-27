<template>
  <div class="">
    <div class="container mx-auto mb-2">
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
    </div>

    <ClientProfile class="container mx-auto mb-8" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "client",
});
</script>
