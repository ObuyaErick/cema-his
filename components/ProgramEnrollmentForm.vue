<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Program Selection -->
    <UFormField
      label="Select Program"
      name="programId"
      :error="errors.programId"
      required
    >
      <USelectMenu
        v-model="formData.programId"
        :items="programs"
        placeholder="Select a program"
        value-attribute="id"
        option-attribute="name"
      />
    </UFormField>

    <!-- Start Date -->
    <UFormField label="Start Date" name="startDate" :error="errors.startDate">
      <UInput v-model="formData.startDate" type="date" :min="today" />
    </UFormField>

    <!-- End Date -->
    <UFormField
      label="End Date (Optional)"
      name="endDate"
      :error="errors.endDate"
    >
      <UInput
        v-model="formData.endDate"
        type="date"
        :min="formData.startDate || today"
      />
    </UFormField>

    <!-- Notes -->
    <UFormField label="Notes (Optional)" name="notes" :error="errors.notes">
      <UTextarea
        v-model="formData.notes"
        placeholder="Additional notes about this enrollment"
        rows="3"
      />
    </UFormField>

    <!-- Submit and Cancel buttons -->
    <div class="flex justify-end gap-2 pt-4">
      <UButton type="button" variant="outline" @click="$emit('cancel')"
        >Cancel</UButton
      >
      <UButton type="submit" color="primary" :loading="isSubmitting"
        >Enroll</UButton
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, PropType } from "vue";

const props = defineProps({
  clientId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const isSubmitting = ref(false);
const today = computed(() => new Date().toISOString().split("T")[0]);

const formData = reactive({
  programId: "",
  startDate: today.value,
  endDate: "",
  notes: "",
});

const errors = reactive({
  programId: "",
  startDate: "",
  endDate: "",
  notes: "",
});

// Fetch available programs
const { data: programs, pending: loadingPrograms } = useFetch("/api/programs", {
  default: () => [],
});

// Validate form
function validateForm() {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  // Required fields
  if (!formData.programId) {
    errors.programId = "Program selection is required";
    isValid = false;
  }

  if (!formData.startDate) {
    errors.startDate = "Start date is required";
    isValid = false;
  }

  // End date validation (must be after start date)
  if (
    formData.endDate &&
    formData.startDate &&
    new Date(formData.endDate) < new Date(formData.startDate)
  ) {
    errors.endDate = "End date must be after start date";
    isValid = false;
  }

  return isValid;
}

// Submit form
async function handleSubmit() {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    emit("submit", {
      ...formData,
      clientId: props.clientId,
    });
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
