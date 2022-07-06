import React from "react";
import { Space, Tabs } from "antd";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FiMap } from 'react-icons/fi';
import { BsListUl } from 'react-icons/bs';

import { translations } from "locales/translations";
import { MyTrackList } from "./MyTrackList";
import { MyTrackMapView } from './MyTrackMapView';
import { CreateButton, PageHeaderContainerResponsive, PageHeading, PageInfoContainer } from 'app/components/SyrfGeneral';
import { BiImport } from "react-icons/bi";
import { ImportTrack } from "./ImportTrack";
import { ImportTrackType } from "utils/constants";
import { media } from "styles/media";
import { useDispatch, useSelector } from "react-redux";
import { useMyTracksSlice } from "../slice";
import { selectFilter, selectPagination, selectSorter } from "../slice/selectors";

const { TabPane } = Tabs;

const renderIcon = (Icon, text) => {
  return (
    <span>
      <Icon style={{ fontSize: "16px" }} /> <span style={{ fontSize: "16px" }}>{text}</span>
    </span>
  );
};

export const MyTrack = () => {

  const [showImportGPXTrackModal, setShowImportGPXTrackModal] = React.useState<boolean>(false);

  const [showImportExpeditionTrackModal, setShowImportExpeditionTrackModal] = React.useState<boolean>(false);

  const dispatch = useDispatch();

  const { actions } = useMyTracksSlice();

  const pagination = useSelector(selectPagination);

  const sorter = useSelector(selectSorter);

  const filter = useSelector(selectFilter);

  const { t } = useTranslation();

  const translate = {
    tracks: t(translations.my_tracks_page.my_tracks),
    map: t(translations.my_tracks_page.map_view)
  }

  const onTrackImported = () => {
    dispatch(actions.getTracks({ page: pagination.page, size: pagination.size, filter, sorter }));
  }

  return (
    <div>
      <ImportTrack onTrackImported={onTrackImported} showModal={showImportGPXTrackModal} setShowModal={setShowImportGPXTrackModal} type={ImportTrackType.GPX} />
      <ImportTrack onTrackImported={onTrackImported} showModal={showImportExpeditionTrackModal} setShowModal={setShowImportExpeditionTrackModal} type={ImportTrackType.EXPEDITION} />
      <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%'}}>
        <PageInfoContainer style={{ paddingRight: '8px' }}>
          <PageHeading style={{ padding: '0px' }}>{t(translations.my_tracks_page.my_tracks)}</PageHeading>
        </PageInfoContainer>
        <StyledSpace size={10} wrap>
          <CreateButton onClick={() => setShowImportGPXTrackModal(true)}
            style={{ margin: '0px' }}
            icon={<BiImport
              style={{ marginRight: '5px' }}
              size={18} />}>{t(translations.my_tracks_page.import_gpx_track)}</CreateButton>
          <CreateButton
            onClick={() => setShowImportExpeditionTrackModal(true)}
            style={{ margin: '0px' }}
            icon={<BiImport
              style={{ marginRight: '5px' }}
              size={18} />}>{t(translations.my_tracks_page.import_expedition_track)}</CreateButton>
        </StyledSpace>
      </PageHeaderContainerResponsive>
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

const StyledSpace = styled(Space)`
  display: none;
  ${media.medium`
    display: flex;
  `}
`;
