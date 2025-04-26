<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Title -->
    <UFormField label="Title" name="title" :error="errors.title" required>
      <UInput v-model="formData.title" placeholder="Note Title" />
    </UFormField>

    <!-- Content -->
    <UFormField label="Content" name="content" :error="errors.content" required>
      <UTextarea
        v-model="formData.content"
        placeholder="Note content..."
        rows="6"
      />
    </UFormField>

    <!-- Category -->
    <UFormField
      label="Category (Optional)"
      name="category"
      :error="errors.category"
    >
      <USelectMenu
        v-model="formData.category"
        :items="categoryOptions"
        placeholder="Select a category"
        clearable
      />
    </UFormField>

    <!-- Submit and Cancel buttons -->
    <div class="flex justify-end gap-2 pt-4">
      <UButton type="button" variant="outline" @click="$emit('cancel')"
        >Cancel</UButton
      >
      <UButton type="submit" color="primary" :loading="isSubmitting"
        >Save Note</UButton
      >
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";

const props = defineProps({
  clientId: {
    type: String,
    required: true,
  },
  note: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["submit", "cancel"]);

const isSubmitting = ref(false);
const categoryOptions = [
  "General",
  "Medical",
  "Financial",
  "Progress",
  "Feedback",
  "Other",
];

const formData = reactive({
  title: props.note?.title || "",
  content: props.note?.content || "",
  category: props.note?.category || "",
});

const errors = reactive({
  title: "",
  content: "",
  category: "",
});

// Validate form
function validateForm() {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });

  // Required fields
  if (!formData.title.trim()) {
    errors.title = "Title is required";
    isValid = false;
  }

  if (!formData.content.trim()) {
    errors.content = "Content is required";
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
      id: props.note?.id, // Include ID if editing existing note
    });
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
