<template>
  <div class="p-6">
    <UCard class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-semibold">Clients</h1>
          <UButton
            icon="i-lucide-plus"
            label="Add Client"
            color="primary"
            @click="navigateToAddClient"
          />
        </div>
      </template>

      <!-- Search & Filters -->
      <div class="space-y-4 mb-4">
        <!-- Search -->
        <div>
          <UInput
            v-model="searchQuery"
            placeholder="Search by name, email or phone..."
            icon="i-lucide-search"
            @input="resetPage"
          />
          <UButton
            color="gray"
            icon="i-lucide-funnel"
            @click="isFilterOpen = !isFilterOpen"
            :variant="isFilterOpen ? 'solid' : 'outline'"
          />
        </div>

        <!-- Filters -->
        <div v-if="isFilterOpen" class="p-4 bg-gray-50 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UFormField label="Gender">
              <USelect
                v-model="filters.gender"
                :options="genderOptions"
                placeholder="All genders"
                clearable
              />
            </UFormField>
            <UFormField label="Date From">
              <UInput v-model="filters.dateFrom" type="date" />
            </UFormField>
            <UFormField label="Date To">
              <UInput v-model="filters.dateTo" type="date" />
            </UFormField>
          </div>
          <div class="flex justify-end space-x-2 mt-4">
            <UButton color="gray" variant="outline" @click="resetFilters">
              Reset
            </UButton>
            <UButton color="primary" @click="applyFilters">
              Apply Filters
            </UButton>
          </div>
        </div>
      </div>

      <!-- Clients Table -->
      <UTable
        :data="paginatedClients"
        :loading="loading"
        empty="No clients found"
      >
        <!-- <template #name-data="{ row }">
          <div class="font-medium">{{ row.firstName }} {{ row.lastName }}</div>
        </template>
        <template #age-data="{ row }">
          {{ calculateAge(row.dateOfBirth) }}
        </template>
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-lucide-eye"
              @click="viewClient(row)"
            />
            <UButton
              color="primary"
              variant="ghost"
              icon="i-lucide-square-pen"
              @click="editClient(row)"
            />
            <UButton
              color="red"
              variant="ghost"
              icon="i-lucide-trash"
              @click="confirmDelete(row)"
            />
          </div>
        </template> -->
      </UTable>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-600">
          Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of
          {{ filteredClients.length }} entries
        </div>
        <UPagination
          v-model="currentPage"
          :page-count="totalPages"
          :total="filteredClients.length"
          :ui="{ wrapper: 'flex items-center gap-1' }"
        />
      </div>
    </UCard>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <UButton>Delete</UButton>
      <template #content>
        <UCard>
          <template #header>
            <div class="font-semibold text-lg">Confirm Deletion</div>
          </template>
          <p>
            Are you sure you want to delete the client
            {{ clientToDelete?.firstName }} {{ clientToDelete?.lastName }}?
          </p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="gray"
                variant="outline"
                @click="showDeleteModal = false"
                >Cancel</UButton
              >
              <UButton color="red" @click="deleteClient">Delete</UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// State
const clients = ref([]);
const loading = ref(true);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const isFilterOpen = ref(false);
const showDeleteModal = ref(false);
const clientToDelete = ref(null);
const filters = ref({
  gender: null,
  dateFrom: "",
  dateTo: "",
});

// Constants
const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

// Table columns
const columns = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "contactNumber",
    label: "Phone",
  },
  {
    key: "gender",
    label: "Gender",
    sortable: true,
  },
  {
    key: "age",
    label: "Age",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },
];

// Helper function to calculate age
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// Fetch clients from API
const fetchClients = async () => {
  loading.value = true;
  try {
    // Replace with your actual API endpoint
    const response = await fetch("/api/clients");
    clients.value = await response.json();
  } catch (error) {
    console.error("Error fetching clients:", error);
    // Show error notification
    useToast().add({
      title: "Error",
      description: "Failed to load clients",
      color: "red",
    });

    // For demo purposes, generate sample data
    clients.value = generateSampleClients();
  } finally {
    loading.value = false;
  }
};

