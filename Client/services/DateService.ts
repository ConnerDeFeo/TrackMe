const DateService = {
    getCurrentDate: (): string => {
        const dateParts = new Date().toLocaleDateString().split('/');
        return `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
    },
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
    }
}

export default DateService;