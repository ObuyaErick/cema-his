<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid md:grid-cols-2 gap-4">
      <!-- First Name -->
      <UFormField label="First Name" name="firstName" :error="errors.firstName">
        <UInput
          v-model="formData.firstName"
          placeholder="First Name"
          required
        />
      </UFormField>

      <!-- Last Name -->
      <UFormField label="Last Name" name="lastName" :error="errors.lastName">
        <UInput v-model="formData.lastName" placeholder="Last Name" required />
      </UFormField>
    </div>

    <!-- Email -->
    <UFormField label="Email" name="email" :error="errors.email">
      <UInput
        v-model="formData.email"
        type="email"
        placeholder="Email Address"
        required
      />
    </UFormField>

    <!-- Phone -->
    <UFormField label="Phone" name="phone" :error="errors.phone">
      <UInput v-model="formData.phone" placeholder="Phone Number" />
    </UFormField>

    <!-- Address -->
    <UFormField label="Address" name="address" :error="errors.address">
      <UTextarea v-model="formData.address" placeholder="Address" rows="2" />
    </UFormField>

    <div class="grid md:grid-cols-2 gap-4">
      <!-- Gender -->
      <UFormField label="Gender" name="gender" :error="errors.gender">
        <USelect
          v-model="formData.gender"
          placeholder="Select Gender"
          :options="genderOptions"
        />
      </UFormField>

      <!-- Date of Birth -->
      <UFormField
        label="Date of Birth"
        name="dateOfBirth"
        :error="errors.dateOfBirth"
      >
        <UInput v-model="formData.dateOfBirth" type="date" />
      </UFormField>
    </div>

    <!-- Submit and Cancel buttons -->
    <div class="flex justify-end gap-2 pt-4">
      <UButton type="button" variant="outline" @click="$emit('cancel')"
        >Cancel</UButton
      >
      <UButton type="submit" color="primary" :loading="isSubmitting"
        >Save</UButton
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, PropType, onMounted } from "vue";

const props = defineProps({
  client: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
});

const emit = defineEmits(["submit", "cancel"]);

const isSubmitting = ref(false);
const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  dateOfBirth: "",
});

const errors = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  dateOfBirth: "",
});

// Initialize form with client data if available
onMounted(() => {
  if (props.client) {
    formData.firstName = props.client.firstName || "";
    formData.lastName = props.client.lastName || "";
    formData.email = props.client.email || "";
    formData.phone = props.client.phone || "";
    formData.address = props.client.address || "";
    formData.gender = props.client.gender || "";
    formData.dateOfBirth = props.client.dateOfBirth
      ? new Date(props.client.dateOfBirth).toISOString().split("T")[0]
      : "";
  }
});

// Validate form
function validateForm() {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  // Required fields
  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
    isValid = false;
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
    isValid = false;
  }

  return isValid;
}

// Submit form
async function handleSubmit() {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    emit("submit", { ...formData });
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
