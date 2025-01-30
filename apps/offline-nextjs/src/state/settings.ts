import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
	confettiEnabled: boolean;
	countSkippedDaysInStreak: boolean;
};

type Actions = {
	toggleConfetti: (value: boolean) => void;
	setCountSkippedDaysInStreak: (value: boolean) => void;
};

export const useSettingsStore = create<State & Actions>()(
	immer(
		persist(
			(set) => ({
				confettiEnabled: true,
				countSkippedDaysInStreak: false,
				toggleConfetti: (value) =>
					set((state) => {
						state.confettiEnabled = value;
					}),
				setCountSkippedDaysInStreak: (value) =>
					set((state) => {
						state.countSkippedDaysInStreak = value;
					}),
			}),
			{
				name: "settings",
			},
		),
	),
);
