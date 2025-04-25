import type {
  AuthenticationContext,
  LoginSchema,
  RegistrationSchema,
} from "~/shared/types/auth.types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth: null as AuthenticationContext | null,
  }),

  getters: {
    loggedIn(state) {
      return !!state.auth;
    },
    user(state) {
      return state.auth?.principal;
    },
  },
  actions: {
    clear() {
      this.auth = null;
    },
    login(payload: LoginSchema) {
      return $fetch("/api/auth/login", { method: "POST", body: payload });
    },
    logout() {
      return $fetch("/api/auth/logout", { method: "POST" });
    },
    register(payload: RegistrationSchema) {
      return $fetch("/api/auth/register", { method: "POST", body: payload });
    },
  },
});
