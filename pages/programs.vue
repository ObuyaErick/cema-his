<template>
  <div class="grid">
    <UCard class="mb-6 shadow light:bg-white">
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-semibold">Health Programs</h1>
          <USlideover
            :ui="{
              content: 'max-w-lg top-8 mx-auto rounded-t-lg',
            }"
            close-icon="i-lucide-chevron-down"
            side="bottom"
            :overlay="false"
            v-model:open="createProgramSlideOverOpen"
            title="New Health Program"
            aria-describedby="New health program registration"
            description="program registration"
          >
            <UButton icon="i-lucide-plus" label="Add Program" color="primary" />
            <template #body>
              <ProgramRegistrationForm
                @cancelling="createProgramSlideOverOpen = false"
                @done="
                  () => {
                    createProgramSlideOverOpen = false;
                    refresh();
                  }
                "
              ></ProgramRegistrationForm>
            </template>
          </USlideover>
        </div>
      </template>

      <!-- Filters Modal -->
      <UModal
        description="Advanced program filters"
        title="Program Filters"
        aria-describedby="Filters"
        v-model:open="isFilterOpen"
        close
      >
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
            placeholder="Search by program name..."
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

      <!-- Programs Table -->
      <div class="grid">
        <UTable
          :ui="{ root: 'horizontal-scrollbar' }"
          v-if="programs"
          @select="
            (row) => {
              row.toggleSelected(!row.getIsSelected());
            }
          "
          ref="table"
          v-model:expanded="expanded"
          v-model:row-selection="rowSelection"
          :columns="columns"
          :data="programs.data"
          :loading="tableLoading || status === 'pending'"
          empty="No programs found"
        >
          <template #expanded="{ row: { original: program } }">
            <UCard>
              <div class="grid gap-2">
                <div class="flex flex-wrap gap-2">
                  <div
                    class="px-3 py-1 border border-dashed border-(--ui-border-accented) bg-(--ui-bg-accented)"
                  >
                    <span class="flex items-center gap-2"
                      ><UIcon name="i-lucide-stethoscope"></UIcon>Program
                      Name</span
                    >
                    <div class="font-bold">
                      {{ program.name }}
                    </div>
                  </div>
                  <div
                    class="px-3 py-1 border border-dashed border-(--ui-border-accented) bg-(--ui-bg-accented)"
                  >
                    <span class="flex items-center gap-2"
                      ><UIcon name="i-lucide-calendar-clock"></UIcon>Created
                      Date</span
                    >
                    <div class="font-bold">
                      {{ new Date(program.createdAt).toDateString() }}
                    </div>
                  </div>
                  <div
                    class="px-3 py-1 border border-dashed border-(--ui-border-accented) bg-(--ui-bg-accented)"
                  >
                    <span class="flex items-center gap-2"
                      ><UIcon name="i-lucide-users"></UIcon>Enrolled
                      Clients</span
                    >
                    <div class="font-bold">
                      {{ program._count?.enrollments || 0 }}
                    </div>
                  </div>
                </div>
                <USeparator></USeparator>
                <div>
                  <h4>Description</h4>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ program.description || "No description available" }}
                  </p>
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
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }}
          of
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
          program(s) selected.
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
              >Programs per page</UButton
            >
          </UButtonGroup>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { HealthProgram } from "~/generated/prisma";
import type { Column, Row } from "@tanstack/vue-table";

type HealthProgramWithCountedEnrollments = HealthProgram & {
  _count: { enrollments: number };
};

const table = useTemplateRef("table");
const tableLoading = ref(false);

const deletingSelected = ref(false);

const searchQuery = ref("");
const currentPage = ref(1);
const limit = ref(10);
const isFilterOpen = ref(false);
const createProgramSlideOverOpen = ref(false);
const filters = ref({
  dateFrom: "",
  dateTo: "",
});
const reqFilters = ref<Record<string, string>>({});
const {
  data: programs,
  status,
  refresh,
} = useFetch("/api/health-programs", {
  query: {
    limit,
    page: currentPage,
    search: searchQuery,
    ...reqFilters.value,
  },
});

const expanded = ref<Record<number, boolean>>();
const rowSelection = ref<Record<number, boolean>>({});

// Table columns
const columns = shallowRef<TableColumn<HealthProgramWithCountedEnrollments>[]>([
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
    accessorKey: "name",
    header: ({ column }) => sortableHeader(column, "Program Name"),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description && description.length > 50
        ? `${description.substring(0, 50)}...`
        : description || "No description";
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => sortableHeader(column, "Created Date"),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return new Date(date).toLocaleDateString();
    },
  },
  {
    accessorKey: "_count.enrollments",
    header: ({ column }) => sortableHeader(column, "Enrolled Clients"),
    cell: ({ row }) => {
      const count = row.original._count?.enrollments || 0;
      return h(
        resolveComponent("UBadge"),
        {
          class: "text-center",
          variant: "subtle",
          color: count > 0 ? "success" : "neutral",
        },
        () => count
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
  column: Column<HealthProgramWithCountedEnrollments>,
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

function getRowItems(row: Row<HealthProgramWithCountedEnrollments>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Copy program ID",
      icon: "i-lucide-copy",
      onSelect() {
        navigator.clipboard.writeText(String(row.original.id));
        useToast().add({
          title: "Copied program ID to clipboard!",
          color: "success",
          icon: "i-lucide-circle-check",
        });
      },
    },
    {
      type: "separator",
    },
    {
      label: "View program details",
      icon: "i-lucide-clipboard-list",
    },
    {
      label: "Manage enrollments",
      icon: "i-lucide-users",
    },
    {
      label: "Edit program",
      icon: "i-lucide-edit",
    },
    {
      type: "separator",
    },
    {
      label: "Delete program",
      icon: "i-lucide-trash",
      onSelect() {
        tableLoading.value = true;
        deletePrograms([row?.original?.id])
          .catch((error) => {
            useToast().add({
              title: "Failed",
              description: error.message || "Failed to delete program",
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
  const limit = Number(programs.value?.limit ?? 10);
  const from = (Number(programs.value?.page ?? 1) - 1) * limit + 1;
  const end = from + limit - 1;
  const total = Number(programs.value?.total ?? 0);
  const to = end > total ? total : end;
  const pageCount = Math.ceil(total / limit);
  return { from, to, total, limit, pageCount };
});

// Filter handlers
const resetFilters = () => {
  filters.value = {
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

const deletePrograms = async (ids: (string | number)[]) => {
  if (ids.length) {
    await $fetch("/api/health-programs/delete-bulk", {
      method: "DELETE",
      body: {
        ids,
      },
    }).then((res) => {
      useToast().add({
        title: "Success",
        description:
          res.message ||
          `${ids.length === 1 ? "Program" : "Programs"} deleted successfully`,
        color: "success",
      });
      refresh();
      rowSelection.value = {};
    });
  } else {
    useToast().add({
      title: "Error",
      description: "Please select at least one program",
      color: "warning",
    });
  }
};

const deleteSelected = async () => {
  const ids = Object.keys(rowSelection.value);
  if (programs.value?.data && ids.length) {
    deletingSelected.value = true;
    await deletePrograms(
      ids.map((index) => programs.value!.data[Number(index)].id)
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
