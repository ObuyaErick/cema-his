<template>
  <div v-if="client" class="space-y-6">
    <UCard class="light:bg-white shadow shadow-black/40">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">
            {{ client.firstName }} {{ client.lastName }}
          </h1>
          <p class="text-gray-500">
            Client since {{ new Date(client.createdAt).toDateString() }}
          </p>
        </div>
        <UButton
          @click="share"
          class="shadow shadow-black/40"
          icon="i-lucide-share-2"
          >Share</UButton
        >
      </div>
    </UCard>

    <UCard class="light:bg-white shadow shadow-black/40">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Personal Information</h2>
          <UBadge variant="outline" v-if="client.gender" color="neutral">{{
            client.gender
          }}</UBadge>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p>
            <span class="font-bold italic">DOB:</span>
            {{ new Date(client.dateOfBirth).toDateString() }}
          </p>

          <div label="Email">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="text-gray-500" />
              <a
                :href="`mailto:${client.email}`"
                class="text-primary hover:underline"
                >{{ client.email }}</a
              >
            </div>
          </div>
        </div>

        <div>
          <div label="Contact Number">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-phone" class="text-gray-500" />
              <p>{{ client.contactNumber }}</p>
            </div>
          </div>

          <div label="Address">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-map-pin" class="text-gray-500" />
              <p>{{ client.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Programs and Notes -->
    <UCard class="light:bg-white shadow shadow-black/40">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Programs</h2>
        </div>
      </template>

      <ClientNotes
        :client-id="client.id"
        :client-user-id="client.userId"
        :notes="client.notes"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { UIClientDetails } from "~/shared/types/clients.types";

const route = useRoute();
const clientId = route.params.id as string;
const { data: client } = useFetch<UIClientDetails>(`/api/clients/${clientId}`, {
  key: `client-profile-${clientId}`,
  default: () => null,
});

async function share() {
  navigator.clipboard.writeText(
    `${window.location.origin}/clients/${client.value?.id}/profile`
  );
  useToast().add({
    title: "Copied profile link to clipboard!",
    color: "success",
    icon: "i-lucide-circle-check",
  });
}
</script>
