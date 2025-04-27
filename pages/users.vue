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
            <h1 class="text-xl font-semibold">Users</h1>
          </div>
        </template>

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
          </UButtonGroup>
        </div>

        <!-- Users Table -->
        <div class="grid">
          <UTable
            :ui="{ root: 'horizontal-scrollbar' }"
            v-if="users"
            @select="
              (row) => {
                row.toggleSelected(!row.getIsSelected());
              }
            "
            ref="table"
            v-model:expanded="expanded"
            v-model:row-selection="rowSelection"
            :columns="columns"
            :data="users.data"
            :loading="tableLoading || status === 'pending'"
            empty="No users found"
          >
            <template #expanded="{ row: { original: user } }">
              <div class="grid">
                <div class="flex flex-wrap gap-2 items-center">
                  <div class="px-3 py-1">
                    <span class="flex items-center gap-2"
                      ><UIcon name="i-lucide-calendar-clock"></UIcon
                      >Registration Date</span
                    >
                    <div class="font-bold">
                      {{ new Date(user.createdAt).toDateString() }}
                    </div>
                  </div>
                  <div class="px-3 py-1">
                    <span class="flex items-center gap-2"
                      ><UIcon name="i-lucide-calendar-clock"></UIcon>Last
                      Update</span
                    >
                    <div class="font-bold">
                      {{ new Date(user.updatedAt).toDateString() }}
                    </div>
                  </div>

                  <UButton
                    @click="() => editRoleFor(user.id)"
                    class="px-4 shadow shadow-black/40"
                    >Modify Role</UButton
                  >
                </div>
              </div>
            </template>
          </UTable>
        </div>

        <!-- Role modification modal -->
        <UModal
          title="Modify"
          aria-describedby="role modification modal"
          description="assign role"
          v-model:open="modifyingRoleModalOpen"
          close
        >
          <template #body>
            <div class="space-y-3">
              <USelect
                class="w-full"
                v-model="newRole.role"
                :items="['none', 'doctor', 'client']"
              ></USelect>
              <UButton
                @click="submitModification"
                :loading="modifyingRole"
                class="shadow shadow-black/40"
                block
                icon="i-lucide-save"
                >Save Changes</UButton
              >
            </div>
          </template>
        </UModal>

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
import { UButton, UModal, USelect, USelectMenu } from "#components";
import type { TableColumn } from "@nuxt/ui";
import type { Column, Row } from "@tanstack/vue-table";
import type { Paginated } from "~/shared/types/pagination.types";
import type { UIUser } from "~/shared/types/users.types";

const authStore = useAuthStore();
const table = useTemplateRef("table");
const tableLoading = ref(false);

const deletingSelected = ref(false);

const searchQuery = ref("");
const currentPage = ref(1);
const limit = ref(10);
const reqFilters = ref<Record<string, string>>({});
const {
  data: users,
  status,
  refresh,
} = useFetch<Paginated<UIUser>>("/api/users", {
  query: {
    limit,
    page: currentPage,
    search: searchQuery,
    ...reqFilters.value,
  },
});

const expanded = ref<Record<number, boolean>>();
const rowSelection = ref<Record<number, boolean>>({});

const newRole = ref<{ user: string; role: string }>({ user: "", role: "" });

const modifyingRoleModalOpen = ref(false);
const modifyingRole = ref(false);

const editRoleFor = (id: string) => {
  const usr = users.value?.data?.find((usr) => usr.id === id);

  if (usr) {
    newRole.value = { user: usr.id, role: usr.role ?? "none" };
  }

  modifyingRoleModalOpen.value = true;
};

const submitModification = async () => {
  modifyingRole.value = true;
  const id: string = newRole.value.user;
  await $fetch(`/api/users/${id}`, {
    method: "PATCH",
    body: { role: newRole.value.role },
  })
    .then((res: any) => {
      useToast().add({
        title: "Success",
        description: res.message || "User's role modified",
        color: "success",
      });
      refresh();
      modifyingRoleModalOpen.value = false;
    })
    .catch((error) => {
      useToast().add({
        title: "Error",
        description:
          error?.response?._data?.message ||
          error.message ||
          "Failed to update user's role'",
        color: "error",
      });
    })
    .finally(() => {
      modifyingRole.value = false;
    });
};

// Table columns
const columns = shallowRef<TableColumn<UIUser>[]>([
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
    header: ({ column }) => sortableHeader(column, "Name"),
  },
  {
    accessorKey: "email",
    header: ({ column }) => sortableHeader(column, "Email"),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const color = {
        doctor: "info" as const,
        client: "neutral" as const,
      }[row.getValue("role") as string];

      return h(
        resolveComponent("UBadge"),
        { class: "capitalize", variant: "subtle", color },
        () => row.getValue("role")
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

function sortableHeader(column: Column<UIUser>, label: string) {
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

function getRowItems(row: Row<UIUser>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Copy user's ID",
      icon: "i-lucide-copy",
      onSelect() {
        navigator.clipboard.writeText(row.original.id);
        useToast().add({
          title: "Copied user's ID to clipboard!",
          color: "success",
          icon: "i-lucide-circle-check",
        });
      },
    },
    {
      type: "separator",
    },

    {
      type: "separator",
    },
    {
      label: "Delete user",
      icon: "i-lucide-trash",
      onSelect() {
        tableLoading.value = true;
        deleteUsers([row?.original?.id])
          .catch((error) => {
            useToast().add({
              title: "Failed",
              description: error.message || "Failed to delete user",
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
  const limit = Number(users.value?.limit ?? 10);
  const from = (Number(users.value?.page ?? 1) - 1) * limit + 1;
  const end = from + limit - 1;
  const total = Number(users.value?.total ?? 0);
  const to = end > total ? total : end;
  const pageCount = Math.ceil(total / limit);
  return { from, to, total, limit, pageCount };
});

const resetPage = () => {
  currentPage.value = 1;
};

const deleteUsers = async (ids: (string | number)[]) => {
  if (ids.length) {
    await $fetch("/api/users/delete-bulk", {
      method: "DELETE",
      body: {
        ids,
      },
    }).then((res) => {
      useToast().add({
        title: "Success",
        description:
          res.message ||
          `${ids.length ? "User" : "Users"} deleted successfully`,
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
  if (users.value?.data && ids.length) {
    deletingSelected.value = true;
    await deleteUsers(ids.map((index) => users.value!.data[Number(index)].id))
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
