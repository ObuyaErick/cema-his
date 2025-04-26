<template>
  <div class="pb-8">
    <!-- Loading state -->
    <div v-if="status === 'pending'" class="pb-8">
      <ClientDetailsSkeleton />
    </div>

    <!-- Error state -->
    <UAlert
      title="Failed to load client details"
      v-else-if="error"
      color="error"
      class="mb-4"
    >
      <p>{{ error.message }}</p>
    </UAlert>

    <template v-else-if="client">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold">
            {{ client?.firstName }} {{ client?.lastName }}
          </h1>
          <p class="text-gray-500">{{ client?.email }}</p>
        </div>
        <div class="flex gap-2">
          <UButton
            icon="i-lucide-edit"
            color="neutral"
            variant="outline"
            @click="openEditModal"
          >
            Edit
          </UButton>
          <UButton
            icon="i-lucide-trash-2"
            color="neutral"
            variant="outline"
            @click="confirmDelete"
          >
            Delete
          </UButton>
        </div>
      </div>

      <MasonryWall :gap="20" :items="[0, 1, 2]">
        <template #default="props">
          <UCard v-if="props?.item === 0" class="light:bg-white light:shadow">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon size="20" name="i-lucide-user"></UIcon>
                <h2 class="text-lg font-medium">Personal Information</h2>
              </div>
            </template>

            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Gender</p>
                  <p>{{ client.gender || "Not specified" }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Date of Birth</p>
                  <p>
                    {{
                      client.dateOfBirth
                        ? new Date(client.dateOfBirth).toDateString()
                        : "Not specified"
                    }}
                  </p>
                </div>
              </div>

              <div>
                <p class="text-sm text-gray-500">Address</p>
                <p>{{ client.address || "Not specified" }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-500">Phone</p>
                <p>{{ client.contactNumber || "Not specified" }}</p>
              </div>
            </div>
          </UCard>

          <UCard v-if="props?.item === 1" class="light:bg-white light:shadow">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-clipboard"></UIcon>
                <h2 class="text-lg font-medium">Program Enrollments</h2>
              </div>
            </template>

            <div
              v-if="client.programs && client.programs.length > 0"
              class="space-y-4"
            >
              <div class="flex flex-wrap gap-2">
                <UAlert
                  v-for="program in client.programs"
                  variant="outline"
                  icon="i-lucide-box"
                  :title="program.name"
                >
                  <template #description>
                    <div>{{ program.description }}</div>
                    <div class="mt-2">
                      <UBadge color="neutral" variant="soft"
                        >Enrolled:
                        {{ new Date(program.createdAt).toDateString() }}</UBadge
                      >
                    </div>
                  </template>
                </UAlert>
              </div>

              <UButton
                icon="i-lucide-plus"
                color="primary"
                @click="openEnrollmentModal"
                class="shadow shadow-black/70"
              >
                Add Program
              </UButton>
            </div>
            <div v-else class="text-center py-4">
              <p class="text-gray-500 mb-4">No programs enrolled</p>
              <UButton
                icon="i-lucide-plus"
                color="primary"
                @click="openEnrollmentModal"
                class="shadow shadow-black/70"
              >
                Add Program
              </UButton>
            </div>
          </UCard>

          <UCard v-if="props?.item === 2" class="light:bg-white light:shadow">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-text"></UIcon>
                  <h2 class="text-lg font-medium">Notes</h2>
                </div>
                <UButton
                  size="sm"
                  icon="i-lucide-plus"
                  variant="ghost"
                  @click="openAddNoteModal"
                >
                  Add Note
                </UButton>
              </div>
            </template>

            <div
              v-if="client.notes && client.notes.length > 0"
              class="space-y-4"
            >
              <div
                v-for="note in client.notes"
                :key="note.id"
                class="border-b border-gray-200 pb-4 last:border-0"
              >
                <div class="flex justify-between">
                  <p class="font-medium">{{ note.title }}</p>
                  <p class="text-sm text-gray-500">
                    {{ new Date(note.createdAt).toDateString() }}
                  </p>
                </div>
                <p class="mt-2">{{ note.content }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-gray-500">No notes available</p>
            </div>
          </UCard>

          <!-- Enrollment Information -->
          <!-- <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <div class="i-lucide-clipboard-list text-lg" />
            <h2 class="text-lg font-medium">Program Enrollments</h2>
          </div>
        </template>

        <div
          v-if="client.programs && client.programs.length > 0"
          class="space-y-4"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="program in client.programs"
              :key="program.id"
              color="primary"
              variant="soft"
            >
              {{ program.name }}
            </UBadge>
          </div>

          <UButton size="sm" color="primary" @click="openEnrollmentModal">
            <div class="i-lucide-plus mr-1" />
            Add Program
          </UButton>
        </div>
        <div v-else class="text-center py-4">
          <p class="text-gray-500 mb-4">No programs enrolled</p>
          <UButton size="sm" color="primary" @click="openEnrollmentModal">
            <div class="i-lucide-plus mr-1" />
            Add Program
          </UButton>
        </div>
      </UCard> -->

          <!-- Notes Section -->
          <!-- <UCard class="md:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="i-lucide-file-text text-lg" />
              <h2 class="text-lg font-medium">Notes</h2>
            </div>
            <UButton
              size="sm"
              icon="i-lucide-plus"
              color="gray"
              variant="ghost"
              @click="openAddNoteModal"
            >
              Add Note
            </UButton>
          </div>
        </template>

        <div v-if="client.notes && client.notes.length > 0" class="space-y-4">
          <div
            v-for="note in client.notes"
            :key="note.id"
            class="border-b border-gray-200 pb-4 last:border-0"
          >
            <div class="flex justify-between">
              <p class="font-medium">{{ note.title }}</p>
              <p class="text-sm text-gray-500">
                {{ formatDate(note.createdAt) }}
              </p>
            </div>
            <p class="mt-2">{{ note.content }}</p>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500">No notes available</p>
        </div>
      </UCard> -->
        </template>
      </MasonryWall>
    </template>

    <!-- <div>
      <UModal v-model="showDeleteModal">
        <UButton>Delete Client</UButton>
        <template #content>
          <UCard>
            <template #header>
              <div class="text-lg font-medium">Delete Client</div>
            </template>
            <p>
              Are you sure you want to delete this client? This action cannot be
              undone.
            </p>
            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton variant="outline" @click="showDeleteModal = false"
                  >Cancel</UButton
                >
                <UButton
                  color="error"
                  @click="deleteClient"
                  :loading="isDeleting"
                  >Delete</UButton
                >
              </div>
            </template>
          </UCard>
        </template>
      </UModal>

      <UModal v-model="showEditModal">
        <UButton>Edit</UButton>
        <template #content>
          <UCard>
            <template #header>
              <div class="text-lg font-medium">Edit Client</div>
            </template>
            <ClientForm
              v-if="showEditModal"
              :client="client"
              @submit="updateClient"
              @cancel="showEditModal = false"
            />
          </UCard>
        </template>
      </UModal>

      <UModal v-model="showEnrollmentModal">
        <UButton>Add Program</UButton>
        <template #content>
          <UCard>
            <ProgramEnrollmentForm
              v-if="showEnrollmentModal"
              :clientId="clientId"
              @submit="addEnrollment"
              @cancel="showEnrollmentModal = false"
            />
          </UCard>
        </template>
      </UModal>

      <UModal v-model="showAddNoteModal">
        <UButton>Add Note</UButton>
        <template #content>
          <UCard>
            <NoteForm
              v-if="showAddNoteModal"
              :clientId="clientId"
              @submit="addNote"
              @cancel="showAddNoteModal = false"
            />
          </UCard>
        </template>
      </UModal>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import type { Client, HealthProgram } from "~/generated/prisma";

const route = useRoute();
const clientId = route.params.id as string;

// State for modals
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const showEnrollmentModal = ref(false);
const showAddNoteModal = ref(false);
const isDeleting = ref(false);
const isUpdating = ref(false);
const isEnrolling = ref(false);
const isAddingNote = ref(false);

// Using useFetch for client data
const {
  data: client,
  status,
  error,
  refresh,
} = useFetch<Client & { programs: HealthProgram[] }>(
  `/api/clients/${clientId}`,
  {
    key: `client-${clientId}`,
    default: () => null,
  }
);

// Actions
function confirmDelete() {
  showDeleteModal.value = true;
}

function openEditModal() {
  showEditModal.value = true;
}

function openEnrollmentModal() {
  showEnrollmentModal.value = true;
}

function openAddNoteModal() {
  showAddNoteModal.value = true;
}

async function deleteClient() {
  isDeleting.value = true;

  try {
    await useFetch(`/api/clients/${clientId}`, {
      method: "DELETE",
    });
    showDeleteModal.value = false;
    // Navigate back to clients list
    navigateTo("/clients");
  } catch (err) {
    console.error("Failed to delete client:", err);
  } finally {
    isDeleting.value = false;
  }
}

async function updateClient(updatedClient: any) {
  isUpdating.value = true;

  try {
    await useFetch(`/api/clients/${clientId}`, {
      method: "PUT",
      body: updatedClient,
    });
    showEditModal.value = false;
    refresh();
  } catch (err) {
    console.error("Failed to update client:", err);
  } finally {
    isUpdating.value = false;
  }
}

async function addEnrollment(enrollmentData: any) {
  isEnrolling.value = true;

  try {
    await useFetch(`/api/clients/${clientId}/enroll`, {
      method: "POST",
      body: enrollmentData,
    });
    showEnrollmentModal.value = false;
    refresh();
  } catch (err) {
    console.error("Failed to add enrollment:", err);
  } finally {
    isEnrolling.value = false;
  }
}

async function addNote(noteData: any) {
  isAddingNote.value = true;

  try {
    await useFetch(`/api/clients/${clientId}/notes`, {
      method: "POST",
      body: noteData,
    });
    showAddNoteModal.value = false;
    refresh();
  } catch (err) {
    console.error("Failed to add note:", err);
  } finally {
    isAddingNote.value = false;
  }
}
</script>
