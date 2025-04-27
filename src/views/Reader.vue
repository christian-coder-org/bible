<template>
  <ion-page id="main-content">
    <!----------------->
    <!-- PAGE header -->
    <!----------------->
    <ion-header :translucent="false">
      <!-------------------->
      <!-- READER toolbar -->
      <!-------------------->
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button @click="router.back()"
            ><ion-icon
              slot="icon-only"
              :icon="chevronBackOutline"
              size="large"
            ></ion-icon
          ></ion-button>
        </ion-buttons>
        <ion-title>{{ currentBible.title }} </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openModal"
            ><ion-icon
              slot="icon-only"
              :icon="documentTextOutline"
              size="large"
              style="margin-right: 10px"
          /></ion-button>
        </ion-buttons>
      </ion-toolbar>
      <!---------------------->
      <!-- Book sub-toolbar -->
      <!---------------------->
      <ion-toolbar color="light">
        <ion-title> {{ book }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <!------------->
    <!-- CONTENT -->
    <!------------->
    <br />
    <ion-content>
      <ion-list lines="inset" style="margin: 0px 5px 0px 20px">
        <ion-item
          v-for="(value, key) in verses"
          :key="key"
          @click="goToComparePage(key)"
        >
          <span>
            <div class="chapter">{{ book }} {{ chapter }}:{{ key }}</div>
            <div class="text-block">{{ value }}</div>
          </span>
          <ion-icon
            style="color: grey"
            :icon="chevronForward"
            slot="end"
          ></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
    <!------------>
    <!-- FOOTER -->
    <!------------>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button
            v-show="chapter > 1"
            style="cursor: pointer"
            @click="chapter--"
            ><ion-icon :icon="chevronBackOutline" size="large"></ion-icon
            >{{ chapter - 1 }}</ion-button
          >
        </ion-buttons>
        <ion-title> Chapter ({{ chapter }} of {{ chaptersCnt }}) </ion-title>
        <ion-buttons slot="end">
          <ion-button
            v-show="chapter < chaptersCnt"
            style="cursor: pointer"
            @click="chapter = chapter + 1"
            >{{ chapter + 1
            }}<ion-icon :icon="chevronForwardOutline" size="large"></ion-icon
          ></ion-button>
        </ion-buttons>
      </ion-toolbar> </ion-footer
  ></ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  onIonViewWillEnter,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonContent,
  IonFooter,
  modalController,
} from "@ionic/vue";
import { ref, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import {} from "vue-router";
import {
  chevronBackOutline,
  chevronForwardOutline,
  chevronForward,
  documentTextOutline,
} from "ionicons/icons";
import BIBLES from "../schema/bibles.json";
//import { BibleType } from "../interfaces";
import ChapterModalPicker from "@/components/ChapterModalPicker.vue";

// GET QUERY PARAMS, SET REFS
const route = useRoute();
const queryParams = route.query;

// SET REFS
const identifier = ref(queryParams.identifier);
const book = ref(queryParams.book);
// @ts-ignore
const currentBible = BIBLES[identifier.value];
const testament = ref(queryParams.testament);
const chaptersCnt = ref(currentBible[testament.value][book.value].chapterCnt);
const chapter = ref(0);
const verses = ref();

const router = useRouter(); // Page back button

// FETCH chapter verses when the chapter number changes
watch(chapter, async () => {
  const path = `/chapters/${identifier.value}/${book.value}/${chapter.value}.json`;
  fetch(path)
    .then((response) => response.text())
    .then((jsonString) => {
      verses.value = JSON.parse(jsonString);
      return reactive(verses);
    })
    .catch((error) => {
      console.error(102, error.message);
      return;
    });
});

// CHAPTER MODAL
const openModal = async () => {
  // Stop aria-hidden bug See Ionic GitHub issue link below
  // https://github.com/ionic-team/ionic-framework/issues/30040
  const activeElement = document.activeElement as HTMLElement;
  activeElement?.blur();

  const modal = await modalController.create({
    component: ChapterModalPicker,
    componentProps: {
      identifier: identifier.value,
      book: book.value,
      chaptersCnt: chaptersCnt.value,
    },
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  if (role === "confirm") {
    if (data) chapter.value = data;
  }
};

// GO TO COMPARE PAGE
const goToComparePage = (verse: number) => {
  router.push({
    path: `/compare`,
    query: {
      identifier: identifier.value,
      book: book.value,
      testament: testament.value,
      chapter: chapter.value,
      verse: verse,
    },
  });
};

onIonViewWillEnter(() => {
  // Set the starting chapter number and will fire the watcher
  chapter.value = 1;
});
</script>

<style lang="css">
.chapter {
  font-size: small;
  color: gray;
  margin-top: 5px;
}
.text-block {
  margin-left: 10px;
  padding-bottom: 10px;
}
</style>
