const DateService = {
    getCurrentDate: (): string => {
        const dateParts = new Date().toLocaleDateString().split('/');
        return `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
    }
}

export default DateService;