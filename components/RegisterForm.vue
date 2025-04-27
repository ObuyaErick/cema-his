<template>
  <UForm
    :state="state"
    @submit="onSubmit"
    @error="onError"
    :schema="registrationSchema"
    class="space-y-4"
    :validate-on="['blur', 'change', 'focus', 'input']"
  >
    <UFormField required label="Name" name="name" size="xl">
      <UInput
        placeholder="enter full name"
        icon="i-lucide-user"
        class="w-full"
        v-model="state.name"
      ></UInput>
    </UFormField>

    <UFormField required label="Email" name="email" size="xl">
      <UInput
        placeholder="enter email address"
        icon="i-lucide-mail"
        class="w-full"
        v-model="state.email"
      ></UInput>
    </UFormField>

    <UFormField required label="Password" name="password" size="xl">
      <UInput
        placeholder="enter your password"
        leading-icon="i-lucide-lock-keyhole"
        class="w-full"
        v-model="state.password"
        :type="seePassword ? 'text' : 'password'"
      >
        <template v-if="state.password?.length" #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="seePassword ? 'i-lucide-eye' : 'i-lucide-eye-off'"
            :aria-label="seePassword ? 'Hide password' : 'Show password'"
            :aria-pressed="seePassword"
            aria-controls="password"
            @click="seePassword = !seePassword"
          />
        </template>
      </UInput>
    </UFormField>

    <UButton
      size="xl"
      loading-icon="i-lucide-loader"
      class="transition-all duration-500"
      :variant="submitting ? 'soft' : 'solid'"
      :color="submitting ? 'neutral' : 'primary'"
      :loading="submitting"
      block
      type="submit"
    >
      Submit
    </UButton>

    <USeparator>
      <template #default>
        <span class="text-(--ui-text-muted) text-sm">Or</span>
      </template>
    </USeparator>

    <UButton to="/login" size="xl" block variant="outline" color="neutral"
      >Sign In
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import {
  registrationSchema,
  type RegistrationSchema,
} from "~/shared/types/auth.types";

const authStore = useAuthStore();

const state = ref<Partial<RegistrationSchema>>({
  name: "",
  email: "",
  password: "",
});

const submitting = ref(false);
const seePassword = ref(false);

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<RegistrationSchema>) {
  submitting.value = true;

  authStore
    .register(event.data)
    .then((res) => {
      if (res.status === "success") {
        toast.add({
          title: "Success",
          description: res.message,
          color: "success",
        });
        state.value = {
          name: "",
          email: "",
          password: "",
        };
        navigateTo("/login");
      } else {
        toast.add({
          title: "Error",
          description: res.message,
          color: "error",
        });
      }
    })

    .finally(() => {
      submitting.value = false;
    });
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id);
    element?.focus();
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
</script>
