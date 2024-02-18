import { parse } from 'date-fns';

export const parseDateWithMultipleFormats = dateStr => {
    const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd-MM-yyyy', 'MMMM dd, yyyy', 'yyyy/MM/dd'];
    for (let format of formats) {
      try {
        const parsedDate = parse(dateStr, format, new Date());
        if (!isNaN(parsedDate)) return parsedDate;
      } catch (e) {
        throw new Error("Unavailable format")
      }
    }
    return dateStr === "NULL" ? new Date() : null;
  };