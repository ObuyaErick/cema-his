<template>
  <RestrictedContent
    :unless="authStore.role === 'doctor'"
    :ui="{
      fallback:
        'w-full border px-6 py-8 mx-auto border-(--ui-border-accented) rounded-lg space-y-4',
    }"
  >
    <div class="grid">
      <UCard class="mb-6 shadow light:bg-white">
        <template #header>
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-semibold">Clients</h1>
            <USlideover
              :ui="{
                content: 'max-w-lg top-8 mx-auto rounded-t-lg',
              }"
              close-icon="i-lucide-chevron-down"
              side="bottom"
              :overlay="false"
              v-model:open="createClientSlideOverOpen"
              title="New Client"
              aria-describedby="New client registration"
              description="client registration"
            >
              <UButton
                icon="i-lucide-plus"
                label="Add Client"
                color="primary"
              />
              <template #body>
                <ClientRegistrationForm
                  @cancelling="createClientSlideOverOpen = false"
                  @done="
                    () => {
                      createClientSlideOverOpen = false;
                      refresh();
                    }
                  "
                ></ClientRegistrationForm>
              </template>
            </USlideover>
          </div>
        </template>

        <!-- Filters Modal -->
        <UModal
          description="Advanced client filters"
          title="Client Filters"
          aria-describedby="Filters"
          v-model:open="isFilterOpen"
          close
        >
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <UFormField class="grow" label="Gender">
                <USelect
                  class="w-full"
                  v-model="filters.gender"
                  :items="genderOptions"
                  placeholder="All genders"
                  clearable
                />
              </UFormField>
              <UFormField label="Date From">
                <UInput class="w-full" v-model="filters.dateFrom" type="date" />
              </UFormField>
              <UFormField label="Date To">
                <UInput class="w-full" v-model="filters.dateTo" type="date" />
              </UFormField>
            </div>
            <div class="flex justify-end p-4 gap-4">
              <UButton
                color="neutral"
                icon="i-lucide-rotate-ccw"
                variant="outline"
                @click="resetFilters"
              >
                Reset
              </UButton>
              <UButton
                class="text-gray-200"
                color="primary"
                @click="applyFilters"
              >
                Apply Filters
              </UButton>
            </div>
          </template>
        </UModal>

        <!-- Search & Filters -->
        <div class="">
          <!-- Search -->
          <UButtonGroup class="w-full">
            <UInput
              class="grow"
              size="lg"
              v-model="searchQuery"
              placeholder="Search by name, email or phone..."
              icon="i-lucide-search"
              @input="resetPage"
            />

            <UButton
              icon="i-lucide-trash"
              :disabled="!Object.entries(rowSelection).length"
              size="lg"
              color="neutral"
              variant="outline"
              @click="deleteSelected"
              :loading="deletingSelected"
              >Delete Selected</UButton
            >

            <!-- Filters -->
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-funnel"
              @click="isFilterOpen = true"
              >Filters</UButton
            >
          </UButtonGroup>
        </div>

        <!-- Clients Table -->
        <div class="grid">
          <UTable
            :ui="{ root: 'horizontal-scrollbar' }"
            v-if="clients"
            @select="
              (row) => {
                row.toggleSelected(!row.getIsSelected());
              }
            "
            ref="table"
            v-model:expanded="expanded"
            v-model:row-selection="rowSelection"
            :columns="columns"
            :data="clients.data"
            :loading="tableLoading || status === 'pending'"
            empty="No clients found"
          >
            <template #expanded="{ row: { original: client } }">
              <UCard>
                <div class="grid gap-2">
                  <div class="flex flex-wrap gap-2">
                    <div
                      class="px-3 py-1 border border-dashed border-(--ui-border-accented) bg-(--ui-bg-accented)"
                    >
                      <span class="flex items-center gap-2"
                        ><UIcon name="i-lucide-circle-user"></UIcon>Full
                        Name</span
                      >
                      <div class="font-bold">
                        {{ client.firstName }} {{ client.lastName }}
                      </div>
                    </div>
                    <div
                      class="px-3 py-1 border border-dashed border-(--ui-border-accented) bg-(--ui-bg-accented)"
                    >
                      <span class="flex items-center gap-2"
                        ><UIcon name="i-lucide-calendar-days"></UIcon>Date of
                        Birth</span
                      >
                      <div class="font-bold">
                        {{ new Date(client.dateOfBirth).toDateString() }}
                      </div>
                    </div>
                    <div
                      class="px-3 py-1 border border-dashed border-(--ui-border-accented) bg-(--ui-bg-accented)"
                    >
                      <span class="flex items-center gap-2"
                        ><UIcon name="i-lucide-map-pin-house"></UIcon
                        >Address</span
                      >
                      <div class="font-bold">{{ client.address }}</div>
                    </div>
                    <div
                      class="px-3 py-1 border border-dashed border-(--ui-border-accented) bg-(--ui-bg-accented)"
                    >
                      <span class="flex items-center gap-2"
                        ><UIcon name="i-lucide-calendar-clock"></UIcon
                        >Registration Date</span
                      >
                      <div class="font-bold">
                        {{ new Date(client.createdAt).toDateString() }}
                      </div>
                    </div>
                  </div>
                  <USeparator></USeparator>
                  <div>
                    <h4>Programs</h4>
                    <div class="flex gap-2">
                      <UBadge
                        v-for="healthProgram in client.programs"
                        color="neutral"
                        variant="outline"
                        >{{ healthProgram.name }}</UBadge
                      >
                    </div>
                  </div>
                </div>
              </UCard>
            </template>
          </UTable>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm">
            Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of
            {{ paginationInfo.total }} entries
          </div>
          <UPagination
            v-model:page="currentPage"
            size="xs"
            :items-per-page="limit"
            :total="paginationInfo.total"
          />
        </div>
        <div
          class="py-2 mt-2 border-t border-(--ui-border-accented) text-sm text-muted flex justify-between"
        >
          <div>
            {{
              table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0
            }}
            of
            {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
            clients(s) selected.
          </div>
          <div class="">
            <UButtonGroup>
              <USelect
                class="w-20"
                v-model="limit"
                :items="
                  [5, 10, 15, 20, 25, 50, 75, 100].map((count) => ({
                    label: `${count}`,
                    value: count,
                  }))
                "
              >
              </USelect>
              <UButton color="neutral" variant="outline"
                >Clients per page</UButton
              >
            </UButtonGroup>
          </div>
        </div>
      </UCard>
    </div>
  </RestrictedContent>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Client, HealthProgram } from "~/generated/prisma";
