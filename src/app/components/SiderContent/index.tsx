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
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { media } from 'styles/media';
import { GiSailboat } from 'react-icons/gi';
import { FaFlagCheckered } from 'react-icons/fa';
import { GoDatabase } from 'react-icons/go';



export const SiderContent = (props) => {

  const items = [
    { key: '1', paths: ['/', '/search'] },
    { key: '13', paths: ['/my-events'], subMenuKey: 'races' },
    { key: '14', paths: ['/competition-units'], subMenuKey: 'races' },
    { key: '12', paths: ['/data'] },
    { key: '7', paths: ['/profile'], subMenuKey: 'profile' },
    { key: '8', paths: ['/profile/change-password'], subMenuKey: 'profile' },
  ];

  const history = useHistory();

  const location = useLocation();

  const [selectedKey, setSelectedKey] = React.useState<string>('1');

  const [openKey, setOpenKey] = React.useState('');

  const [renderedDefaultActive, setRenderedDefaultActive] = React.useState<boolean>(false);

  const { t } = useTranslation();

  React.useEffect(() => {
    renderDefaultSelectedRoute();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const renderDefaultSelectedRoute = () => {
    const item = items.filter(item => {
      return item.paths!.indexOf(location.pathname) !== -1
    })[0];
    if (item) {
      setSelectedKey(item.key);
      setOpenKey(item.subMenuKey ?? '');
    }
    setRenderedDefaultActive(true);

    console.log(item);
  }

  return (
    <SiderWrapper>
      {renderedDefaultActive && <SyrfMenu
        defaultSelectedKeys={[selectedKey]}
        mode="inline"
        defaultOpenKeys={[openKey]}>
        <Logo
          onClick={() => history.push('/')}
          style={{ margin: '20px auto', display: 'block', width: props.toggled ? 'auto' : '0px' }} />
        <SyrfMenuItem title={t(translations.side_menu.search)} key="1" onClick={() => history.push('/')} icon={<SearchOutlined />}>
          {t(translations.side_menu.search)}
        </SyrfMenuItem>

        <SyrfSubmenu key="races" icon={<FaFlagCheckered style={{ marginRight: '10px' }} />} title={t(translations.side_menu.my_races)}>
          <SyrfMenuItem title={t(translations.side_menu.events)} key="13" icon={<FaFlagCheckered />} onClick={() => history.push('/my-events')}>{t(translations.side_menu.events)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.competition_units)} icon={<GiSailboat />} onClick={() => history.push('/competition-units')} key="14">{t(translations.side_menu.competition_units)}</SyrfMenuItem>
        </SyrfSubmenu>

        <SyrfMenuItem key="12" onClick={() => history.push('/data')} title={t(translations.side_menu.data)} icon={<GoDatabase />}>
          {t(translations.side_menu.data)}
        </SyrfMenuItem>

        <SyrfSubmenu key="profile" icon={<UserOutlined />} title={t(translations.side_menu.profile.title)}>
          <SyrfMenuItem title={t(translations.side_menu.profile.name)} key="7" icon={<ProfileOutlined />} onClick={() => history.push('/profile')}>{t(translations.side_menu.profile.name)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.change_password)} icon={<LockOutlined />} onClick={() => history.push('/profile/change-password')} key="8">{t(translations.side_menu.profile.change_password)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.notification_setting)} icon={<BellOutlined />} onClick={() => history.push('/profile')} key="9">{t(translations.side_menu.profile.notification_setting)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.profile_setting)} icon={<SettingOutlined />} onClick={() => history.push('/profile')} key="10">{t(translations.side_menu.profile.profile_setting)}</SyrfMenuItem>
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
      </SyrfMenu>}
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