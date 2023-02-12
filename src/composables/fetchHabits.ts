import { db } from "@/firebase/config";
import { useStore } from "@/stores/habits";
import { type habits } from "@/types/habits";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { computed, ref, shallowRef } from "vue";

export default function useFetchHabits(uid: string) {
  const state = useStore();

  let habits = ref<habits>({});
  let activeHabits = ref<string[]>([]);
  let isLoading = ref<null | boolean>(null);
  let error = false;


  fetchHabits();

  async function fetchHabits() {
    if (!uid) return;
    isLoading.value = true;
    console.log("fetching");

    try {
      const re = doc(db, "users", uid);
      const docSnap = await getDoc(re);

      const unsub = onSnapshot(re, (doc) => {
        const data = doc.data();
        if (!data) return;
        isLoading.value = false;
        habits.value = { ...data.habits }
        activeHabits.value = data.activeHabits?.length ? data.activeHabits : [];
        state.habits = habits.value;
        state.activeHabits = activeHabits.value;
        // console.log("activeHabits", activeHabits);
        // habits.value = { ...habits.value };
        // activeHabits.value = activeHabits?.length ? activeHabits.split(",") : [];
      });
    } catch (e) {
      console.log(e)
    }

  }
  return {
    habits,
    activeHabits,
    isLoading
  }
}
