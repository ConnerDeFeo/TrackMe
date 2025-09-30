const DateService = {
    getCurrentDate: (): string => {
        return new Date().toLocaleDateString().split('/').join('-');
    }
}

export default DateService;