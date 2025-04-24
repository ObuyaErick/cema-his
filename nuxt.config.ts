// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    apiSecret: "123",
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
  ],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "system",
    fallback: "light",
  },
});
