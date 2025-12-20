
const formatTime = (date: Date | string | undefined | null) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = formattedDate.getMonth();
    const day = formattedDate.getDate();
    const hour = formattedDate.getHours();
    const minute = formattedDate.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hours = hour % 12;

    return `${year}-${month}-${day} ${hours.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

export default formatTime;
