import { Habit } from "@/utils/habits";
import { type WriteTransaction } from "replicache";

export const mutators = {
  createHabit,
  deleteHabit,
  markHabit,
  updateHabit,
};

export async function createHabit(
  tx: WriteTransaction,
  args: Habit.Definition
) {
  const { id, archived, color, completedDates, frequency, name } = args;

  const key = `habit/${id}`;
  await tx.put(key, { id, archived, color, completedDates, frequency, name });
}

export async function deleteHabit(tx: WriteTransaction, id: string) {
  await tx.del(id);
}

export async function updateHabit(
  tx: WriteTransaction,
  {
    id,
    args,
  }: {
    id: string;
    args: Partial<Habit.Definition>;
  }
) {
  await tx.put(id, args);
}

export async function markHabit(
  tx: WriteTransaction,
  {
    id,
    args,
  }: {
    id: string;
    args: {
      dateId: string;
      status: "checked" | "skipped";
    };
  }
) {
  const status = args.status;
  await tx.put(args.dateId, status);
}
