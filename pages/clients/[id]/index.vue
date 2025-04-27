<template>
  <div>
    <RestrictedContent
      :unless="authStore.role === 'doctor'"
      :ui="{
        fallback:
          'w-full border px-6 py-8 mx-auto border-(--ui-border-accented) rounded-lg space-y-4',
      }"
    >
      <ClientDetails></ClientDetails>
    </RestrictedContent>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
definePageMeta({
  layout: "main",
});
</script>