// Generate sample clients for demonstration
const generateSampleClients = () => {
  const sampleClients = [];
  const genders = ["Male", "Female", "Other"];

  for (let i = 1; i <= 50; i++) {
    const firstName = `FirstName${i}`;
    const lastName = `LastName${i}`;
    const gender = genders[Math.floor(Math.random() * genders.length)];

    // Generate random date of birth (between 18 and 80 years ago)
    const now = new Date();
    const years = Math.floor(Math.random() * 62) + 18;
    const birthDate = new Date(
      now.getFullYear() - years,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );

    sampleClients.push({
      id: i,
      firstName,
      lastName,
      dateOfBirth: birthDate,
      gender,
      contactNumber: `+1-555-${String(
        Math.floor(1000 + Math.random() * 9000)
      )}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      address: `${Math.floor(Math.random() * 999) + 1} Example St, Sample City`,
      createdAt: new Date(
        now - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
      ),
      updatedAt: new Date(),
    });
  }

  return sampleClients;
};

// Filter clients based on search query and filters
const filteredClients = computed(() => {
  let result = [...clients.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (client) =>
        `${client.firstName} ${client.lastName}`
          .toLowerCase()
          .includes(query) ||
        (client.email && client.email.toLowerCase().includes(query)) ||
        (client.contactNumber &&
          client.contactNumber.toLowerCase().includes(query))
    );
  }

  // Apply gender filter
  if (filters.value.gender) {
    result = result.filter((client) => client.gender === filters.value.gender);
  }

  // Apply date range filter
  if (filters.value.dateFrom) {
    const dateFrom = new Date(filters.value.dateFrom);
    result = result.filter(
      (client) => new Date(client.dateOfBirth) >= dateFrom
    );
  }

  if (filters.value.dateTo) {
    const dateTo = new Date(filters.value.dateTo);
    dateTo.setHours(23, 59, 59, 999); // Set to end of day
    result = result.filter((client) => new Date(client.dateOfBirth) <= dateTo);
  }

  return result;
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredClients.value.length / itemsPerPage.value);
});

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredClients.value.slice(start, end);
});

const paginationInfo = computed(() => {
  const total = filteredClients.value.length;

  if (total === 0) {
    return { from: 0, to: 0 };
  }

  const from = (currentPage.value - 1) * itemsPerPage.value + 1;
  const to = Math.min(from + itemsPerPage.value - 1, total);

  return { from, to };
});

// Filter handlers
const resetFilters = () => {
  filters.value = {
    gender: null,
    dateFrom: "",
    dateTo: "",
  };
  resetPage();
};

const applyFilters = () => {
  resetPage();
};

const resetPage = () => {
  currentPage.value = 1;
};

// CRUD operations
const viewClient = (client) => {
  navigateTo(`/clients/${client.id}`);
};

const editClient = (client) => {
  navigateTo(`/clients/${client.id}/edit`);
};

const navigateToAddClient = () => {
  navigateTo("/clients/new");
};

const confirmDelete = (client) => {
  clientToDelete.value = client;
  showDeleteModal.value = true;
};

const deleteClient = async () => {
  if (!clientToDelete.value) return;

  try {
    // Replace with your actual delete API endpoint
    // await fetch(`/api/clients/${clientToDelete.value.id}`, {
    //   method: 'DELETE'
    // })

    // Update local state (for demo)
    clients.value = clients.value.filter(
      (c) => c.id !== clientToDelete.value.id
    );

    // Show success notification
    useToast().add({
      title: "Success",
      description: `Client ${clientToDelete.value.firstName} ${clientToDelete.value.lastName} deleted successfully`,
      color: "green",
    });

    showDeleteModal.value = false;
    clientToDelete.value = null;
  } catch (error) {
    console.error("Error deleting client:", error);
    useToast().add({
      title: "Error",
      description: "Failed to delete client",
      color: "red",
    });
  }
};

const onClientSelect = (client) => {
  viewClient(client);
};

// Initialize page
onMounted(() => {
  // fetchClients();
  $fetch("/api/clients")
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
});

definePageMeta({
  layout: "main",
});
</script>
