<template>
  <div class="fixed inset-0 vertical-scrollbar p-2 flex flex-col">
    <!-- Router Viewport -->
    <div class="grow flex flex-col">
      <slot></slot>
    </div>

    <!-- Footer -->
    <Footer></Footer>
  </div>
</template>
