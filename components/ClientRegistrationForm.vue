<template>
  <UForm
    :schema="clientRegistrationSchema"
    :state="formState"
    @submit="onSubmit"
  >
    <div class="grid gap-4">
      <UFormField required name="firstName" label="First Name">
        <UInput
          class="w-full"
          v-model="formState.firstName"
          placeholder="Enter first name"
        />
      </UFormField>

      <UFormField required name="lastName" label="Last Name">
        <UInput
          class="w-full"
          v-model="formState.lastName"
          placeholder="Enter last name"
        />
      </UFormField>

      <UFormField required name="dateOfBirth" label="Date of Birth">
        <UPopover v-model:open="datePopoverOpen">
          <UButton
            class="justify-start"
            variant="outline"
            color="neutral"
            block
            >{{
              formState.dateOfBirth
                ? new Date(formState.dateOfBirth).toDateString()
                : "Select date of birth"
            }}</UButton
          >
          <template #content>
            <UCalendar
              @update:model-value="
                () => {
                  datePopoverOpen = false;
                }
              "
              v-model="(formState.dateOfBirth as never)"
            />
          </template>
        </UPopover>
      </UFormField>

      <UFormField required name="gender" label="Gender">
        <USelect
          class="w-full"
          v-model="formState.gender"
          :items="genderOptions"
          placeholder="Select gender"
        />
      </UFormField>

      <UFormField required name="contactNumber" label="Contact Number">
        <UInput
          class="w-full"
          v-model="formState.contactNumber"
          placeholder="Enter contact number"
        />
      </UFormField>

      <UFormField required name="email" label="Email">
        <UInput
          class="w-full"
          v-model="formState.email"
          type="email"
          placeholder="Enter email"
        />
      </UFormField>

      <div class="">
        <UFormField hint="Optional" name="address" label="Address">
          <UTextarea
            class="w-full"
            v-model="formState.address"
            placeholder="Enter address"
          />
        </UFormField>
      </div>

      <USeparator></USeparator>

      <div>
        <UFormField name="programIds" label="Programs" hint="Optional">
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
      </div>
    </div>

    <div class="mt-4 flex justify-end gap-4">
      <UButton
        @click="
          () => {
            emit('cancelling');
          }
        "
        type="button"
        variant="outline"
        color="neutral"
        >Cancel</UButton
      >
      <UButton :loading="submitting" type="submit" color="primary"
        >Register</UButton
      >
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, SelectMenuItem } from "@nuxt/ui";

import {
  clientRegistrationSchema,
  type ClientRegistrationSchema,
} from "~/shared/types/clients.types";

const emit = defineEmits<{
  (e: "cancelling"): void;
  (e: "done"): void;
}>();
const submitting = ref(false);

const datePopoverOpen = ref(false);

const programSearchQuery = ref("");

const { data: programs, status } = useFetch("/api/health-programs", {
  query: {
    search: programSearchQuery,
  },
});

const freshClientData = () => ({
  firstName: "",
  lastName: "",
  dateOfBirth: undefined,
  gender: "",
  contactNumber: "",
  email: "",
  address: "",
});

const programIds = ref<{ label: string; id: number }[]>([]);

// Form state
const formState = ref<Partial<ClientRegistrationSchema>>(freshClientData());

// Gender options for dropdown
const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Prefer not to say", value: "PreferNotToSay" },
];

// Form submission handler
const onSubmit = async (event: FormSubmitEvent<ClientRegistrationSchema>) => {
  const clientData = {
    ...event.data,
    // Coerce date of birth to ISO format
    dateOfBirth: event.data.dateOfBirth.toISOString(),
  };
  if (programIds.value?.length) {
    clientData.programIds = programIds.value.map((p) => String(p.id));
  }
  submitting.value = true;
  // Send client data to the server
  await $fetch("/api/clients", { method: "POST", body: clientData })
    .then((res) => {
      useToast().add({
        title: "Success",
        description: res.message || "Client registered successfully",
        color: "success",
      });
      formState.value = freshClientData();
      emit("done");
    })
    .catch((error) => {
      useToast().add({
        title: "Error",
        description:
          error?.response?._data?.message ||
          error.message ||
          "Failed to register client",
        color: "error",
      });
    })
    .finally(() => {
      submitting.value = false;
    });
};
</script>
