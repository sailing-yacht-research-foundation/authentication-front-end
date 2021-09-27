import React from 'react';
import { Row } from 'antd';
import { useDispatch } from 'react-redux';
import { useEulaSlice } from '../slice';

export const EULA = () => {

  const dispatch = useDispatch();

  const eulaActions = useEulaSlice().actions;

  React.useEffect(() => {
    dispatch(eulaActions.signEulaVersion('2021-07-28 00:00:00'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: '100vh', marginTop: '100px', padding: '0 20px' }}>
      <h1>End-User License Agreement (EULA) of <span className="app_name"><span className="highlight preview_app_name">SYRF</span></span></h1>
     
      <p>By using our software and services you agree to the following:</p>
      <ul>
        <li>Agree that you will not scrape, cache, or otherwise save any data.</li>
        <li>Agree that you will not redistribute or publish our data.</li>
        <li>Agree that you will not reverse engineer our APIs or code.</li>
        <li>Agree that you waive the right to litigate in court or arbitrate any claim or dispute as a member of a class action or as an individual.</li>
        <li>Agree that you will not share your account with others.</li>
        <li>Agree that you will not use our products or services to stalk or data mine individuals.</li>
        <li>Agree that you will not post advertisements or sponsorships.</li>
        <li>Agree that you will not  use proxy applications with our apps or services.</li>
        <li>Agree that you will not crawl or automate actions with Selenium, Puppeteer, or other web crawling frameworks or headless browsers. </li>
        <li>Agree that you are over the age of 18 or have a parent’s consent. </li>
        <li>Agree that you will not use our services to cheat in competitions. </li>
        <li>Agree that you will not use our services as primary means of navigation and that we are not liable if you do.</li>
        <li>Agree that you will stream to our platform if you use our video overlay services.</li>
        <li>Agree that you will not stream content that is obviously offensive. </li>
        <li>Agree that we can use your content for promotion, and opt-in social sharing features.</li>
        <li>Agree that we are not liable for your activities using our services.</li>
        <li>Agree that we can cancel your account for any reason.</li>
        <li>Agree to the use of personalized cookies while logged in, so that we can provide personalized services.</li>
        <li>Agree to have your use of our products recorded in order to provide compliance with CCPA and in order to benefit your user experience.</li>
      </ul>
    </div>
  )
}