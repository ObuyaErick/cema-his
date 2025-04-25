<template>
  <footer class="px-4 py-2 border-t border-(--ui-border-accented)">
    <div class="flex flex-col sm:flex-row justify-between items-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        &copy; {{ new Date().getFullYear() }} CEMA-HIS. All rights reserved.
      </p>
      <div class="flex gap-4">
        <UButton
          variant="link"
          class="text-sm text-gray-500 dark:text-gray-400 p-0"
        >
          Privacy Policy
        </UButton>
        <UButton
          variant="link"
          class="text-sm text-gray-500 dark:text-gray-400 p-0"
        >
          Terms of Service
        </UButton>
      </div>
    </div>
  </footer>
</template>
