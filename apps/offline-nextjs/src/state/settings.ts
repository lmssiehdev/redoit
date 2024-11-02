import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
	confettiEnabled: boolean;
	darkModeEnabled: boolean;
};

type Actions = {
	toggleConfetti: (value: boolean) => void;
	toggleDarkMode: (value: boolean) => void;
};

export const useSettingsStore = create<State & Actions>()(
	immer(
		persist(
			(set) => ({
				confettiEnabled: true,
				darkModeEnabled: false,
				toggleConfetti: (value) =>
					set((state) => {
						state.confettiEnabled = value;
					}),
				toggleDarkMode: (value) =>
					set((state) => {
						state.darkModeEnabled = value;
					}),
			}),
			{
				name: "settings",
			},
		),
	),
);
