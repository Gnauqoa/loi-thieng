import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/vi"; // Import Vietnamese locale

// Extend Day.js with plugins
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Set locale to Vietnamese
dayjs.locale("vi");

export default dayjs;
