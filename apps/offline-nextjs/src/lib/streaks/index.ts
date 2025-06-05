import dayjs, { type Dayjs } from "dayjs";

type ValideDate = Date;

type ShouldSkipDayParams = {
    // currentDate: Dayjs,
    // nextDate: Dayjs,
    // yesterday: Dayjs,
    tomorrow: Dayjs,
};

export function calculateStreaks({
    dates,
    enableLog = false,
    shouldSkipDay,
}: {
    dates: ValideDate[],
    enableLog?: boolean,
    shouldSkipDay?: (args: ShouldSkipDayParams) => boolean,
}): {
    currentStreak: number,
    longestStreak: number,
    streaks: number[],
} {
    if (!dates.length) return {
        streaks: [],
        longestStreak: 0,
        currentStreak: 0,
    };
    const validDates = dates.filter(date => dayjs(date).isValid()).map(date => dayjs(date));
    const sortedDates = sortDates(validDates);
    const streaks: number[] = [1];

    let isToday = false;
    let isYesterday = false;
    let isInFuture = false;

    for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = sortedDates[i];
        const nextDate = sortedDates[i + 1] ?? currentDate;

        const diff = nextDate.diff(currentDate, "day");

        const { today, yesterday } = relativeDates();

        isToday = isToday || currentDate.diff(today) === 0;
        isYesterday = isYesterday || currentDate.diff(yesterday) === 0;
        isInFuture = isInFuture || today.diff(currentDate) < 0;

        if (diff === 0) {
        } else {
            if (diff === 1) {
                ++streaks[streaks.length - 1]
            } else {
                const tomorrow = currentDate.add(1, "day");
                if (
                    typeof shouldSkipDay === "function"  && shouldSkipDay({ tomorrow }) 
                ) {
                    streaks[streaks.length - 1]++;
                    continue;
                }
                streaks.push(1);
            }
        }
    };

    return {
        streaks,
        longestStreak: Math.max(...streaks),
        currentStreak: 
        isToday || isYesterday ? streaks[streaks.length - 1] : 0,
    };

    function log(...args: unknown[]) {
        enableLog && console.log(...args);
    }
};


export function sortDates(dates: Dayjs[]): Dayjs[] {
    // TODO: remove duplicates;
    return dates.sort((a, b) => a.diff(b));
};

/*
    ! for debug only;
*/
function formatDate(date: Dayjs) { 
    return [date.format("dddd"), date.format("YYYY-MM-DD")].join(" | ");
}

function relativeDates() {
    return ({
        today: dayjs().startOf("day"), 
        yesterday: dayjs().subtract(1, "day").startOf("day"),
        tomorrow: dayjs().add(1, "day").startOf("day"),
    });
}