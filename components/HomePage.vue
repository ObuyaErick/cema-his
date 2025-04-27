<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold">CEMA-HIS</h1>
        <UBadge v-if="authStore.role" :color="roleBadgeColor">
          {{ authStore.role }}
        </UBadge>
      </div>

      <p class="mb-4">
        Welcome to the CEMA HIS dashboard,
        <span class="font-bold">{{ authStore.name || "" }}</span
        >!
      </p>

      <!-- Role-specific welcome message -->
      <template v-if="authStore.role === 'doctor'">
        <p class="mb-4">Manage your client records efficiently.</p>
      </template>
      <template v-else-if="authStore.role === 'client'">
        <p class="mb-4">Track your health records in one place.</p>
      </template>
      <template v-else>
        <UAlert icon="i-lucide-triangle-alert" color="warning" class="mb-4">
          Please log in to access your personalized dashboard.
        </UAlert>
      </template>
    </div>

    <!-- Quick Actions Section -->
    <div v-if="authStore.role">
      <div class="">
        <!-- doctor-specific actions -->
        <div v-if="authStore.role === 'doctor'" class="space-x-4">
          <UButton
            size="lg"
            class="shadow shadow-black/40"
            color="primary"
            to="/clients"
          >
            Manage Clients
          </UButton>
          <UButton
            size="lg"
            class="shadow shadow-black/40"
            color="primary"
            to="/users"
          >
            Manage Users
          </UButton>
          <UButton
            size="lg"
            class="shadow shadow-black/40"
            color="primary"
            to="/programs"
          >
            Manage Programs
          </UButton>
        </div>

        <!-- client-specific actions -->
        <div v-if="authStore.role === 'client'" class="">
          <UButton
            :disabled="!authStore.authClientId"
            size="lg"
            class="shadow shadow-black/40"
            color="primary"
            :to="`/clients/${authStore.authClientId}/profile`"
          >
            Got To Profile
          </UButton>
          <div v-if="!authStore.authClientId">
            Your profile has not been activated yet. Check later.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();

const roleBadgeColor = computed(() => {
  switch (authStore.role) {
    case "doctor":
      return "info";
    case "client":
      return "success";
    default:
      return "neutral";
  }
});
</script>
