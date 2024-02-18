import { parseDateWithMultipleFormats } from './parseDateWithMultipleFormats';
import { format } from 'date-fns';

describe('parseDateWithMultipleFormats', () => {
  it('parses dates in yyyy-MM-dd format correctly', () => {
    const date = '2023-01-01';
    expect(format(parseDateWithMultipleFormats(date), 'yyyy-MM-dd')).toEqual(date);
  });

  it('parses dates in MM/dd/yyyy format correctly', () => {
    const date = '01/01/2023';
    expect(format(parseDateWithMultipleFormats(date), 'yyyy-MM-dd')).toEqual('2023-01-01');
  });

  it('parses dates in dd-MM-yyyy format correctly', () => {
    const date = '01-01-2023';
    expect(format(parseDateWithMultipleFormats(date), 'yyyy-MM-dd')).toEqual('2023-01-01');
  });

  it('parses dates in MMMM dd, yyyy format correctly', () => {
    const date = 'January 01, 2023';
    expect(format(parseDateWithMultipleFormats(date), 'yyyy-MM-dd')).toEqual('2023-01-01');
  });

  it('parses dates in yyyy/MM/dd format correctly', () => {
    const date = '2023/01/01';
    expect(format(parseDateWithMultipleFormats(date), 'yyyy-MM-dd')).toEqual('2023-01-01');
  });

  it('returns current date for "NULL" input', () => {
    const result = parseDateWithMultipleFormats('NULL');
    const now = new Date();
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString().split('T')[0]).toEqual(now.toISOString().split('T')[0]);
  });
});