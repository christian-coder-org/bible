<template>
  <ion-page id="main-content">
    <!----------------->
    <!-- PAGE header -->
    <!----------------->
    <ion-header :translucent="false">
      <!-------------------->
      <!-- READER toolbar -->
      <!-------------------->
      <ion-toolbar style="height: 56px">
        <ion-buttons slot="start">
          <ion-button @click="router.back()" style="height: 50px; width: 70px"
            ><ion-icon
              slot="icon-only"
              :icon="chevronBackOutline"
              size="large"
            ></ion-icon
          ></ion-button>
        </ion-buttons>
        <ion-title style="font-size: x-large">Verse comparison </ion-title>
      </ion-toolbar>

      <!---------------------->
      <!-- Book sub-toolbar -->
      <!---------------------->
      <ion-toolbar color="light">
        <ion-title> {{ book }} {{ chapter }}:{{ verse }}</ion-title>
      </ion-toolbar>
      <!---------------------->
      <!-- Focus sub-toolbar -->
      <!---------------------->
      <ion-toolbar
        color="light"
        style="padding-left: 10px; padding-right: 10px"
      >
        <div>
          <b>{{ focusVerse.bibleTitle }}</b>
        </div>
        <div class="chapter">{{ book }} {{ chapter }}:{{ verse }}</div>
        <div class="text-block">{{ focusVerse.verse }}</div>
      </ion-toolbar>
      <!------------------------>
      <!-- Pinned sub-toolbar -->
      <!------------------------>
      <ion-toolbar
        v-if="pinnedVerse"
        color="light"
        style="padding-left: 10px; padding-right: 10px"
      >
        <hr style="border-top: 1px black solid" />
        <div>
          <b>{{ pinnedVerse.bibleTitle }}</b>
        </div>
        <div class="chapter">{{ book }} {{ chapter }}:{{ verse }}</div>
        <div class="text-block">{{ pinnedVerse.verse }}</div>
      </ion-toolbar>
    </ion-header>
    <!------------->
    <!-- CONTENT -->
    <!------------->
    <ion-content v-show="verses">
      <br /><br />
      <ion-list lines="inset" style="margin: 0px 5px 0px 20px">
        <ion-item
          v-for="(value, key) in verses"
          :key="key"
          @click="setPinnedVerse(value)"
        >
          <span
            :style="
              pinnedVerse && pinnedVerse.bibleTitle === value.bibleTitle
                ? {
                    borderLeft: '2px solid grey',
                    margin: '8px',
                    padding: '5px',
                    borderRadius: '.8em',
                  }
                : { borderLeft: 'none' }
            "
          >
            <div>
              <b>{{ value.bibleTitle }}</b>
            </div>
            <div class="chapter">{{ book }} {{ chapter }}:{{ verse }}</div>
            <div class="text-block">{{ value.verse }}</div>
          </span>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonTitle,
  IonIcon,
  IonList,
  IonItem,
  onIonViewWillEnter,
} from "@ionic/vue";
import { chevronBackOutline } from "ionicons/icons";
import { useRouter, useRoute } from "vue-router";
import BIBLES from "../schema/bibles.json";

// GET QUERY PARAMS, SET REFS
const route = useRoute();
const router = useRouter();
const queryParams = route.query;

// SET REFS
const identifier = ref(queryParams.identifier);
const book = ref(queryParams.book);
const chapter = ref(queryParams.chapter);
const verse = ref(queryParams.verse);
const focusVerse = ref({}); // Must not be undefined
const pinnedVerse = ref(); // Must be undefine
const verses = ref([]);

// FETCH chapter verses when the chapter number changes
async function getChapterVerse(focusIdentifier, identifier, bibleTitle) {
  const path = `/chapters/${identifier}/${book.value}/${chapter.value}.json`;
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Fetch error status: ${response.status}`);
    }
    const data = await response.json();
    if (identifier === focusIdentifier) {
      focusVerse.value = { bibleTitle: bibleTitle, verse: data[verse.value] };
    } else {
      verses.value.push({ bibleTitle: bibleTitle, verse: data[verse.value] });
    }
    pinnedVerse.value = verses.value[0];
  } catch (error) {
    console.error("Fetching error:", error);
  }
}

async function getVerses() {
  for (const key in BIBLES) {
    await getChapterVerse(identifier.value, key, BIBLES[key].title);
  }
  verses.value = verses.value.sort((a, b) => (a.title > b.title ? -1 : 1));
}

function setPinnedVerse(value) {
  pinnedVerse.value = value;
}

onIonViewWillEnter(() => {
  getVerses();
});
</script>
