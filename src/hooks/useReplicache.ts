import { useEffect, useState } from "react";
import {
  Replicache,
  type ReadonlyJSONValue,
  type WriteTransaction,
} from "replicache";

type MutatorArgs = Record<string, any>;

type MutatorsParams = {
  tx: WriteTransaction;
  args: MutatorArgs;
  spaceId: string;
};

const MutationsTodoCreate = async ({ tx, args, spaceId }: MutatorsParams) => {
  const key = `${spaceId}/todo/${args.todoId}`;

  if (await tx.has(key)) throw new Error("Todo already exists");

  const todos = await MutationsTodoGet({ tx, args, spaceId });

  return await tx.put(key, { ...args, sortOrder: todos?.length });
};

const MutationsTodoDelete = async ({ tx, args, spaceId }: MutatorsParams) =>
  await tx.del(`${spaceId}/todo/${args}`);

const MutationsTodoGet = async ({ tx, args, spaceId }: MutatorsParams) =>
  await tx
    .scan({ prefix: `${spaceId}/todo/` })
    .values()
    .toArray();

const MutationsTodoUpdate = async ({ tx, args, spaceId }: MutatorsParams) => {
  const key = `${spaceId}/todo/${args.todoId}`;

  const prev = ((await tx.get(key)) as Record<string, any>) ?? {};

  return await tx.put(key, { ...prev, ...args });
};

const deleteHabitMutation = async ({ tx, args, spaceId }: MutatorsParams) =>
  await tx.del(`${spaceId}/habit/${args}`);

const getHabitsMutation = async ({ tx, args, spaceId }: MutatorsParams) =>
  await tx
    .scan({ prefix: `${spaceId}/habit/` })
    .values()
    .toArray();

const createHabitMutation = async ({ tx, args, spaceId }: MutatorsParams) => {
  const key = `${spaceId}/habit/${args.todoId}`;

  if (await tx.has(key)) throw new Error("Habit already exists");

  const habits = await getHabitsMutation({ tx, args, spaceId });

  return await tx.put(key, { ...args, sortOrder: habits?.length });
};

const updateHabitMutation = async ({ tx, args, spaceId }: MutatorsParams) => {
  const key = `${spaceId}/habit/${args.todoId}`;

  const prev = ((await tx.get(key)) as Record<string, any>) ?? {};

  return await tx.put(key, { ...prev, ...args });
};

// * find a way to infer the types directly without TS crying
type Mutators = {
  create: (tx: WriteTransaction, args: MutatorArgs) => Promise<void>;
  delete: (tx: WriteTransaction, args: MutatorArgs) => Promise<boolean>;
  get: (
    tx: WriteTransaction,
    args: MutatorArgs
  ) => Promise<ReadonlyJSONValue[]>;
  update: (tx: WriteTransaction, args: MutatorArgs) => Promise<void>;
};

export const useReplicache = ({
  spaceId,
  userId,
}: {
  spaceId: string | null;
  userId: string | null;
}) => {
  const [rep, setRep] = useState<Replicache<Mutators> | null>(null);

  useEffect(() => {
    if (userId && spaceId) {
      const mutators = {
        create: (tx: WriteTransaction, args: MutatorArgs) =>
          createHabitMutation({ tx, args, spaceId }),
        delete: (tx: WriteTransaction, args: MutatorArgs) =>
          deleteHabitMutation({ tx, args, spaceId }),
        get: (tx: WriteTransaction, args: MutatorArgs) =>
          getHabitsMutation({ tx, args, spaceId }),
        update: (tx: WriteTransaction, args: MutatorArgs) =>
          updateHabitMutation({ tx, args, spaceId }),
      };

      console.log(`${userId}/${spaceId}`);
      const r = new Replicache({
        logLevel: "debug",
        name: `${userId}/${spaceId}`,
        licenseKey:
          "l00000000000000000000000000000001" ??
          process.env.NEXT_PUBLIC_REPLICACHE!,
        pushURL: `/api/replicache/push?spaceId=${spaceId}`,
        pullURL: `/api/replicache/pull?spaceId=${spaceId}`,
        mutators,
        // added some delay to prevent spamming the DB in case of an error
        // you should delete this if you want to sync as soon as possible
      });

      // // This gets called when the push/pull API returns a `401`.
      // r.getAuth = () => {u
      //   // resetAccount({ setSpaceId, setUserId });

      //   // router.push("/login");

      //   return undefined;
      // };

      r.clientGroupID.then(console.log);
      r.clientID.then(console.log);
      setRep(r);

      return () => void r.close();
    }
  }, [spaceId, userId]);

  return { data: rep };
};

export type ReplicacheInstanceType = ReturnType<typeof useReplicache>;
