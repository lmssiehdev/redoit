"use client";

import { useDateNavigator } from "@/hooks/useDayNavigation";
import { useReplicache } from "@/hooks/useReplicache";
import { generateId } from "@/utils/misc";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type ReadTransaction } from "replicache";
import { useSubscribe } from "replicache-react";

type Habit = {
  todoId: string;
  isDeleted: boolean;
  name: string;
  selectedDays: Record<string, boolean>;
};

export default function Home() {
  const cookies = useCookies();

  // const [userId, setUserId] = useState<string | null>(null);
  // const [spaceId, setSpaceId] = useState<string | null>(null);

  // useEffect(() => {}, []);
  const userId = cookies.get("userId") ?? null;
  const spaceId = cookies.get("spaceId") ?? null;

  console.log({ userId, spaceId });
  const { data: rep } = useReplicache({
    userId,
    spaceId,
  });
  console.log(rep);

  // usePokeListener({ rep });

  return (
    <div>
      <Todos rep={rep} spaceId={spaceId} />
    </div>
  );
}

function Todos({ rep, spaceId }) {
  const { dateArray: week } = useDateNavigator();

  const todos = useSubscribe(
    rep,
    async (tx: ReadTransaction) => {
      const result = await tx.scan({ prefix: `${spaceId}/habit` }).toArray();
      console.log({ result, spaceId });
      return result;
    },
    [rep]
  );

  async function handleAddTodo(name: string) {
    const todoId = generateId();
    await rep?.mutate.create({
      todoId,
      isDeleted: false,
      name: name,
      selectedDays: {},
    });
  }

  async function updateHabitStatus(todo: any, date: string) {
    const selectedDays = Object.assign({}, todo.selectedDays);

    console.log(selectedDays[date]);
    if (selectedDays[date]) delete selectedDays[date];
    else selectedDays[date] = true;

    await rep?.mutate.update({ ...todo, selectedDays });
  }

  async function deleteHabit(habitId: string) {
    await rep.mutate.delete(habitId);
  }

  return (
    <div className="gap-2">
      {todos
        ?.sort((a, b) => a.sortOrder - b.sortOrder)
        ?.map((todo) => (
          <div>{JSON.stringify(todo?.name)}</div>
        ))}
      <AddTodoInput addTodo={handleAddTodo} />
      <div className="flex flex-col gap-2 mt-2">
        {todos?.some((x) => x)
          ? todos
              ?.sort((a, b) => a.sortOrder - b.sortOrder)
              ?.map((todo) => (
                <HabitItem
                  key={todo.id}
                  habit={todo}
                  week={week}
                  updateHabitStatus={updateHabitStatus}
                  deleteHabit={deleteHabit}
                />
              ))
          : null}
      </div>
    </div>
  );
}

function AddTodoInput({ addTodo }: { addTodo: (name: string) => void }) {
  const [habitName, setHabitName] = useState("");

  return (
    <form
      className="flex gap-2 items-center"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("I've been called");
        addTodo(habitName);
      }}
    >
      <input
        type="text"
        value={habitName}
        onChange={({ target }) => setHabitName(target.value)}
        maxLength={40}
      ></input>
      <button type="submit" className="whitespace-nowrap block w-fit">
        Add Habit
      </button>
    </form>
  );
}

function HabitItem({
  habit,
  week,
  updateHabitStatus,
  deleteHabit,
}: {
  habit: Habit;
  updateHabitStatus: (habit: Habit, date: string) => void;
  deleteHabit: (habitId: string) => void;
  week: string[];
}) {
  return (
    <div className="grid grid-cols-[1.5fr_3fr] gap-5 items-center ">
      <div className="flex items-center justify-between">
        <span>{habit.name}</span>
        <button
          onClick={() => deleteHabit(habit.todoId)}
          className=" text-red-700"
        >
          x
        </button>
      </div>
      <div className="flex gap-2 items-center flex-1 justify-between">
        {week.map((weekDay) => (
          <div
            onClick={() => updateHabitStatus({ ...habit }, weekDay)}
            key={weekDay}
            className="border-dashed border-[1px] border-black/60 text-white h-7 w-7"
            style={{
              backgroundColor: habit.selectedDays?.[weekDay] ? "#B5D6B8" : "",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
