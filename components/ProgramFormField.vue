<template>
  <UFormField name="programIds" label="Programs">
    <USelectMenu
      :search-input="{
        placeholder: 'Search programs...',
        icon: 'i-lucide-search',
      }"
      class="w-full"
      v-model:search-term="programSearchQuery"
      v-model="programIds"
      :items="
        programs?.data.map((prog) => ({
          label: prog.name,
          id: prog.id,
        })) ?? []
      "
      multiple
      placeholder="Select programs"
    >
    </USelectMenu>
  </UFormField>
</template>

<script setup lang="ts">
const programIds = defineModel<{ label: string; id: string }[]>();

const programSearchQuery = ref("");

const { data: programs, status } = useFetch("/api/health-programs", {
  query: {
    search: programSearchQuery,
  },
});
</script>
