import { PrismaTx } from "./types";

export const getTodos = async ({
  spaceId,
  tx,
  userId,
  versionAt,
}: {
  spaceId: string;
  userId: string;
  versionAt: string;
  tx: PrismaTx;
}) => {
  // Important: we need to make sure that the `spaceId` provided in the query is also owned by user
  const prismaTodoFindMany = await tx.todo.findMany({
    where: {
      AND: [
        { versionUpdatedAt: { gt: versionAt ?? 0 } },
        { spaceId },
        { space: { userId } },
      ],
    },
    select: {
      // --- PUBLIC ID ---
      todoId: true,
      // --- FIELDS ---
      isDeleted: true,
      selectedDays: true,
      name: true,
      sortOrder: true,
    },
  });

  return { data: prismaTodoFindMany };
};
