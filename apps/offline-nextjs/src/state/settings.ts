import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
	confettiEnabled: boolean;
};

type Actions = {
	toggleConfetti: (value: boolean) => void;
};

export const useSettingsStore = create<State & Actions>()(
	immer(
		persist(
			(set) => ({
				confettiEnabled: true,
				toggleConfetti: (value) =>
					set((state) => {
						state.confettiEnabled = value;
					}),
			}),
			{
				name: "settings",
			},
		),
	),
);
