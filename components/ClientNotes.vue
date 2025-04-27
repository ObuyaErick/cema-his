<template>
  <div>
    <Scrollables :items="notes">
      <template #default="{ item: note }">
        <UButton
          class="mx-1"
          @click="() => activateTab(note.programId)"
          :color="activeTab === note.programId ? 'primary' : 'neutral'"
          :variant="activeTab === note.programId ? 'solid' : 'outline'"
          >{{ note.programName }}</UButton
        >
      </template>
    </Scrollables>

    <RestrictedContent
      :unless="authStore.role === 'doctor' || authStore.userId === clientUserId"
      :ui="{
        fallback:
          'w-full border px-6 py-8 mx-auto border-(--ui-border-accented) rounded-lg space-y-4',
      }"
    >
      <template #fallback>
        <UAlert
          color="warning"
          variant="outline"
          class="shadow mt-3"
          icon="i-lucide-triangle-alert"
          title="403 Forbidden Access"
        >
          <template #description
            >Only doctors and this very client can view doctor's
            notes.</template
          >
        </UAlert>
      </template>
      <div>
        <div
          v-if="activeNotes?.notes && activeNotes.notes.length > 0"
          class="space-y-4 mt-2"
        >
          <ProgramNote
            :client-id="props.clientId"
            :program-id="activeNotes.programId"
            v-for="note in activeNotes.notes"
            :note="note"
            @deleted="emit('added')"
            @updated="emit('added')"
            :editable="authStore.role === 'doctor'"
          />
        </div>
        <div v-else class="py-8">
          <p class="text-gray-500">No notes available</p>
        </div>
      </div>
    </RestrictedContent>

    <UModal
      v-if="authStore.role === 'doctor'"
      v-model:open="createNoteModalOpen"
      title="Client Notes"
      description="Doctor's notes"
      aria-describedby="Client Notes Modal"
      close
      :overlay="false"
    >
      <UButton
        icon="i-lucide-plus"
        color="primary"
        class="shadow shadow-black/70"
      >
        Add Notes
      </UButton>

      <template #body>
        <UBadge variant="outline" color="neutral">{{
          activeNotes?.programName
        }}</UBadge>

        <USeparator class="my-2"></USeparator>

        <NoteForm
          :client-id="clientId"
          :program-id="activeTab"
          @cancelling="createNoteModalOpen = false"
          @done="
            () => {
              createNoteModalOpen = false;
              emit('added');
            }
          "
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { UIClientNotes } from "~/shared/types/clients.types";

const authStore = useAuthStore();

const emit = defineEmits(["added"]);

const props = defineProps<{
  notes: UIClientNotes[];
  clientId: string;
  clientUserId: string;
}>();

const createNoteModalOpen = ref(false);

const activeTab = ref<string>("");

const activateTab = (tab?: string) => {
  activeTab.value = tab ?? "";
};

const activeNotes = computed(() =>
  props.notes.find((n) => n.programId === activeTab.value)
);

onMounted(() => {
  activeTab.value = props.notes[0]?.programId ?? "";
});
</script>
