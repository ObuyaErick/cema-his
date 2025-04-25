<template>
  <NuxtRouteAnnouncer />
  <UApp
    :toaster="{
      duration: 5000,
      position: 'top-center',
      expand: false,
    }"
    ><div data-vaul-drawer-wrapper>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>
