<template>
  <div class="border-b border-(--ui-border-accented) pb-4 last:border-0">
    <p class="font-bold">{{ note.title }}</p>
    <p class="text-sm">
      <span>{{ note.content }}</span
      ><span v-if="editable" class="float-right"
        ><UModal
          title="Edit Note"
          description="editting"
          aria-describedby="Edit Note"
          close
          :overlay="false"
          v-model:open="editModalOpen"
        >
          <UButton icon="i-lucide-edit" color="neutral" variant="outline">
          </UButton>
          <template #body>
            <NoteForm
              :initial="{ title: note.title, content: note.content }"
              :client-id="clientId"
              :program-id="programId"
              :note-id="note.id"
              mode="edit"
              @cancelling="editModalOpen = false"
              @done="emit('updated')"
            />
          </template>
        </UModal>
        <UModal
          title="Delete Note"
          description="deleting"
          aria-describedby="Delete Note"
          close
          :overlay="false"
          v-model:open="deleteModalOpen"
        >
          <UButton
            class="ml-2"
            icon="i-lucide-trash"
            color="neutral"
            variant="outline"
          >
          </UButton>
          <template #body>
            <p>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </p>
          </template>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                class="shadow shadow-black/70"
                variant="outline"
                @click="deleteModalOpen = false"
                >Cancel</UButton
              >
              <UButton
                class="shadow shadow-black/70"
                color="error"
                @click="deleteNote"
                :loading="isDeleting"
                >Yes Delete</UButton
              >
            </div>
          </template>
        </UModal>
      </span>
    </p>
    <span class="text-xs text-gray-500 font-bold">
      {{ new Date(note.createdAt).toDateString() }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Note } from "~/generated/prisma";

const emit = defineEmits(["deleted", "updated"]);

const props = defineProps<{
  clientId: string;
  programId: string;
  note: Note;
  editable?: boolean;
}>();

const isDeleting = ref(false);
const deleteNote = async () => {
  isDeleting.value = true;

  await $fetch(`/api/notes/${props.note.id}`, {
    method: "DELETE",
  })
    .then((res) => {
      useToast().add({
        title: "Success",
        description: res.message || "Note deleted successfully",
        color: "success",
      });
      emit("deleted");
    })
    .catch((error) => {
      useToast().add({
        title: "Error",
        description:
          error?.response?._data?.message ||
          error.message ||
          "Failed to delete note",
        color: "error",
      });
    })
    .finally(() => {
      isDeleting.value = false;
    });
};

const editModalOpen = ref(false);
const deleteModalOpen = ref(false);
</script>
