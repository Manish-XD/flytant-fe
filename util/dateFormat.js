function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const day = date.getUTCDate();
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day} ${month}, ${year}`;
}

export default formatDate;