<template>
  <div class="grow flex flex-col items-center justify-center">
    <UCard
      class="w-full max-w-sm"
      :ui="{
        body: 'space-y-3',
      }"
    >
      <h3>Register Now</h3>
      <RegisterForm />
    </UCard>
  </div>
</template>

<script setup lang="ts"></script>
