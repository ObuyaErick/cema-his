// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
  },
  nitro: {
    node: true,
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
    build: {
      sourcemap: false,
    },
    server: {
      watch: {
        ignored: ["**/infra/postgres/data/**"],
      },
    },
  },
  modules: [
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "system",
    fallback: "light",
  },
});
