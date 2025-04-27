<template>
  <div class="space-y-4">
    <!-- Program Selection -->
    <ProgramFormField v-model="programIds" />

    <!-- Submit and Cancel buttons -->
    <div class="flex justify-end gap-2 pt-4">
      <UButton
        class="shadow shadow-black/70"
        type="button"
        variant="outline"
        @click="emit('cancel')"
        >Cancel</UButton
      >
      <UButton
        @click="onSubmit"
        class="shadow shadow-black/70 w-20 justify-center"
        type="button"
        color="primary"
        :loading="isSubmitting"
        >Enroll</UButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  clientId: string;
}>();

const emit = defineEmits(["done", "cancel"]);

const isSubmitting = ref(false);

const programIds = ref<{ label: string; id: string }[]>([]);

// Submit form
async function onSubmit() {
  if (!programIds.value?.length) {
    useToast().add({
      title: "Error",
      color: "warning",
      description: "Please select at least one program",
    });
    return;
  }
  isSubmitting.value = true;
  $fetch(`/api/clients/${props.clientId}/programs/enroll`, {
    method: "POST",
    body: {
      programIds: programIds.value.map((p) => p.id),
    },
  })
    .then((res) => {
      useToast().add({
        title: "Success",
        description: res.message || "Client enrolled successfully",
        color: "success",
      });
      programIds.value = [];
      emit("done");
    })
    .catch((error) => {
      useToast().add({
        title: "Failed",
        color: "error",
        description:
          error?.response?._data?.message ||
          error.message ||
          "Failed to enroll client to selected programs",
      });
    })
    .finally(() => {
      isSubmitting.value = false;
    });
}
</script>
