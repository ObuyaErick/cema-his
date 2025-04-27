<template>
  <div class="space-y-6">
    <UForm
      :schema="createNoteSchema"
      :state="formState"
      @submit="onSubmit"
      class="space-y-4"
    >
      <UFormField required label="Title" name="title">
        <UInput
          class="w-full"
          v-model="formState.title"
          placeholder="Enter title"
        />
      </UFormField>

      <UFormField required label="Content" name="content">
        <UTextarea
          class="w-full"
          v-model="formState.content"
          placeholder="Enter content"
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
          {{ mode === "edit" ? "Save Changes" : "Save Note" }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import {
  createNoteSchema,
  type CreateNoteSchema,
} from "~/shared/types/notes.types";

const props = defineProps<{
  clientId: string;
  programId: string;
  mode?: "edit" | "create";
  initial?: CreateNoteSchema;
  noteId?: string;
}>();

const emit = defineEmits(["cancelling", "done"]);
const submitting = ref(false);
const formState = ref<Partial<CreateNoteSchema>>({
  title: "",
  content: "",
});

const onSubmit = async (event: FormSubmitEvent<CreateNoteSchema>) => {
  submitting.value = true;
  if (props.mode === "edit") {
    await $fetch(`/api/notes/${props.noteId as string}`, {
      method: "PATCH",
      body: event.data,
    })
      .then((res) => {
        useToast().add({
          title: "Success",
          description: res.message || "Changes saved",
          color: "success",
        });
        emit("done");
        formState.value = { title: "", content: "" };
      })
      .catch((error) => {
        useToast().add({
          title: "Error",
          description:
            error?.response?._data?.message ||
            error.message ||
            "Failed to save changes",
          color: "error",
        });
      })
      .finally(() => {
        submitting.value = false;
      });
  } else {
    await $fetch(`/api/clients/${props.clientId}/${props.programId}/notes`, {
      method: "POST",
      body: event.data,
    })
      .then((res) => {
        useToast().add({
          title: "Success",
          description: res.message || "Note added",
          color: "success",
        });
        emit("done");
        formState.value = { title: "", content: "" };
      })
      .catch((error) => {
        useToast().add({
          title: "Error",
          description:
            error?.response?._data?.message ||
            error.message ||
            "Failed to add note",
          color: "error",
        });
      })
      .finally(() => {
        submitting.value = false;
      });
  }
};

const cancelForm = () => {
  emit("cancelling");
};

onMounted(() => {
  if (props.mode === "edit" && props.initial) {
    formState.value = props.initial;
  }
});
</script>
