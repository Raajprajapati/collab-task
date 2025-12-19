
const formatTime = (date: Date | string | undefined | null) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = formattedDate.getMonth();
    const day = formattedDate.getDate();
    const hour = formattedDate.getHours();
    const minute = formattedDate.getMinutes();
    const second = formattedDate.getSeconds();

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export default formatTime;
