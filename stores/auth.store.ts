import type {
  AuthenticationContext,
  LoginSchema,
  RegistrationSchema,
} from "~/shared/types/auth.types";
import type { AlertResponse } from "~/shared/types/index.types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth: null as AuthenticationContext | null,
  }),

  getters: {
    loggedIn(state) {
      return !!state.auth;
    },
    name(state) {
      return state.auth?.name;
    },
    email(state) {
      return state.auth?.email;
    },
    role(state) {
      return state.auth?.role;
    },
    userId(state) {
      return state.auth?.id;
    },
    authClientId(state) {
      return state.auth?.authClientId;
    },
  },
  actions: {
    clear() {
      this.auth = null;
    },
    async fetchSession() {
      return await $fetch("/api/auth/session", { method: "GET" })
        .then((res) => {
          this.auth = res;
          return true;
        })
        .catch((_error) => false);
    },
    async login(payload: LoginSchema): Promise<AlertResponse> {
      return await $fetch("/api/auth/login", { method: "POST", body: payload })
        .then((res) => {
          return {
            message: res.message || "Logged in",
            status: "success",
          } as AlertResponse;
        })
        .catch((error) => {
          return {
            status: "error",
            message:
              error?.response?._data?.message ||
              error.message ||
              "Failed to login",
          } as AlertResponse;
        });
    },
    async logout(): Promise<AlertResponse> {
      return await $fetch("/api/auth/logout", { method: "POST" })
        .then((_res) => {
          this.clear();
          return {
            message: "Logged out",
            status: "success",
          } as AlertResponse;
        })

        .catch((error) => {
          return {
            status: "error",
            message:
              error?.respose?._data?.message ||
              error.message ||
              "Failed to logout",
          } as AlertResponse;
        });
    },
    async register(payload: RegistrationSchema): Promise<AlertResponse> {
      return await $fetch("/api/auth/register", {
        method: "POST",
        body: payload,
      })
        .then((res) => {
          return {
            message: res.message || "Registered successfully",
            status: "success",
          } as AlertResponse;
        })
        .catch((error) => {
          return {
            status: "error",
            message:
              error?.response?._data?.message ||
              error.message ||
              "Failed to register",
          } as AlertResponse;
        });
    },
  },
});
