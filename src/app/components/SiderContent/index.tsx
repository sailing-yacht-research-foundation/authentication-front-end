import React from 'react';
import { Menu } from 'antd';
import { ReactComponent as Logo } from './assets/logo-light.svg';
import {
  UserOutlined,
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
import { useDispatch, useSelector } from 'react-redux';
import { selectPagination } from '../SocialProfile/slice/selector';
import { useSocialSlice } from '../SocialProfile/slice';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { TourStepClassName } from 'utils/tour-steps';

interface Route {
  key: number,
  path?: string,
  title: string,
  icon: JSX.Element,
  items?: any,
  subMenuKey?: string,
  exactPath?: string,
  itemCount?: number;
  className?: string,
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

  const followRequestsPagination = useSelector(selectPagination);

  const dispatch = useDispatch();

  const { actions } = useSocialSlice();

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
      className: TourStepClassName.TRACKS_PAGE
    },
    {
      key: routeKey.EVENTS,
      path: '/events',
      title: t(translations.side_menu.my_events),
      icon: <CalendarOutlined />,
      className: TourStepClassName.MY_EVENTS_PAGE
    },
    {
      key: routeKey.GROUPS,
      path: '/groups',
      title: t(translations.side_menu.groups),
      icon: <MdGroups />,
      className: TourStepClassName.GROUPS_PAGE

    },
    {
      key: routeKey.BOATS,
      path: '/boats',
      title: t(translations.side_menu.vessels),
      icon: <GiSailboat />,
      className: TourStepClassName.BOATS_PAGE
    },
    {
      key: routeKey.DISCOVER_FRIENDS,
      exactPath: '/profile/search',
      path: '/profile/:id',
      title: t(translations.side_menu.profile.discover_friends),
      icon: <FaUserFriends />,
      itemCount: followRequestsPagination.total,
      className: TourStepClassName.DISCOVER_FRIENDS_PAGE
    },
    {
      key: routeKey.DATA,
      path: '/data',
      title: t(translations.side_menu.data),
      icon: <GoDatabase />

    },
    {
      key: routeKey.ACCOUNT,
      subMenuKey: 'account',
      title: t(translations.side_menu.profile.name),
      icon: <UserOutlined />,
      className: TourStepClassName.MY_ACCOUNT_PAGE,
      items: [
        {
          key: routeKey.ACCOUNT,
          path: '/account',
          subMenuKey: 'account',
          title: t(translations.side_menu.profile.name),
          icon: <ProfileOutlined />,
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

  const isAuthenticated = useSelector(selectIsAuthenticated);

  React.useEffect(() => {
    renderDefaultSelectedRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const renderDefaultSelectedRoute = () => {
    let matchItem;
    items.forEach(item => {
      if (item.path) {
        if (matchPath(location.pathname, {
          path: item.path || item.exactPath,
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

    if (window.location.pathname === '/playback/') {
      const params = new URLSearchParams(location.search);
      if (params.get('trackId')) {
        setSelectedKey(routeKey.TRACKS);
      } else {
        setSelectedKey(routeKey.SEARCH);
      }
    }

    setRenderedDefaultActive(true);
  }

  const navigateToHome = () => {
    history.push('/');
    setSelectedKey(routeKey.SEARCH);
  }

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(actions.getFollowRequests({ page: 1, size: 10 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <SiderWrapper style={{ width: 'auto', height: '100%' }}>
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
            return <SyrfMenuItem className={route.className} title={route.title} key={route.key} icon={route.icon}>
              <StyledLink to={route.exactPath || route.path}>{route.title}</StyledLink>
              {route.itemCount !== undefined && Number(route.itemCount) > 0 && <Badge>{route.itemCount}</Badge>}
            </SyrfMenuItem>;
          }

          return <SyrfSubmenu className={route.className} key={route.subMenuKey} icon={route.icon} title={route.title}>
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
    height: calc(100% - 50px);
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
`;

const Badge = styled.div`
    position: absolute;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    background: #DC6E1E;
    color: #fff;
    right: 15px;
    top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
`;
