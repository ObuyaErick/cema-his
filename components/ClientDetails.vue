<template>
  <div class="pb-8">
    <!-- Loading state -->
    <div v-if="status === 'pending'" class="pb-8">
      <ClientDetailsSkeleton />
    </div>

    <!-- Error state -->
    <UAlert
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="Failed to load client details"
      v-else-if="error"
      color="error"
      class="mb-4 shadow shadow-black/20 p-6"
    >
      <template #description>
        <div>
          <div>An error occured while fetching this client's details.</div>
          <UButton to="/clients" variant="outline" color="neutral"
            >Take Me Clients</UButton
          >
        </div>
      </template>
    </UAlert>

    <template v-else-if="client">
      <div class="mb-4 flex gap-3">
        <UButton
          variant="outline"
          :to="`/clients/${client.id}/profile`"
          class="shadow shadow-black/40"
          icon="i-lucide-scroll-text"
          >View Profile</UButton
        >
        <UButton
          @click="share"
          class="shadow shadow-black/40"
          icon="i-lucide-share-2"
          >Share</UButton
        >
      </div>
      <MasonryWall :gap="20" :items="[0, 1, 2, 3]">
        <template #default="props">
          <UCard v-if="props?.item === 0" class="light:bg-white light:shadow">
            <div class="flex justify-between items-center">
              <div>
                <h1 class="text-2xl font-bold">
                  {{ client?.firstName }} {{ client?.lastName }}
                </h1>
                <p class="text-gray-500">{{ client?.email }}</p>
              </div>
              <div class="flex gap-2">
                <USlideover
                  :ui="{
                    content: 'max-w-lg top-8 mx-auto rounded-t-lg',
                  }"
                  close-icon="i-lucide-chevron-down"
                  side="bottom"
                  :overlay="false"
                  title="Edit Client"
                  description="editting"
                  aria-describedby="Edit Client"
                  close
                  v-model:open="showEditModal"
                  class="max-w-lg"
                >
                  <UButton
                    icon="i-lucide-edit"
                    color="neutral"
                    variant="outline"
                  >
                    Edit
                  </UButton>
                  <template #body>
                    <ClientRegistrationForm
                      mode="edit"
                      :initial="{
                        firstName: client.firstName,
                        lastName: client.lastName,
                        dateOfBirth: client.dateOfBirth,
                        gender: client.gender,
                        contactNumber: String(client.contactNumber ?? ''),
                        email: String(client.email ?? ''),
                        address: String(client.address ?? ''),
                        programIds: client.programs.map((prog) => ({
                          label: prog.name,
                          id: prog.id,
                        })),
                      }"
                      @done="refresh"
                      :client-id="client.id"
                      @cancelling="showEditModal = false"
                    ></ClientRegistrationForm>
                  </template>
                </USlideover>
                <UModal
                  title="Delete Client"
                  description="delete"
                  aria-describedby="Delete Client"
                  close
                  :overlay="false"
                  v-model:open="showDeleteModal"
                >
                  <UButton
                    icon="i-lucide-trash-2"
                    color="neutral"
                    variant="outline"
                  >
                    Delete
                  </UButton>
                  <template #content>
                    <UCard>
                      <template #header>
                        <div class="text-lg font-medium">Delete Client</div>
                      </template>
                      <p>
                        Are you sure you want to delete this client? This action
                        cannot be undone.
                      </p>
                      <template #footer>
                        <div class="flex justify-end gap-2">
                          <UButton
                            class="shadow shadow-black/70"
                            variant="outline"
                            @click="showDeleteModal = false"
                            >Cancel</UButton
                          >
                          <UButton
                            class="shadow shadow-black/70"
                            color="error"
                            @click="deleteClient"
                            :loading="isDeleting"
                            >Yes Delete</UButton
                          >
                        </div>
                      </template>
                    </UCard>
                  </template>
                </UModal>
              </div>
            </div>
          </UCard>

          <UCard v-if="props?.item === 1" class="light:bg-white light:shadow">
            <template #header>
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <UIcon size="20" name="i-lucide-user"></UIcon>
                  <h2 class="text-lg font-medium">Personal Information</h2>
                </div>
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

          <UCard v-if="props?.item === 2" class="light:bg-white light:shadow">
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
            </div>
            <div v-else class="py-4">
              <p class="text-gray-500 mb-4">No programs enrolled</p>
            </div>
            <div class="space-x-3 mt-3">
              <UModal
                v-model:open="showEnrollmentModal"
                title="Program Enrollment"
                description="enroll"
                aria-describedby="Program Enrollment"
                close
                :overlay="false"
              >
                <UButton
                  icon="i-lucide-plus"
                  color="primary"
                  class="shadow shadow-black/70"
                >
                  Enroll
                </UButton>

                <template #body>
                  <ProgramEnrollmentForm
                    @cancel="showEnrollmentModal = false"
                    :client-id="client.id"
                    @done="
                      () => {
                        showEnrollmentModal = false;
                        refresh();
                      }
                    "
                  />
                </template>
              </UModal>

              <UButton
                variant="outline"
                icon="i-lucide-plus"
                color="neutral"
                to="/programs"
                class="shadow shadow-black/70"
              >
                Go to programs
              </UButton>
            </div>
          </UCard>

          <UCard v-if="props?.item === 3" class="light:bg-white light:shadow">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-text"></UIcon>
                  <h2 class="text-lg font-medium">Notes</h2>
                </div>
              </div>
            </template>

            <ClientNotes
              v-if="client?.programs?.length"
              :notes="client.notes"
              :client-id="client.id"
              :client-user-id="client.userId"
              @added="
                () => {
                  refresh();
                }
              "
            />
            <div v-else class="space-y-3">
              <div>This client is not enrolled in any programs yet</div>
              <div class="space-x-3">
                <UModal
                  v-model:open="showEnrollmentModal"
                  title="Program Enrollment"
                  description="enroll"
                  aria-describedby="Program Enrollment"
                  close
                  :overlay="false"
                >
                  <UButton
                    icon="i-lucide-plus"
                    color="primary"
                    class="shadow shadow-black/70"
                  >
                    Enroll
                  </UButton>

                  <template #body>
                    <ProgramEnrollmentForm
                      @cancel="showEnrollmentModal = false"
                      :client-id="client.id"
                      @done="
                        () => {
                          showEnrollmentModal = false;
                          refresh();
                        }
                      "
                    />
                  </template>
                </UModal>
                <UButton
                  variant="outline"
                  icon="i-lucide-plus"
                  color="neutral"
                  to="/programs"
                  class="shadow shadow-black/70"
                >
                  Go to programs
                </UButton>
              </div>
            </div>
          </UCard>
        </template>
      </MasonryWall>
    </template>

    <div v-else>
      <ClientDetailsSkeleton />
    </div>
  </div>
