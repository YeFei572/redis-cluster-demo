interface CheckIn {
    address: string;
    date: string;
}
interface UserCheckInMap {
    oneDayUsers: string[];
    twoDaysUsers: string[];
    threeDaysUsers: string[];
    fourDaysUsers: string[];
}

export { CheckIn, UserCheckInMap };