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
    }
}

export default DateService;