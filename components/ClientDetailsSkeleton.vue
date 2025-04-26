<template>
  <div class="client-details-skeleton">
    <!-- Header skeleton -->
    <div class="flex justify-between items-center mb-6">
      <div class="space-y-2">
        <USkeleton class="light:bg-gray-600 h-8 w-48" />
        <USkeleton class="light:bg-gray-600 h-5 w-32" />
      </div>
      <div class="flex gap-2">
        <USkeleton class="light:bg-gray-600 h-10 w-24" />
        <USkeleton class="light:bg-gray-600 h-10 w-24" />
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <UCard class="border border-gray-600/40">
        <template #header>
          <div class="flex items-center gap-2">
            <USkeleton class="light:bg-gray-600 h-6 w-6 rounded-full" />
            <USkeleton class="light:bg-gray-600 h-6 w-40" />
          </div>
        </template>

        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <USkeleton class="light:bg-gray-600 h-4 w-16 mb-2" />
              <USkeleton class="light:bg-gray-600 h-5 w-24" />
            </div>
            <div>
              <USkeleton class="light:bg-gray-600 h-4 w-24 mb-2" />
              <USkeleton class="light:bg-gray-600 h-5 w-28" />
            </div>
          </div>

          <div>
            <USkeleton class="light:bg-gray-600 h-4 w-16 mb-2" />
            <USkeleton class="light:bg-gray-600 h-5 w-full" />
          </div>

          <div>
            <USkeleton class="light:bg-gray-600 h-4 w-12 mb-2" />
            <USkeleton class="light:bg-gray-600 h-5 w-32" />
          </div>
        </div>
      </UCard>

      <UCard class="border border-gray-600/40">
        <template #header>
          <div class="flex items-center gap-2">
            <USkeleton class="light:bg-gray-600 h-6 w-6 rounded-full" />
            <USkeleton class="light:bg-gray-600 h-6 w-48" />
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <USkeleton class="light:bg-gray-600 h-8 w-24 rounded-full" />
            <USkeleton class="light:bg-gray-600 h-8 w-32 rounded-full" />
            <USkeleton class="light:bg-gray-600 h-8 w-28 rounded-full" />
          </div>

          <USkeleton class="light:bg-gray-600 h-9 w-32" />
        </div>
      </UCard>

      <UCard class="border border-gray-600/40 md:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <USkeleton class="light:bg-gray-600 h-6 w-6 rounded-full" />
              <USkeleton class="light:bg-gray-600 h-6 w-20" />
            </div>
            <USkeleton class="light:bg-gray-600 h-8 w-24" />
          </div>
        </template>

        <div class="space-y-6">
          <div class="border-b border-(--ui-border-accented) pb-4">
            <div class="flex justify-between mb-2">
              <USkeleton class="light:bg-gray-600 h-5 w-40" />
              <USkeleton class="light:bg-gray-600 h-4 w-24" />
            </div>
            <USkeleton class="light:bg-gray-600 h-4 w-full mb-2" />
            <USkeleton class="light:bg-gray-600 h-4 w-3/4" />
          </div>

          <div class="border-b border-(--ui-border-accented) pb-4">
            <div class="flex justify-between mb-2">
              <USkeleton class="light:bg-gray-600 h-5 w-32" />
              <USkeleton class="light:bg-gray-600 h-4 w-24" />
            </div>
            <USkeleton class="light:bg-gray-600 h-4 w-full mb-2" />
            <USkeleton class="light:bg-gray-600 h-4 w-5/6 mb-2" />
            <USkeleton class="light:bg-gray-600 h-4 w-4/5" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
