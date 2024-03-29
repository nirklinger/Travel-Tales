import { atom, selector, waitForAll } from 'recoil';
import { fetchTales, fetchTaleStory } from '../managers/tales-manager';
import {
  ActivityWithMediaWithCategories,
  CategoriesResponse,
  FetchedCategory,
  StoryResponse,
  Tale,
} from '../types/types';
import { fetchActivitiesCategories } from '../managers/activity-manager';
import { Categories } from '../types/db-schema-definitions';
import { fetchCategories } from '../managers/category-manager';

export const tales = selector<Tale[]>({
  key: 'tales',
  get: async ({ get }) => {
    const tales = await fetchTales();
    return tales;
  },
});

export const activitiesWithCategoriesSelector = selector<ActivityWithMediaWithCategories[]>({
  key: 'activitiesWithCategoriesSelector',
  get: async () => {
    const { activities } = await fetchActivitiesCategories();
    return activities;
  },
});

export const categoriesSelector = selector<FetchedCategory[]>({
  key: 'categoriesSelector',
  get: async () => {
    const { categories } = await fetchCategories();
    return categories;
  },
});

export const currentTaleIdState = atom<number>({
  key: 'currentTaleId',
  default: null,
});

export const shouldResetTalesState = atom<boolean>({
  key: 'shouldResetTalesState',
  default: false,
});

export const currentTale = selector<Tale>({
  key: 'currentTale',
  get: async ({ get }) => {
    const taleId = get(currentTaleIdState);
    const allTales = get(tales);
    return allTales.find(tale => tale.trip_id === taleId);
  },
});

export const currentTaleStory = selector<StoryResponse>({
  key: 'currentTaleStory',
  get: async ({ get }) => {
    const taleId = get(currentTaleIdState);
    if (taleId) return await fetchTaleStory(taleId);
  },
});

export const focusOnDestination = atom<number>({
  key: 'focusOnDestination',
  default: null,
});

export const focusOnActivity = atom<number>({
  key: 'focusOnActivity',
  default: null,
});
