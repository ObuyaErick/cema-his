<template>
  <div class="grow flex flex-col items-center justify-center">
    <UCard
      class="w-full max-w-sm"
      :ui="{
        body: 'space-y-3',
      }"
    >
      <h3>Welcome Back</h3>
      <LoginForm @success="navigateTo('/')" />

      <UButton
        to="/"
        block
        size="xl"
        variant="outline"
        color="neutral"
        icon="i-lucide-home"
        >Go Home</UButton
      >
    </UCard>
  </div>
</template>
