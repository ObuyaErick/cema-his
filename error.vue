<template>
  <div class="flex items-center justify-center min-h-screen py-20">
    <UCard class="max-w-md w-full mx-auto">
      <template #header>
        <div class="text-center">
          <div class="mb-2">
            <UIcon
              v-if="error?.statusCode === 404"
              name="i-lucide-circle-help"
              class="text-amber-500 h-12 w-12 mx-auto"
            />
            <UIcon
              v-else-if="error?.statusCode === 401"
              name="i-lucide-shield-alert"
              class="text-red-500 h-12 w-12 mx-auto"
            />
            <UIcon
              v-else-if="error?.statusCode === 403"
              name="i-lucide-shield-x"
              class="text-red-500 h-12 w-12 mx-auto"
            />
            <UIcon
              v-else
              name="i-lucide-triangle-alert"
              class="text-red-500 h-12 w-12 mx-auto"
            />
          </div>
          <h3 class="text-lg font-semibold">{{ title }}</h3>
        </div>
      </template>

      <div class="py-4 text-center">
        <p class="text-gray-500">{{ message }}</p>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <UButton color="primary" @click="handleError" icon="i-lucide-home">
            Go to Home
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object,
});

const title = computed(() => {
  if (props.error?.statusCode === 404) return "404 - Page not found";
  if (props.error?.statusCode === 401) return "401 - Unauthorized";
  if (props.error?.statusCode === 403) return "403 - Forbidden";
  return "Oops! Something went wrong";
});

const message = computed(() => {
  if (props.error?.statusCode === 404)
    return "The page you are looking for does not exist.";
  if (props.error?.statusCode === 401)
    return "You need to be logged in to access this page.";
  if (props.error?.statusCode === 403)
    return "You do not have permission to access this resource.";
  return (
    props.error?.message ||
    "An unexpected error occurred. Please try again later."
  );
});

const handleError = () => {
  // Clear the error and navigate to the home page
  clearError();
  navigateTo("/");
};
</script>
