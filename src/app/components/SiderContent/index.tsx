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
import { MdGroups } from 'react-icons/md';
import { Link } from '../Link';
import { FaUserFriends } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';

export const SiderContent = (props) => {

  const { toggled } = props;

  const items = [
    { key: '14', paths: ['events'], subMenuKey: 'events' },
    { key: '15', paths: ['boats'] },
    { key: '12', paths: ['data'] },
    { key: '8', paths: ['change-password'], subMenuKey: 'profile' },
    { key: '7', paths: ['account'], subMenuKey: 'profile' },
    { key: '16', paths: ['tracks'] },
    { key: '17', paths: ['groups'] },
    { key: '20', paths: ['profile/search'], subMenuKey: 'profile' },
    { key: '19', paths: ['profile'], subMenuKey: 'profile' },
    { key: '1', paths: ['search'] },
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
    } else {
      setSelectedKey("1");
    }
    setRenderedDefaultActive(true);
  }

  const navigateToHome = () => {
    history.push('/');
    setSelectedKey("1");
  }

  return (
    <SiderWrapper style={{ width: 'auto' }}>
      {renderedDefaultActive && <SyrfMenu
        defaultSelectedKeys={[selectedKey]}
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={[openKey]}>
        <Logo
          onClick={navigateToHome}
          style={{ margin: '20px auto', display: 'block', width: toggled ? 'auto' : '0px', cursor: 'pointer' }} />
        <SyrfMenuItem className="search-step" title={t(translations.side_menu.search)} key="1" icon={<SearchOutlined />}>
          <StyledLink to={'/'}>{t(translations.side_menu.search)}</StyledLink>
        </SyrfMenuItem>

        <SyrfMenuItem key="16" title={t(translations.side_menu.my_tracks)} icon={<GiPathDistance />}>
          <StyledLink to={'/tracks'}>{t(translations.side_menu.my_tracks)}</StyledLink>
        </SyrfMenuItem>

        <SyrfMenuItem key="14" title={t(translations.side_menu.my_events)} icon={<CalendarOutlined />}>
          <StyledLink to={'/events'}>{t(translations.side_menu.my_events)}</StyledLink>
        </SyrfMenuItem>

        <SyrfMenuItem key="17" title={t(translations.side_menu.groups)} icon={<MdGroups />}>
          <StyledLink to={'/groups'}>{t(translations.side_menu.groups)}</StyledLink>
        </SyrfMenuItem>

        <SyrfMenuItem title={t(translations.side_menu.vessels)} icon={<GiSailboat />} key="15">
          <StyledLink to={'/boats'}>{t(translations.side_menu.vessels)}</StyledLink>
        </SyrfMenuItem>

        <SyrfMenuItem key="12" title={t(translations.side_menu.data)} icon={<GoDatabase />}>
          <StyledLink to={'/data'}>{t(translations.side_menu.data)}</StyledLink>
        </SyrfMenuItem>

        <SyrfSubmenu key="profile" icon={<UserOutlined />} title={t(translations.side_menu.profile.title)}>
          <SyrfMenuItem title={t(translations.side_menu.profile.name)} key="7" icon={<ProfileOutlined />}>
            <StyledLink to={'/account'}>{t(translations.side_menu.profile.name)}</StyledLink>
          </SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.change_password)} icon={<LockOutlined />} key="8">
            <StyledLink to={'/account/change-password'}>{t(translations.side_menu.profile.change_password)}</StyledLink>
          </SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.change_password)} icon={<FaUserFriends />} key="20">
            <StyledLink to={'/profile/search'}>{t(translations.side_menu.profile.discover_friends)}</StyledLink>
          </SyrfMenuItem>
          <SyrfMenuItem title={t(translations.side_menu.profile.change_password)} icon={<ImProfile />} key="19">
            <StyledLink to={'/profile'}>{t(translations.side_menu.profile.my_profile)}</StyledLink>
          </SyrfMenuItem>
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
  overflow: hidden;

  ${media.large`
    width: auto;
    max-width: 256px;
  `}

  background: ${StyleConstants.MAIN_TONE_COLOR};
`;

const SyrfMenu = styled(Menu)`
    width: 256px;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    color: #fff;
    font-weight: 500;
    height: calc(100vh - 50px);
    border-right: none;
    overflow-y: auto;
    overflow-x: hidden;
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

    a {
      color: #fff;
    }

    &.ant-menu-item-selected a {
      color: #1890ff;
    }

    ${media.large`
      width: auto !important;
    `}
`;

const StyledLink = styled(Link)`
    text-decoration: none !important;
`