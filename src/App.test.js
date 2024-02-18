import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
/**
 * 143, 12, 2013-11-01, 2014-01-05
113, 12, 2009-11-01, 2013-12-01
114, 12, 2006-11-01, 2014-01-05
115, 12, 11/01/2009, 11/01/2010
218, 10, 2012-05-16, NULL
143, 10, 2009-01-01, 2012-05-27
113, 11, 2018-01-01, 2018-01-27
114, 11, 2017-01-01, 2019-01-27
115, 11, 2017-01-10, 2019-01-27
114, 11, 2021-01-10, 2028-01-27
113, 11, 2021-01-10, 2021-01-27
115, 11, 2021-01-10, 2028-01-27
 */