</template>

<script setup lang="ts">
import MasonryWall from "@yeger/vue-masonry-wall";
import type { UIClientDetails } from "~/shared/types/clients.types";

const route = useRoute();
const clientId = route.params.id as string;

// State for modals
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const showEnrollmentModal = ref(false);
const isDeleting = ref(false);

// Fetching and caching client data
const {
  data: client,
  status,
  error,
  refresh,
} = useFetch<UIClientDetails>(`/api/clients/${clientId}`, {
  key: `client-${clientId}`,
  default: () => null,
});

async function share() {
  navigator.clipboard.writeText(
    `${window.location.origin}/clients/${client.value?.id}/profile`
  );
  useToast().add({
    title: "Copied client profile link to clipboard!",
    color: "success",
    icon: "i-lucide-circle-check",
  });
}

async function deleteClient() {
  isDeleting.value = true;

  await $fetch("/api/clients/delete-bulk", {
    method: "DELETE",
    body: {
      ids: [client.value?.id],
    },
  })
    .then((res) => {
      useToast().add({
        title: "Success",
        description: res.message || "Client deleted successfully",
        color: "success",
      });
      navigateTo("/clients");
    })
    .catch((error) => {
      useToast().add({
        title: "Error",
        description:
          error?.response?._data?.message ||
          error.message ||
          "Failed to delete client",
        color: "error",
      });
    })
    .finally(() => {
      isDeleting.value = false;
    });
}
</script>
