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
        <ProgramFormField v-model="programIds" />
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
      <UButton :loading="submitting" type="submit" color="primary">{{
        mode === "edit" ? "Save Changes" : "Register"
      }}</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import {
  clientRegistrationSchema,
  type ClientRegistrationSchema,
} from "~/shared/types/clients.types";

interface InitialClientDetails
  extends Omit<ClientRegistrationSchema, "programIds"> {
  programIds: { label: string; id: string }[];
}

const props = defineProps<{
  mode?: "edit" | "create";
  initial?: InitialClientDetails;
  clientId?: string;
}>();

const emit = defineEmits<{
  (e: "cancelling"): void;
  (e: "done"): void;
}>();
const submitting = ref(false);

const datePopoverOpen = ref(false);

const freshClientData = () => ({
  firstName: "",
  lastName: "",
  dateOfBirth: undefined,
  gender: "",
  contactNumber: "",
  email: "",
  address: "",
});

const programIds = ref<{ label: string; id: string }[]>([]);

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
    clientData.programIds = programIds.value.map((p) => p.id);
  }
  submitting.value = true;
  // Send client data to the server
  if (props.mode === "edit") {
    const id: string = String(props.clientId);
    await $fetch<{ message: string }>(`/api/clients/${id}`, {
      method: "PATCH",
      body: clientData,
    })
      .then((res) => {
        useToast().add({
          title: "Success",
          description: res.message || "Details updated successfully",
          color: "success",
        });
        emit("done");
      })
      .catch((error) => {
        useToast().add({
          title: "Error",
          description:
            error?.response?._data?.message ||
            error.message ||
            "Failed to update client details",
          color: "error",
        });
      })
      .finally(() => {
        submitting.value = false;
      });
  } else {
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
  }
};

onMounted(() => {
  if (props.mode === "edit" && props.initial) {
    const { programIds: initialPrograms, ...clientInitials } = props.initial;
    formState.value = clientInitials;

    programIds.value = initialPrograms;
  }
});
</script>
