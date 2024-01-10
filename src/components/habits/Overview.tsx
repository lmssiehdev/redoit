import { useHabit } from "@/context/HabitProvider";
import { useCalculateStreak } from "@/hooks/useCalculateStreak";
import { differenceInDays, sortDates } from "@/utils/calculateStreak";
import { CheckFat, Lightning, Percent } from "@phosphor-icons/react";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import dayjs from "dayjs";
import { useMemo } from "react";

function LightenDarkenColor(color: string, percent: number) {
  let usePound = false;

  if (color[0] == "#") {
    color = color.slice(1);
    usePound = true;
  }

  const num = parseInt(color, 16);

  let r = (num >> 16) + percent;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00ff) + percent;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000ff) + percent;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}
function lightOrDark(color: any) {
  let r, g, b, hsp;

  if (color.match(/^rgb/)) {
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  return hsp > 190 ? "light" : "dark";
}
function convertHex(hexCode: string, opacity = 1) {
  let hex = hexCode.replace("#", "");

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) {
    opacity = opacity / 100;
  }

  return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
}
export function Overview({ color }: { color: string }) {
  const { completedDates } = useHabit();

  const { currentStreak, longestStreak } = useCalculateStreak(completedDates);
  const obj = useMemo(() => {
    function percentage(partialValue: number, totalValue: number) {
      return ((100 * partialValue) / totalValue).toFixed() + "%";
    }
    const successfulDays = Object.values(completedDates).filter(
      (v) => v === "checked",
    ).length;
    const completionRate = () => {
      const sortedDates = sortDates(
        Object.keys(completedDates).map((d) => dayjs(d).toDate()),
      );
      const difference = differenceInDays(new Date(), sortedDates[0]);
      return percentage(successfulDays, difference);
    };
    return [
      {
        name: "Current Streak",
        value: currentStreak,
        Icon: Lightning,
      },
      {
        name: "Longest Streak",
        value: longestStreak,
        Icon: CalendarBlank,
      },
      {
        name: "Successful",
        value: successfulDays,
        Icon: CheckFat,
      },
      {
        name: "Completion Rate",
        value: completionRate(),
        Icon: Percent,
      },
    ];
  }, [completedDates]);

  const styles = useMemo(() => {
    let backgroundColor = LightenDarkenColor(color, 60);
    backgroundColor = convertHex(color, 0.4);
    if (lightOrDark(color) == "light") {
      backgroundColor = LightenDarkenColor(color, -50);
      backgroundColor = convertHex(color, 0.8);
    }
    return {
      color,
      backgroundColor,
    };
  }, [color]);

  return (
    <>
      <div className="mb-10 grid grid-cols-2 gap-2">
        {obj.map((data) => {
          const { name, value, Icon } = data;
          return (
            <div
              className="relative flex flex-1 items-center overflow-hidden rounded p-2 text-sm"
              style={{
                ...styles,
              }}
            >
              <div className="absolute -right-5 mr-4 flex h-auto rounded-full p-3 ">
                <Icon
                  size={38}
                  weight="bold"
                  className="rotate-[-30deg] scale-[2] opacity-30"
                />
              </div>
              <div className="font-varela-round">
                <span className="font-bold">{name}</span>
                <div>
                  <span className="font-bold">{value}</span>
                  <span className="text-sm"> </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
