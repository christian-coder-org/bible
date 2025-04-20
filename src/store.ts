import { reactive } from "vue";
import bibles from "./schema/bibles.json";

export const STORE = reactive({
  currentBible: { identifier: "kjv-pure-cambridge" },
  bibles: bibles,
});
