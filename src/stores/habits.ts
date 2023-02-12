import { defineStore } from 'pinia'
import { generateUniqueId, formatDate } from '@/func.js'
import { useLocalStorage, useStorage } from '@vueuse/core'
import { type habits } from '@/types/habits'

export const useStore = defineStore('habits', {
  state: () => {
    return {
      habits: useStorage('habits', {} as habits),
      activeHabits: useLocalStorage('activeHabits', [] as string[]),
      ongoingRequest: undefined,
    }
  },
  getters: {
    archivedHabitsGetter(state) {
      const archivedHabitsIds = Object.keys(state.habits).filter(habitId => state.habits[habitId].archived);
      return archivedHabitsIds || []
    },
    activeHabitsGetter(state) {
      const activeHabits = Object.keys(state.habits).filter(habitId => !state.habits[habitId].archived)
      return activeHabits || []
    }
  },
  actions: {
    cleanUpHabits() {
      console.log('remove habits from localStorage')
      this.habits = {};
      this.activeHabits = [];
    },
    async addHabit({ name = 'name', color = '#6eff2a', activeDays = Array(7).fill(false) }) {
      if (Object.keys(this.habits).length > 39) return;
      const id = generateUniqueId();
      const now = new Date();
      const createdAt = formatDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

      const habitData = {
        name: name,
        color: color,
        createdAt,
        selected: true,
        dates: {},
        archived: false,
        activeDays
      }

      this.habits[id] = habitData
      this.activeHabits.push(id);
   },

    async updateHabit(id: string, name: string, color: string) {
      this.habits[id].name = name
      this.habits[id].color = color
    },
    async deleteHabit(habitId) {
      const newActiveHabits = this.activeHabits.filter(id => id != habitId)
      this.activeHabits = newActiveHabits;
      delete this.habits[habitId]
    },

    async archiveHabit(habitId) {
      this.habits[habitId].archived = !this.habits[habitId].archived;
      this.activeHabits = Object.keys(this.habits).filter(s => !this.habits[s].archived)
    },
    async updateHabitStatus(date: string, habitId: null | string, state?: string) {
      if (new Date().getTime() < new Date(date).getTime()) return;

      if (state) {
        this.habits[habitId].dates[date] = state
      } else {

        if (this.habits[habitId].dates[date] == 1) {
          console.log('skip')
          this.habits[habitId].dates[date] = 2
        } else if (this.habits[habitId].dates[date] == 2) {
          console.log('delete')
          delete this.habits[habitId].dates[date];
        } else {
          console.log('clicked')
          this.habits[habitId].dates[date] = 1
        }
      }
    },
    successfulDays(habitId: string) {
      const dates = this.habits[habitId].dates;
      return Object.values(dates).filter(v => v).length;
    },
    totalHabitsCompletedInDay(date: string) {
      let count = 0;
     this.activeHabitsGetter.forEach(
        (habitId) => this.habits[habitId]?.dates[date] == 1 && count++
      );
      return count;
    },
    totalArchivedHabitsCompletedInDay(date: string) {
      let count = 0;
      
      this.archivedHabitsGetter.forEach(
        (habitId) => this.habits[habitId]?.dates[date] == 1 && count++
      );
      return count;
    },
    minDate(dates) {
      const keys = Object.keys(dates)
      if (typeof keys !== 'undefined' && keys.length > 0) {
        return keys.reduce(function(p, v) {
          const pd = new Date(p), vd = new Date(v)
          return (pd < vd ? pd : vd);
        });
      }
    },

    currentStreak(habitId: string) {
      const dates = this.habits[habitId]?.dates;
      let streak = 0;
      let undecided = true;
      let n = new Date(new Date().setDate(new Date().getDate() + 1));
      const min = new Date(this.minDate(dates));
      let key = '';
      while (min <= n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`
        if (!(key in dates) && undecided) continue
        if (!(key in dates) || (key in dates && dates[key] < 1)) break
        else {
          undecided = false
          streak++
        }
      }
      return streak
    },

    longestStreak(habitId: string) {
      const dates = this.habits[habitId]?.dates;
      let streak = 0;
      let max = 0;
      let n = new Date(new Date().setDate(new Date().getDate() + 1));
      const min = new Date(this.minDate(dates));
      let key = '';


      while (min < n) {
        n = new Date(n.setDate(n.getDate() - 1))
        key = `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`
        if (!(key in dates) || (key in dates && dates[key] !== 1 && dates[key] !== 2)) {
          max = streak > max ? streak : max
          streak = 0
        } else {
          streak++
        }
      }
      return max
    },
  },

})
