import React from 'react';
import { Menu } from 'antd';
import { ReactComponent as Logo } from './assets/logo-light.svg';
import {
  UserOutlined,
  LockOutlined,
  ProfileOutlined,
  SearchOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { media } from 'styles/media';
import { GiPathDistance, GiSailboat } from 'react-icons/gi';
import { GoDatabase } from 'react-icons/go';
import { isMobile } from 'utils/helpers';
import { MdGroups } from 'react-icons/md';

export const SiderContent = (props) => {

  const { toggled } = props;

  const items = [
    { key: '1', paths: ['/', '/search'] },
    { key: '13', paths: ['/events'], subMenuKey: 'events' },
    { key: '14', paths: ['/races'], subMenuKey: 'events' },
    { key: '15', paths: ['/boats'] },
    { key: '12', paths: ['/data'] },
    { key: '7', paths: ['/profile'], subMenuKey: 'profile' },
    { key: '8', paths: ['/profile/change-password'], subMenuKey: 'profile' },
    { key: '16', paths: ['/tracks'] },
    { key: '17', paths: ['/groups'] },
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
    const filteredItems = items.filter(item => {
      return location.pathname.includes(item.paths.join(' '));
    });
    if (filteredItems.length > 0) {
      if (!filteredItems[0].subMenuKey) setOpenKey('');
      else setOpenKey(filteredItems[0].subMenuKey);
      setSelectedKey(filteredItems[0].key);
    }
    setRenderedDefaultActive(true);
  }

  const navigateToHome = () => {
    history.push('/');
    setSelectedKey("1");
  }

  return (
    <SiderWrapper style={{ width: (toggled && !isMobile()) ? '100%' : 'auto' }}>
      {renderedDefaultActive && <SyrfMenu
        defaultSelectedKeys={[selectedKey]}
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={[openKey]}>
        <Logo
          onClick={navigateToHome}
          style={{ margin: '20px auto', display: 'block', width: props.toggled ? 'auto' : '0px', cursor: 'pointer' }} />
        <SyrfMenuItem className="search-step" title={t(translations.side_menu.search)} key="1" onClick={() => history.push('/')} icon={<SearchOutlined />}>
          {t(translations.side_menu.search)}
        </SyrfMenuItem>

        <SyrfMenuItem key="16" onClick={() => history.push('/tracks')} title={t(translations.side_menu.my_tracks)} icon={<GiPathDistance />}>
          {t(translations.side_menu.my_tracks)}
        </SyrfMenuItem>

        <SyrfMenuItem key="events" onClick={() => history.push('/events')} title={t(translations.side_menu.my_events)} icon={<CalendarOutlined />}>
          {t(translations.side_menu.my_events)}
        </SyrfMenuItem>

        <SyrfMenuItem title={t(translations.side_menu.vessels)} icon={<GiSailboat />} onClick={() => history.push('/boats')} key="15">{t(translations.side_menu.vessels)}</SyrfMenuItem>

        <SyrfMenuItem key="17" onClick={() => history.push('/groups')} title={t(translations.side_menu.groups)} icon={<MdGroups />}>
          {t(translations.side_menu.groups)}
        </SyrfMenuItem>

        <SyrfMenuItem key="12" onClick={() => history.push('/data')} title={t(translations.side_menu.data)} icon={<GoDatabase />}>
          {t(translations.side_menu.data)}
        </SyrfMenuItem>

        <SyrfSubmenu key="profile" icon={<UserOutlined />} title={t(translations.side_menu.profile.title)}>
          <SyrfMenuItem title={t(translations.side_menu.profile.name)} key="7" icon={<ProfileOutlined />} onClick={() => history.push('/profile')}>{t(translations.side_menu.profile.name)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.change_password)} icon={<LockOutlined />} onClick={() => history.push('/profile/change-password')} key="8">{t(translations.side_menu.profile.change_password)}</SyrfMenuItem>
          {/* <SyrfMenuItem title={t(translations.side_menu.profile.notification_setting)} icon={<BellOutlined />} onClick={() => history.push('/profile')} key="9">{t(translations.side_menu.profile.notification_setting)}</SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.profile_setting)} icon={<SettingOutlined />} onClick={() => history.push('/profile')} key="10">{t(translations.side_menu.profile.profile_setting)}</SyrfMenuItem> hide this because of task SNS-393 */}
        </SyrfSubmenu>
        {/* 
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
        </SyrfMenuItem> hide this because of task SNS-393 */}
      </SyrfMenu>}
    </SiderWrapper>
  )
}

const SiderWrapper = styled.div`
  position: fixed;
  width: 256px;

  ${media.large`
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
    overflow-y: auto;
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
    width: 256px !important;

    ${media.large`
      width: auto !important;
    `}
`;