<template>
  <!----------------->
  <!-- PAGE header -->
  <!----------------->
  <ion-header>
    <ion-toolbar style="height: 56px">
      <ion-buttons slot="start">
        <ion-button @click="cancel" style="font-size: x-large"
          >Cancel</ion-button
        >
      </ion-buttons>
      <ion-title style="font-size: x-large">Select Bible</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <!-- LIST OF BIBLES -->
    <ion-list lines="inset">
      <div v-for="(value, key) in bibles" :key="key">
        <ion-item @click="confirm(key)" class="global-cursor-hover">
          <ion-icon
            v-if="identifier === key"
            style="color: grey"
            :icon="bookOutline"
            slot="start"
          ></ion-icon>
          <ion-icon
            v-else
            style="color: grey"
            :icon="chevronBack"
            slot="start"
          ></ion-icon>
          <ion-label
            ><div style="font-size: x-large">{{ value.title }}</div>
          </ion-label>
        </ion-item>
      </div>
    </ion-list>
  </ion-content>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {} from "@ionic/vue";
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonHeader,
  IonButtons,
  IonButton,
  IonToolbar,
  IonTitle,
  IonContent,
  modalController,
} from "@ionic/vue";
import { chevronBack, bookOutline } from "ionicons/icons";
import BIBLES from "../schema/bibles.json";

const props = defineProps(["identifier"]);
const identifier = ref(props.identifier);
const bibles = ref(BIBLES);

// GET THE USER'S DEFAULT BIBLE IDENTIFIER FROM LOCALSTORAGE
/*const identifierStored = ref(
  localStorage.getItem("bibleIdentifier") || "kjv-pure-cambridge"
);*/

// v-model FROM PARENT
//const identifier = defineModel();

/*function changeBible(identifierParam: string) {
  identifier.value = identifierParam;
}*/

const cancel = () => modalController.dismiss(null, "cancel");
const confirm = (identifier: string) =>
  modalController.dismiss(identifier, "confirm");
</script>
