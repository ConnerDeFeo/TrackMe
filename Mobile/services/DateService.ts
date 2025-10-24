const DateService = {
    // Get the Sunday of the current week
    getSunday: (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    },
    // Get the Saturday of the current week
    getSaturday: (sunday: Date) => {
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        return saturday;
    },
    formatDate: (date: Date): string => {
        const dateParts = date.toLocaleDateString().split('/');
        return `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
    },
    getDaysInMonth: (monthYear: Date) => {
        const year = monthYear.getFullYear();
        const month = monthYear.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        // Add empty cells for days before the month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        // Add the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    },
    addMonths: (date: Date, months: number): Date => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    },
    formateSecondsToTimeString: (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.round((totalSeconds % 60) * 1000) / 1000;
        const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
        return minutes > 0 ? `${minutes}:${displaySeconds}` : `${seconds}s`;
    }
};

export default DateService;