import NotFound from '@/views/404.vue'
import HabitPage from '@/views/AppHabitPage.vue'
import Archive from '@/views/Archive.vue'
import MainPage from '@/views/MainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
  name: 'My Habits',
  path: '/',
  component: MainPage
},
{
  name: 'Habit',
  path: '/habit/:id',
  component: HabitPage
},
{
  name: 'Archive',
  path: '/archive',
  component: Archive
},
{
  name: 'HabitPage',
  path: '/habit/:id',
  component: HabitPage,
},
{
  name: '404!',
  path: '/:pathMatch(.*)*',
  component: NotFound,
}
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (typeof to.name === 'string') document.title = to.name
  else document.title = 'REDOIT!';
  window.scroll(0, 0)
  next();
});
