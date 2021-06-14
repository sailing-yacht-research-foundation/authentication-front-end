import { createGlobalStyle } from 'styled-components';
import { StyleConstants } from './StyleConstants';
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: ${p => p.theme.background};
  }

  body.fontLoaded {
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  p,
  label {
    line-height: 1.5em;
  }

  input, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  #components-layout-demo-fixed-sider .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.2);
  }

  .site-layout .site-layout-background {
    background: #fff !important;
  }

  .site-content {
    min-height: 280px;
    width: calc(100% - ${StyleConstants.SIDE_BAR_WITH});
    align-self: flex-end;
    background: #fff;
  }

  .text-white {
    color: #fff !important;
  }

  .syrf-button-outline, .syrf-button {
    color: #fff;
    padding: 1rem 2rem !important;
    font-size: 1.25rem !important;
    height: auto !important;
    border-radius: 0.2rem;
  }

  .syrf-button {
    background-color: #DC6E1E;
    border-color: #DC6E1E !important;
  }

  .syrf-button:hover {
    color: #fff;
    background-color: #ba5d19;
    border-color: #af5818;
  }

  .syrf-button-outline {
    color: #fff;
    background-color: transparent;
    border: 2px solid #fff;
  }

  .syrf-button-outline:hover {
    color: #000;
    background-color: white;
    border-color: #fff;
  }

  .uppercase {
    text-transform: uppercase;
  }
  
  .PhoneInputInput {
    border: none;
  }
`;
