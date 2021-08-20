import { createGlobalStyle } from 'styled-components';
import { StyleConstants } from './StyleConstants';
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
    max-width: 1920px;
    display: block;
    margin: 0 auto;
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

  .site-layout, .site-layout-background, .site-header {
    background: #fff !important;
  }

  .site-header {
    padding: 0 10px;
    height: ${StyleConstants.NAV_BAR_HEIGHT};
    position: fixed;
    z-index: 16;
    width: 100%;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: center;
    max-width: 1920px;
    margin: 0 auto;
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
    font-size: 14px !important;
    border-radius: 8px;
    width: 184px;
    height: 56px;
    font-weight: 700;
  }

  @media screen and (max-width: 600px) {
    .syrf-button-outline, .syrf-button { 
      width: auto;
      height: auto;
      padding: 15px 55px;

    }
  }

  .syrf-button {
    background-color: #599DF9;
    border-color: #599DF9;
  }

  .syrf-button:hover {
    // color: #fff;
    // background-color: #ba5d19;
    // border: 2px solid #ba5d19;
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

  .connect-btn {
    display: none;
  }

  .instagram-button {
    border: none;
    background: none;
  }

  .carousel-dot.custom {
    right: auto;
  }

  .carousel-dot.partner-app {
    position: relative;
    margin-top: 70px;
  }

  .carousel-dot li,.carousel-dot button {
    width: 71.75px !important;
    height: 5px !important;
    border-radius: 20px !important;
    opacity: 50% !important;
    background: #1056DE;
  }
  
  .carousel-dot li.slick-active {
    opacity: 1 !important;
    width: 71.75px !important;
    height: 5px !important;
  }

  .section-header-text {
    font-size: 36px;
    font-weight: 700 !important;
    line-hight: 47px !important;
  }
  
  .syrf-datepicker {
    border-radius: 10px;
    border: 1px solid ${StyleConstants.MAIN_TONE_COLOR};
    height: 36px;
  }

  .phone-number-input {
    width: 100% !important;
    border-radius: 0 !important;
    border-color: #d9d9d9 !important;
    font-family: Inter;
  }

  .syrf-phone-number-input {
    border-radius: 10px !important;
    border: 1px solid ${StyleConstants.MAIN_TONE_COLOR} !important;
    height: 36px !important;
    font-weight: normal;
    font-family: Inter;
    width: 100% !important;
  }

  .syrf-flag-dropdown {
    border: 1px solid ${StyleConstants.MAIN_TONE_COLOR} !important;
    border-top-left-radius: 10px !important;
    border-bottom-left-radius: 10px !important;
  }

  .ant-image {
    height: 100%;
    width: 100%;
  }

  .leaflet-marker-pane > * {
    -webkit-transition: transform .3s linear;
    -moz-transition: transform .3s linear;
    -o-transition: transform .3s linear;
    -ms-transition: transform .3s linear;
    transition: transform .3s linear;
  }
`;