import type { Column, Row } from "@tanstack/vue-table";
import type { Paginated } from "~/shared/types/pagination.types";

type ClientWithHealthPrograms = Client & { programs: HealthProgram[] };
const authStore = useAuthStore();
const table = useTemplateRef("table");
const tableLoading = ref(false);

const deletingSelected = ref(false);

const searchQuery = ref("");
const currentPage = ref(1);
const limit = ref(10);
const isFilterOpen = ref(false);
const createClientSlideOverOpen = ref(false);
const filters = ref({
  gender: "",
  dateFrom: "",
  dateTo: "",
});
const reqFilters = ref<Record<string, string>>({});
const {
  data: clients,
  status,
  refresh,
} = useFetch<Paginated<ClientWithHealthPrograms>>("/api/clients", {
  query: {
    limit,
    page: currentPage,
    search: searchQuery,
    ...reqFilters.value,
  },
});

// Constants
const genderOptions = shallowRef([
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
]);

const expanded = ref<Record<number, boolean>>();
const rowSelection = ref<Record<number, boolean>>({});

// Table columns
const columns = shallowRef<TableColumn<ClientWithHealthPrograms>[]>([
  {
    id: "select",
    header: ({ table }) =>
      h(resolveComponent("UCheckbox"), {
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      h(resolveComponent("UCheckbox"), {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
  },
  {
    id: "expand",
    cell: ({ row }) =>
      h(resolveComponent("UButton"), {
        color: "neutral",
        variant: row.getIsExpanded() ? "solid" : "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-all",
            row.getIsExpanded() ? "duration-300 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => sortableHeader(column, "FirstName"),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => sortableHeader(column, "LastName"),
  },
  {
    accessorKey: "email",
    header: ({ column }) => sortableHeader(column, "Email"),
  },
  {
    accessorKey: "contactNumber",
    header: "Phone",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const color = {
        Male: "primary" as const,
        Female: "warning" as const,
      }[row.getValue("gender") as string];

      return h(
        resolveComponent("UBadge"),
        { class: "capitalize", variant: "subtle", color },
        () => row.getValue("gender")
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          resolveComponent("UDropdownMenu"),
          {
            content: {
              align: "end",
            },
            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(resolveComponent("UButton"), {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
]);

function sortableHeader(
  column: Column<ClientWithHealthPrograms>,
  label: string
) {
  const isSorted = column.getIsSorted();

  return h(resolveComponent("UButton"), {
    color: "neutral",
    variant: "ghost",
    label: label,
    icon: isSorted
      ? isSorted === "asc"
        ? "i-lucide-arrow-up-narrow-wide"
        : "i-lucide-arrow-down-wide-narrow"
      : "i-lucide-arrow-up-down",
    class: "",
    onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
  });
}

function getRowItems(row: Row<ClientWithHealthPrograms>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Copy client's ID",
      icon: "i-lucide-copy",
      onSelect() {
        navigator.clipboard.writeText(row.original.id);
        useToast().add({
          title: "Copied client's ID to clipboard!",
          color: "success",
          icon: "i-lucide-circle-check",
        });
      },
    },
    {
      type: "separator",
    },
    {
      label: "View client's details",
      icon: "i-lucide-book-user",
      to: `/clients/${row.original.id}`,
    },
    {
      label: "Add Program",
      icon: "i-lucide-package-plus",
      to: `/clients/${row.original.id}#enrolled_programs`,
    },
    {
      type: "separator",
    },
    {
      label: "Delete client",
      icon: "i-lucide-trash",
      onSelect() {
        tableLoading.value = true;
        deleteClients([row?.original?.id])
          .catch((error) => {
            useToast().add({
              title: "Failed",
              description: error.message || "Failed to delete client",
              color: "error",
            });
          })
          .finally(() => {
            tableLoading.value = false;
          });
      },
    },
  ];
}

// Pagination information
const paginationInfo = computed(() => {
  const limit = Number(clients.value?.limit ?? 10);
  const from = (Number(clients.value?.page ?? 1) - 1) * limit + 1;
  const end = from + limit - 1;
  const total = Number(clients.value?.total ?? 0);
  const to = end > total ? total : end;
  const pageCount = Math.ceil(total / limit);
  return { from, to, total, limit, pageCount };
});

// Filter handlers
const resetFilters = () => {
  filters.value = {
    gender: "",
    dateFrom: "",
    dateTo: "",
  };
  resetPage();
};

const applyFilters = () => {
  resetPage();
  reqFilters.value = Object.entries(filters.value).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>
  );
  refresh();
};

const resetPage = () => {
  currentPage.value = 1;
};

const deleteClients = async (ids: (string | number)[]) => {
  if (ids.length) {
    await $fetch("/api/clients/delete-bulk", {
      method: "DELETE",
      body: {
        ids,
      },
    }).then((res) => {
      useToast().add({
        title: "Success",
        description:
          res.message ||
          `${ids.length ? "Client" : "Clients"} deleted successfully`,
        color: "success",
      });
      refresh();
      rowSelection.value = {};
    });
  } else {
    useToast().add({
      title: "Error",
      description: "Please select at least one entry",
      color: "warning",
    });
  }
};

const deleteSelected = async () => {
  const ids = Object.keys(rowSelection.value);
  if (clients.value?.data && ids.length) {
    deletingSelected.value = true;
    await deleteClients(
      ids.map((index) => clients.value!.data[Number(index)].id)
    )
      .catch((error) => {
        useToast().add({
          title: "Failed",
          description: error.message || "Failed to delete entries",
          color: "error",
        });
      })
      .finally(() => {
        deletingSelected.value = false;
      });
  }
};

definePageMeta({
  layout: "main",
});
</script>
