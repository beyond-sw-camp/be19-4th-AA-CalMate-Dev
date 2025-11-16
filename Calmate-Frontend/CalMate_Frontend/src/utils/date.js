const DEFAULT_TIME_ZONE = 'Asia/Seoul';

const extractPart = (parts, type) =>
  parts.find((part) => part.type === type)?.value ?? '';

export const getYearMonthString = (date = new Date(), timeZone = DEFAULT_TIME_ZONE) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const year = extractPart(parts, 'year');
    const month = extractPart(parts, 'month');
    if (year && month) {
      return `${year}-${month}`;
    }
  } catch (error) {
    // Intl API should always be available in target browsers, but fall back just in case.
    console.warn('[date] Failed to format year-month with Intl:', error);
  }

  const zonedDate = new Date(
    date.toLocaleString('en-US', {
      timeZone,
    }),
  );
  const year = zonedDate.getFullYear();
  const month = String(zonedDate.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getCurrentYearMonthInKst = () => getYearMonthString(new Date(), DEFAULT_TIME_ZONE);
