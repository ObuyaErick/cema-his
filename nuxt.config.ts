// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
    public: {
      apiBase: "/api",
    },
  },
  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "system",
    fallback: "light",
  },
});