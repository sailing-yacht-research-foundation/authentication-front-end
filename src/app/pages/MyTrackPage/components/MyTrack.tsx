import React from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FiMap } from 'react-icons/fi';
import { BsListUl } from 'react-icons/bs';

import { translations } from "locales/translations";
import { MyTrackList } from "./MyTrackList";
import { MyTrackMapView } from './MyTrackMapView';

const { TabPane } = Tabs;

const renderIcon = (Icon, text) => {
  return (
    <span>
      <Icon style={{ fontSize: "16px" }} /> <span style={{ fontSize: "16px" }}>{text}</span>
    </span>
  );
};

export const MyTrack = () => {
  const { t } = useTranslation();

  const translate = {
    tracks: t(translations.my_tracks_page.my_tracks),
    map: t(translations.my_tracks_page.map_view)
  }

  return (
    <div>
      <StyledTabs<React.ElementType> animated defaultActiveKey="1">
        <TabPane tab={renderIcon(BsListUl, translate.tracks)} key="1">
          <MyTrackList />
        </TabPane>

        <TabPane tab={renderIcon(FiMap, translate.map)} key="2">
            <MyTrackMapView />
        </TabPane>
      </StyledTabs>
    </div>
  );
};

const StyledTabs = styled(Tabs)`
  margin-bottom: 0;
  position: relative;
  width: 100%;

  .ant-tabs-tab {
    font-size: 22px;
  }
  .ant-tabs-tab:first-child {
    margin-left: 10px;
  }
`;
