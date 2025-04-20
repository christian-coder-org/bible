<template>
  <ion-picker>
    <ion-picker-column value="javascript">
      <div slot="prefix">Chapter</div>

      <ion-picker-column-option v-for="n in 10" :key="n" value="n">{{
        n
      }}</ion-picker-column-option>
    </ion-picker-column>
  </ion-picker>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {} from "@ionic/vue";
import { IonPicker, IonPickerColumn, IonPickerColumnOption } from "@ionic/vue";

const selectedChapter = ref();

const props = defineProps(["book", "chaptersCnt"]);
// v-model FROM PARENT
const chapter = defineModel();

function changeChapter(selectedChapter: string) {
  chapter.value = selectedChapter.value;
}
</script>
