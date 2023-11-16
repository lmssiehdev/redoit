import { PrismaTx } from "./types";
import { getErrorMessage } from "@/utils/misc";

export type MutationArgs = {
  args: Record<string, any>;
  spaceId: string;
  tx: PrismaTx;
  versionNext: number;
};

export const mutationsApi = async ({
  lastMutationId,
  mutations,
  spaceId,
  tx,
  versionNext,
}: {
  lastMutationId: number;
  mutations: any;
} & Omit<MutationArgs, "args">) => {
  let nextMutationId = lastMutationId;

  for await (const mutation of mutations) {
    // Verify before processing mutation
    if (mutation.id < nextMutationId + 1) {
      console.log(
        `Mutation ${mutation.id} has already been processed - skipping`
      );
      continue;
    }

    if (mutation.id > nextMutationId + 1) {
      console.warn(`Mutation ${mutation.id} is from the future - aborting`);
      break;
    }

    try {
      console.log(
        "Processing mutation",
        nextMutationId + 1,
        JSON.stringify(mutation)
      );

      if (mutation.name === "create")
        await createMutations({
          args: mutation.args,
          spaceId,
          tx,
          versionNext,
        });
      else if (mutation.name === "update")
        await updateMutations({
          args: mutation.args,
          spaceId,
          tx,
          versionNext,
        });
      else if (mutation.name === "delete")
        await deleteMutations({
          args: mutation.args,
          spaceId,
          tx,
          versionNext,
        });

      // Only increase mutation id upon successful mutation
      nextMutationId++;
    } catch (err) {
      console.error(err);
    }
  }

  return { data: nextMutationId };
};

export const deleteMutations = async ({
  args,
  spaceId,
  tx,
  versionNext,
}: MutationArgs) => {
  try {
    await tx.todo.updateMany({
      where: { AND: [{ todoId: args }, { spaceId }] },
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        // --- FIELDS ---
        isDeleted: true,
      },
    });
  } catch (err) {
    console.error(getErrorMessage(err));
  }

  return;
};

export const createMutations = async ({
  args,
  spaceId,
  tx,
  versionNext,
}: MutationArgs) => {
  const prismaTodoFindUnique = await tx.todo.findUnique({
    where: { todoId: args.todoId },
  });

  if (prismaTodoFindUnique) return;

  // Update sort order
  const count = await tx.todo.count({
    where: { AND: [{ isDeleted: false }, { spaceId }] },
  });

  try {
    await tx.todo.create({
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        // --- RELATIONS ---
        space: { connect: { spaceId } },
        // --- FIELDS ---
        ...args,
        sortOrder: count,
      },
      select: { todoId: true },
    });
  } catch (err) {
    console.error(getErrorMessage(err));
  }

  return;
};

export const updateMutations = async ({
  args,
  spaceId,
  tx,
  versionNext,
}: MutationArgs) => {
  try {
    await tx.todo.update({
      where: { todoId: args.todoId },
      data: {
        // --- SYSTEM ---
        versionUpdatedAt: versionNext,
        // --- RELATIONS ---
        space: { connect: { spaceId } },
        // --- FIELDS ---
        ...args,
      },
      select: { todoId: true },
    });
  } catch (err) {
    console.error(getErrorMessage(err));
  }

  return;
};
