import { createGlobalStyle } from '../components/styled';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.background.body};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
  }

  a {
    color: ${({ theme }) => theme.colors.status.info};
  }
`;
