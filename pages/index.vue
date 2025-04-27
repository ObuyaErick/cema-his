<template>
  <RestrictedContent :unless="authStore.loggedIn">
    <template #fallback>
      <div
        class="w-full max-w-lg border px-6 py-8 mx-auto border-(--ui-border-accented) rounded-lg my-auto space-y-4"
      >
        <h3>Welcome</h3>
        <div>You are not logged in.</div>

        <div class="flex gap-4">
          <UButton to="/login" class="shadow px-6 shadow-black/40"
            >Login</UButton
          >

          <UButton
            variant="outline"
            to="/register"
            class="shadow px-6 shadow-black/40"
            >Sign Up</UButton
          >
        </div>
      </div>
    </template>
    <div><HomePage /></div>
  </RestrictedContent>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
definePageMeta({
  layout: "main",
});
</script>
