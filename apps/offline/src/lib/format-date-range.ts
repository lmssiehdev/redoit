import { dayjs } from "@/lib/day";

export const isSameDay = (dateLeft: Date, dateRight: Date) => {
	return dayjs(dateLeft).isSame(dateRight, "day");
};

export const isSameYear = (dateLeft: Date, dateRight: Date) => {
	return dayjs(dateLeft).isSame(dateRight, "year");
};

export const isSameMonth = (dateLeft: Date, dateRight: Date) => {
	return dayjs(dateLeft).isSame(dateRight, "month");
};

export const format = (date: Date, formatString: string) => {
	return dayjs(date).format(formatString);
};

export const startOfDay = (date: Date) => {
	return dayjs(date).startOf("day").toDate();
};

export const startOfMonth = (date: Date) => {
	return dayjs(date).startOf("month").toDate();
};

export const endOfMonth = (date: Date) => {
	return dayjs(date).endOf("month").toDate();
};

export const endOfDay = (date: Date) => {
	return dayjs(date).endOf("day").toDate();
};

export const isSameMinute = (dateLeft: Date, dateRight: Date) => {
	return dayjs(dateLeft).isSame(dateRight, "minute");
};

export const startOfYear = (date: Date) => {
	return dayjs(date).startOf("year").toDate();
};

export const getQuarter = (date: Date) => {
	return dayjs(date).quarter();
};

export const startOfQuarter = (date: Date) => {
	return dayjs(date).startOf("quarter").toDate();
};

export const endOfQuarter = (date: Date) => {
	return dayjs(date).endOf("quarter").toDate();
};

export const endOfYear = (date: Date) => {
	return dayjs(date).endOf("year").toDate();
};

const shortenAmPm = (text: string): string => {
	const shortened = (text || "").replace(/ AM/g, "am").replace(/ PM/g, "pm");
	const withoutDoubleZero = shortened.includes("m")
		? shortened.replace(/:00/g, "")
		: shortened;
	return withoutDoubleZero;
};

const removeLeadingZero = (text: string): string => text.replace(/^0/, "");

export const formatTime = (date: Date, locale?: string): string => {
	return removeLeadingZero(
		shortenAmPm(
			date.toLocaleTimeString(locale, {
				hour: "2-digit",
				minute: "2-digit",
			}) || "",
		),
	);
};

const createFormatTime =
	(locale?: string) =>
	(date: Date): string =>
		formatTime(date, locale);

const getNavigatorLanguage = (): string => {
	if (typeof window === "undefined") {
		return "en-US";
	}
	return window.navigator.language;
};

export interface DateRangeFormatOptions {
	today?: Date;
	locale?: string;
	includeTime?: boolean;
	separator?: string;
}

export const formatDateRange = (
	from: Date,
	to: Date,
	{
		today = new Date(),
		locale = getNavigatorLanguage(),
		includeTime = true,
		separator = "-",
	}: DateRangeFormatOptions = {},
): string => {
	const sameYear = isSameYear(from, to);
	const sameMonth = isSameMonth(from, to);
	const sameDay = isSameDay(from, to);
	const thisYear = isSameYear(from, today);
	const thisDay = isSameDay(from, today);

	const yearSuffix = thisYear ? "" : `, ${format(to, "yyyy")}`;

	const formatTime = createFormatTime(locale);

	const startTimeSuffix =
		includeTime && !isSameMinute(startOfDay(from), from)
			? `, ${formatTime(from)}`
			: "";

	const endTimeSuffix =
		includeTime && !isSameMinute(endOfDay(to), to) ? `, ${formatTime(to)}` : "";

	// Check if the range is the entire year
	// Example: 2023
	if (
		isSameMinute(startOfYear(from), from) &&
		isSameMinute(endOfYear(to), to)
	) {
		return `${format(from, "yyyy")}`;
	}

	// Check if the range is an entire quarter
	// Example: Q1 2023
	if (
		isSameMinute(startOfQuarter(from), from) &&
		isSameMinute(endOfQuarter(to), to) &&
		getQuarter(from) === getQuarter(to)
	) {
		return `Q${getQuarter(from)} ${format(from, "yyyy")}`;
	}

	// Check if the range is across entire month
	if (
		isSameMinute(startOfMonth(from), from) &&
		isSameMinute(endOfMonth(to), to)
	) {
		if (sameMonth && sameYear) {
			// Example: January 2023
			return `${format(from, "MMMM yyyy")}`;
		}
		// Example: Jan - Feb 2023
		return `${format(from, "MMM")} ${separator} ${format(to, "MMM yyyy")}`;
	}

	// Range across years
	// Example: Jan 1 '23 - Feb 12 '24
	if (!sameYear) {
		return `${format(
			from,
			"MMM d ''yy",
		)}${startTimeSuffix} ${separator} ${format(
			to,
			"MMM d ''yy",
		)}${endTimeSuffix}`;
	}

	// Range across months
	// Example: Jan 1 - Feb 12[, 2023]
	if (!sameMonth) {
		return `${format(from, "MMM d")}${startTimeSuffix} ${separator} ${format(
			to,
			"MMM d",
		)}${endTimeSuffix}${yearSuffix}`;
	}

	// Range across days
	if (!sameDay) {
		// Check for a time suffix, if so print the month twice
		// Example: Jan 1, 12:00pm - Jan 2, 1:00pm[, 2023]
		if (startTimeSuffix || endTimeSuffix) {
			return `${format(from, "MMM d")}${startTimeSuffix} ${separator} ${format(
				to,
				"MMM d",
			)}${endTimeSuffix}${yearSuffix}`;
		}

		// Example: Jan 1 - 12[, 2023]
		return `${format(from, "MMM d")} ${separator} ${format(
			to,
			"d",
		)}${yearSuffix}`;
	}

	// Same day, different times
	// Example: Jan 1, 12pm - 1pm[, 2023]
	if (startTimeSuffix || endTimeSuffix) {
		// If it's today, don't include the date
		// Example: 12:30pm - 1pm
		if (thisDay) {
			return `${formatTime(from)} ${separator} ${formatTime(to)}`;
		}

		// Example: Jan 1, 12pm - 1pm[, 2023]
		return `${format(
			from,
			"MMM d",
		)}${startTimeSuffix} ${separator} ${formatTime(to)}${yearSuffix}`;
	}

	// Full day
	// Example: Fri, Jan 1[, 2023]
	return `${format(from, "eee, MMM d")}${yearSuffix}`;
};
