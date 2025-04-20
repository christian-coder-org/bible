<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue";
</script>

<style lang="css">
/* This style can be used globally as class definitions, class="global-cursor-hover" */
.global-cursor-hover {
  cursor: pointer;
}
</style>
