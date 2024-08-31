// src/utils/formatDate.js
import { format } from 'date-fns';

export const formatDate = (datetime) => {
  return format(new Date(datetime), 'dd-MM-yyyy');
};
