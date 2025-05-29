<template>
  <ion-page id="main-content">
    <!----------------->
    <!-- PAGE header -->
    <!----------------->
    <ion-header :translucent="false">
      <!-------------------->
      <!-- BIBLE toolbar -->
      <!-------------------->
      <ion-toolbar style="height: 56px">
        <ion-buttons slot="start">
          <div style="font-size: x-large">vrs: {{ version }}</div>
        </ion-buttons>
        <ion-title style="font-size: x-large"
          ><!-- @vue-ignore -->{{ currentBible.title }}</ion-title
        >
        <ion-buttons slot="end">
          <ion-button @click="openModal"
            ><ion-icon
              slot="icon-only"
              :icon="bookOutline"
              size="large"
              style="margin-right: 10px"
          /></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <!------------->
    <!-- CONTENT -->
    <!------------->
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- SELECT TESTAMENT-->
      <div>
        <ion-segment :value="testament" @ion-change="segmentChanged($event)">
          <ion-segment-button value="old">
            <ion-label style="padding: 10px; font-size: x-large"
              >Old Testament</ion-label
            >
          </ion-segment-button>
          <ion-segment-button value="new">
            <ion-label style="padding: 10px; font-size: x-large"
              >New Testament</ion-label
            >
          </ion-segment-button>
        </ion-segment>
      </div>
      <br />
      <!-- LIST OF CHAPTERS -->
      <ion-list lines="inset" style="margin: 0px 25px 0px 20px">
        <!-- @vue-ignore -->
        <div
          v-for="(value, key, i) in currentBible[testament]"
          :key="key"
          @click="goToReaderPage(key.toString())"
        >
          <ion-item class="global-cursor-hover">
            <ion-label>
              <span style="font-size: x-large; color: grey">
                <!-- @vue-ignore -->{{ i + 1 }}) </span
              >&nbsp;&nbsp;
              <span style="font-size: x-large; color: grey">{{
                key
              }}</span></ion-label
            >
            <ion-icon
              style="color: grey"
              :icon="chevronForward"
              slot="end"
            ></ion-icon>
          </ion-item>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  modalController,
} from "@ionic/vue";
import { bookOutline, chevronForward } from "ionicons/icons";
import BIBLES from "../schema/bibles.json";
import { BiblesType } from "../interfaces";
import BibleModalPicker from "@/components/BibleModalPicker.vue";
import packageJson from "../../package.json";

const version = ref(packageJson.version);

// GET THE USER'S DEFAULT BIBLE IDENTIFIER FROM LOCALSTORAGE
const identifier = ref(
  localStorage.getItem("bibleIdentifier") || "kjv-pure-cambridge"
);

/**
 * COMPUTED: Set the user chosen bible and return the bible
 */
const currentBible = computed(() => {
  localStorage.setItem("bibleIdentifier", identifier.value);
  setOpen(false);
  const bibles: BiblesType = BIBLES;
  return reactive(bibles[identifier.value]);
});

// Used to display either the old or new testament
const testament = ref("new");

// USER SELECTS A DIFFERENT TESTAMENT
function segmentChanged(ev: any) {
  if (ev.detail.value === "new") testament.value = "new";
  else testament.value = "old";
}

// OPENS THE BIBLE PICKER MODAL
const isOpen = ref(false);
const setOpen = (open: boolean) => (isOpen.value = open);

// GO TO READER PAGE
const router = useRouter();
const goToReaderPage = (book: string) => {
  router.push({
    path: `/reader`,
    query: {
      identifier: identifier.value,
      book: book,
      testament: testament.value,
    },
  });
};

// CHAPTER MODAL PICKER
const openModal = async () => {
  const modal = await modalController.create({
    component: BibleModalPicker,
    componentProps: {
      identifier: identifier.value,
    },
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  if (role === "confirm") {
    if (data) identifier.value = data;
  }
};
</script>

<style scoped></style>
