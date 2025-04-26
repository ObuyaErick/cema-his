<template>
  <div class="space-y-6">
    <UForm
      :schema="programRegistrationSchema"
      :state="formState"
      @submit="onSubmit"
      class="space-y-4"
    >
      <UFormField required label="Program Name" name="name">
        <UInput
          class="w-full"
          v-model="formState.name"
          placeholder="Enter program name"
        />
      </UFormField>

      <UFormField required label="Description" name="description">
        <UTextarea
          class="w-full"
          v-model="formState.description"
          placeholder="Enter program description"
          :rows="5"
        />
      </UFormField>

      <div class="flex justify-end gap-2 pt-4">
        <UButton
          type="button"
          color="neutral"
          variant="outline"
          @click="cancelForm"
        >
          Cancel
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          Save Program
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  programRegistrationSchema,
  type ProgramRegistrationSchema,
} from "~/shared/types/programs.types";

const emit = defineEmits(["cancelling", "done"]);
const submitting = ref(false);
const formState = ref<Partial<ProgramRegistrationSchema>>({
  name: "",
  description: "",
});

const onSubmit = async (event: FormSubmitEvent<ProgramRegistrationSchema>) => {
  submitting.value = true;
  await $fetch("/api/health-programs", {
    method: "POST",
    body: event.data,
  })
    .then((res) => {
      useToast().add({
        title: "Success",
        description: res.message || "Health program created successfully",
        color: "success",
      });
      emit("done");
      formState.value = { name: "", description: "" };
    })
    .catch((error) => {
      useToast().add({
        title: "Error",
        description:
          error?.response?._data?.message ||
          error.message ||
          "Failed to create health program",
        color: "error",
      });
    })
    .finally(() => {
      submitting.value = false;
    });
};

const cancelForm = () => {
  emit("cancelling");
};
</script>
