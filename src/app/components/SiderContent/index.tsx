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
import { useHistory, useLocation, matchPath } from 'react-router';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { media } from 'styles/media';
import { GiPathDistance, GiSailboat } from 'react-icons/gi';
import { GoDatabase } from 'react-icons/go';
import { MdGroups, MdOutlineAccountTree } from 'react-icons/md';
import { Link } from '../Link';
import { FaUserFriends } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { AiOutlineSetting } from 'react-icons/ai';
import { BsFillCreditCardFill } from 'react-icons/bs';

interface Route {
  key: number,
  path?: string,
  title: string,
  icon: JSX.Element,
  items?: any,
  subMenuKey?: string
}

const routeKey = {
  SEARCH: 1,
  TRACKS: 2,
  EVENTS: 3,
  GROUPS: 4,
  BOATS: 5,
  DATA: 6,
  ACCOUNT: 7,
  INTEGRATIONS: 8,
  CHANGE_PASSWORD: 9,
  DISCOVER_FRIENDS: 10,
  PROFILE: 11,
  SETTINGS: 12,
  SUBSCRIPTION: 13,
  NOTIFICATIONS: 14
}

export const SiderContent = (props) => {

  const { toggled } = props;

  const { t } = useTranslation();

  const items: Route[] = [
    {
      key: routeKey.SEARCH,
      path: '/',
      title: t(translations.side_menu.search),
      icon: <SearchOutlined />,
    },
    {
      key: routeKey.TRACKS,
      title: t(translations.side_menu.my_tracks),
      path: '/tracks',
      icon: <GiPathDistance />,

    },
    {
      key: routeKey.EVENTS,
      path: '/events',
      title: t(translations.side_menu.my_events),
      icon: <CalendarOutlined />,
    },
    {
      key: routeKey.GROUPS,
      path: '/groups',
      title: t(translations.side_menu.groups),
      icon: <MdGroups />,

    },
    {
      key: routeKey.BOATS,
      path: '/boats',
      title: t(translations.side_menu.vessels),
      icon: <GiSailboat />,

    },
    {
      key: routeKey.DISCOVER_FRIENDS,
      path: '/profile/search',
      title: t(translations.side_menu.profile.discover_friends),
      icon: <FaUserFriends />,
    },
    {
      key: routeKey.DATA,
      path: '/data',
      title: t(translations.side_menu.data),
      icon: <GoDatabase />,

    },
    {
      key: routeKey.ACCOUNT,
      subMenuKey: 'account',
      title: t(translations.side_menu.profile.name),
      icon: <UserOutlined />,
      items: [
        {
          key: routeKey.ACCOUNT,
          path: '/account',
          subMenuKey: 'account',
          title: t(translations.side_menu.profile.name),
          icon: <ProfileOutlined />,
        },
        {
          key: routeKey.CHANGE_PASSWORD,
          path: '/account/change-password',
          icon: <LockOutlined />,
          title: t(translations.side_menu.profile.change_password),
        },
        {
          key: routeKey.SETTINGS,
          path: '/account/settings',
          icon: <AiOutlineSetting />,
          title: t(translations.side_menu.profile.settings),
        },
        {
          key: routeKey.INTEGRATIONS,
          path: '/account/integrations',
          icon: <MdOutlineAccountTree />,
          title: t(translations.side_menu.profile.integrations),
        },
        {
          key: routeKey.SUBSCRIPTION,
          path: '/account/subscription',
          icon: <BsFillCreditCardFill />,
          title: t(translations.side_menu.profile.subscription),
        },
        {
          key: routeKey.PROFILE,
          path: '/profile',
          title: t(translations.side_menu.profile.my_profile),
          icon: <ImProfile />,
        },
      ]
    },
  ];

  const history = useHistory();

  const location = useLocation();

  const [selectedKey, setSelectedKey] = React.useState<number>(routeKey.SEARCH);

  const [openKey, setOpenKey] = React.useState<string>('');

  const [renderedDefaultActive, setRenderedDefaultActive] = React.useState<boolean>(false);

  React.useEffect(() => {
    renderDefaultSelectedRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const renderDefaultSelectedRoute = () => {
    let matchItem;
    items.forEach(item => {
      if (item.path) {
        if (matchPath(location.pathname, {
          path: item.path,
          exact: false,
          strict: false
        })) {
          matchItem = item;
        }
      } else { // nested routes.
        item.items.forEach(childRoute => {
          if (matchPath(location.pathname, {
            path: childRoute.path,
            exact: true,
            strict: false
          })) {
            matchItem = childRoute;
            setOpenKey(item.subMenuKey!);
          }
        })
      }
    })

    if (matchItem) {
      setSelectedKey(matchItem.key);
    }

    setRenderedDefaultActive(true);
  }

  const navigateToHome = () => {
    history.push('/');
    setSelectedKey(routeKey.SEARCH);
  }

  return (
    <SiderWrapper style={{ width: 'auto' }}>
      {renderedDefaultActive && <SyrfMenu
        defaultSelectedKeys={[String(selectedKey)]}
        mode="inline"
        selectedKeys={[String(selectedKey)]}
        defaultOpenKeys={[openKey]}>
        <StyledLogo
          style={{ width: toggled ? 'auto' : '0px' }}
          onClick={navigateToHome} />

        {items.map(route => {
          if (route.path) {
            return <SyrfMenuItem title={route.title} key={route.key} icon={route.icon}>
              <StyledLink to={route.path}>{route.title}</StyledLink>
            </SyrfMenuItem>;
          }

          return <SyrfSubmenu key={route.subMenuKey} icon={route.icon} title={route.title}>
            {route.items.map(subRoute => {
              return <SyrfMenuItem title={subRoute.title} key={subRoute.key} icon={subRoute.icon}>
                <StyledLink to={subRoute.path}>{subRoute.title}</StyledLink>
              </SyrfMenuItem>;
            })}
          </SyrfSubmenu>
        })}
      </SyrfMenu>}
    </SiderWrapper>
  )
}

const StyledLogo = styled(Logo)`
  margin: 20px auto;
  display: block;
  cursor: pointer;
`;

const SiderWrapper = styled.div`
  position: fixed;
  width: 256px;
  overflow: hidden;
  overflow-y: auto;

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