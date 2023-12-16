import { PrismaTx } from "@/utils/api/replicache/types";
import { Habit } from "@/utils/habits";

export async function deleteHabit({
  tx,
  args,
  nextVersion,
  spaceId,
}: {
  tx: PrismaTx;
  args: string;
  nextVersion: number;
  spaceId: string;
}) {
  await tx.habit.update({
    where: {
      // ! Temp
      id: args.replace("habit/", ""),
      AND: [{ spaceId }],
    },
    data: {
      version: nextVersion,
      deleted: true,
    },
  });
  return;
}
export async function markHabit({
  tx,
  args: { id, args },
  nextVersion,
  spaceId,
}: {
  tx: PrismaTx;
  args: {
    id: string;
    args: {
      dateId: string;
      status: "skipped" | "completed";
    };
  };
  nextVersion: number;
  spaceId: string;
}) {
  const { status, dateId } = args;
  const tempArr = (dateId as string).split("/");
  const date = tempArr[tempArr.length - 1];
  const habitId = id.replace("habit/", "");

  await tx.completedDate.upsert({
    where: { habitId_date: { date: date, habitId } },
    update: {
      status,
      deleted: false,
      version: nextVersion,
    },
    create: {
      id: dateId,
      status,
      habitId,
      date,
      deleted: false,
      version: nextVersion,
    },
  });
}
export async function deleteDate({
  tx,
  args,
  nextVersion,
  spaceId,
}: {
  tx: PrismaTx;
  args: {
    habitId: string;
    dateId: string;
  };
  nextVersion: number;
  spaceId: string;
}) {
  const { habitId, dateId } = args;

  const tempArr = (dateId as string).split("/");
  const date = tempArr[tempArr.length - 1];

  await tx.completedDate.update({
    where: {
      habitId_date: {
        date,
        habitId: habitId.replace("habit/", ""),
      },
    },
    data: {
      version: nextVersion,
      deleted: true,
    },
  });
  return;
}
export async function createHabit({
  tx,
  args,
  nextVersion,
  spaceId,
}: {
  tx: PrismaTx;
  args: Habit.Definition;
  nextVersion: number;
  spaceId: string;
}) {
  const { completedDates, ...rest } = args;

  await tx.habit.create({
    data: {
      version: nextVersion,
      spaceId,
      ...rest,
      id: args.id,
      // space: {
      //   connect: {
      //     spaceId,
      //   },
      // },
      deleted: false,
    },
  });
  return;
}
