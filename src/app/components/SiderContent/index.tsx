import React from 'react';
import { Menu } from 'antd';
import { ReactComponent as Logo } from './assets/logo-light.svg';
import {
  UserOutlined,
  CrownOutlined,
  HeatMapOutlined,
  SlidersOutlined,
  ApiOutlined,
  LockOutlined,
  BellOutlined,
  SettingOutlined,
  ProfileOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { media } from 'styles/media';
import { GiSailboat } from 'react-icons/gi';

export const SiderContent = (props) => {

  const history = useHistory();

  const { t } = useTranslation();

  return (
    <SiderWrapper>
      <SyrfMenu mode="inline" defaultSelectedKeys={['1']}>
        <Logo
          onClick={() => history.push('/')}
          style={{ margin: '20px auto', display: 'block', width: props.toggled ? 'auto' : '0px' }} />
        <SyrfMenuItem title={t(translations.side_menu.search)} key="1" onClick={() => history.push('/')} icon={<SearchOutlined />}>
          {t(translations.side_menu.search)}
        </SyrfMenuItem>

        <SyrfMenuItem title={t(translations.side_menu.my_races)} key="11" onClick={() => history.push('/')} icon={<GiSailboat />}>
          {t(translations.side_menu.my_races)}
        </SyrfMenuItem>

        <SyrfSubmenu key="sub2" icon={<UserOutlined />} title={t(translations.side_menu.profile.title)}>
          <SyrfMenuItem title={t(translations.side_menu.profile.name)} key="7" icon={<ProfileOutlined />} onClick={() => history.push('/profile')}>{t(translations.side_menu.profile.name)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.change_password)} icon={<LockOutlined />} onClick={() => history.push('/profile/change-password')} key="8">{t(translations.side_menu.profile.change_password)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.notification_setting)} icon={<BellOutlined />} onClick={() => history.push('/profile')} key="9">{t(translations.side_menu.profile.notification_setting)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.profile_setting)} icon={<SettingOutlined />} onClick={() => history.push('/profile')} key="10">{t(translations.side_menu.profile.profile_setting)}</SyrfMenuItem>
          {/* <SyrfMenuItem title={t(translations.side_menu.deal)} key="1" onClick={() => history.push('/deals')} icon={<MoneyCollectOutlined />}>{t(translations.side_menu.deal)}</SyrfMenuItem> */} { /* Jon asked to hide this page (move down to profile and hide) */}
        </SyrfSubmenu>

        <SyrfMenuItem key="3" title={t(translations.side_menu.app_connection)} icon={<ApiOutlined />}>
          {t(translations.side_menu.app_connection)}
        </SyrfMenuItem>

        <SyrfMenuItem key="4" title={t(translations.side_menu.organizational_membership)} icon={<CrownOutlined />}>
          {t(translations.side_menu.organizational_membership)}
        </SyrfMenuItem>

        <SyrfMenuItem key="5" title={t(translations.side_menu.my_data)} icon={<HeatMapOutlined />}>
          {t(translations.side_menu.my_data)}
        </SyrfMenuItem>

        <SyrfMenuItem key="6" title={t(translations.side_menu.test_data)} icon={<SlidersOutlined />}>
          {t(translations.side_menu.test_data)}
        </SyrfMenuItem>
      </SyrfMenu>
    </SiderWrapper>
  )
}

const SiderWrapper = styled.div`
  position: fixed;
  width: 256px;

  ${media.medium`
    width: auto;
    max-width: 256px;
  `}

  background: ${StyleConstants.MAIN_TONE_COLOR};
`;

const SyrfMenu = styled(Menu)`
    background: ${StyleConstants.MAIN_TONE_COLOR};
    color: #fff;
    font-weight: 500;
    height: 100vh;
    border-right: none;
`;

const SyrfSubmenu = styled(Menu.SubMenu)`
    background: ${StyleConstants.MAIN_TONE_COLOR} !important;
    color: #fff;

    ul {
        background: ${StyleConstants.MAIN_TONE_COLOR} !important;
        color: #fff;
    }
`;

const SyrfMenuItem = styled(Menu.Item)`
    height: 50px !important;
    line-height: 50px !important;
`;