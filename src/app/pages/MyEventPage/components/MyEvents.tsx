import React from 'react';
import { Tabs } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useHistory } from 'react-router';
import { FaFlagCheckered, FaRegCalendar } from 'react-icons/fa';

import { translations } from 'locales/translations';
import { CreateButton, PageDescription, PageHeaderContainerSimple, PageHeading, PageInfoContainer } from 'app/components/SyrfGeneral';
import { EventList } from './EventList';
import { CompetitionUnitList } from './CompetitionUnitList';

const { TabPane } = Tabs;

const renderIcon = (Icon, text) => {
    return (
        <span>
            <Icon style={{ fontSize: '16px' }} /> <span style={{ fontSize: '16px' }}>{text}</span>
        </span>
    )
}

export const MyEvents = () => {

    const { t } = useTranslation();
    const history = useHistory();

    const translate = {
        events: t(translations.my_event_list_page.my_events),
        races: t(translations.my_event_list_page.my_races)
    }

    return (
        <>
            <StyledTabs<React.ElementType>
                animated
                defaultActiveKey="1"
            >
                <TabPane tab={renderIcon(FaRegCalendar, translate.events)} key="1">
                    <PageHeaderContainerSimple style={{ 'alignSelf': 'flex-start', width: '100%', padding: '0px 15px' }}>
                        <PageInfoContainer style={{ paddingRight: '8px' }}>
                            <PageHeading style={{ padding: '0px', marginBottom: '4px' }}>{t(translations.my_event_list_page.my_events)}</PageHeading>
                            <PageDescription style={{ padding: '0px', marginBottom: '8px' }}>{t(translations.my_event_list_page.events_are_regattas)}</PageDescription>
                        </PageInfoContainer>
                        <div>
                            <CreateButton style={{ margin: '0px' }} onClick={() => history.push("/events/create")} icon={<AiFillPlusCircle
                                style={{ marginRight: '5px' }}
                                size={18} />}>{t(translations.my_event_list_page.create_a_new_event)}</CreateButton>
                        </div>
                    </PageHeaderContainerSimple>
                    <EventList />
                </TabPane>

                <TabPane tab={renderIcon(FaFlagCheckered, translate.races)} key="2">
                    <PageHeaderContainerSimple style={{ 'alignSelf': 'flex-start', width: '100%', padding: '0px 15px' }}>
                        <PageInfoContainer style={{ paddingRight: '8px' }}>
                            <PageHeading style={{ padding: '0px', marginBottom: '4px' }}>{t(translations.competition_unit_list_page.competition_units)}</PageHeading>
                            <PageDescription style={{ padding: '0px', marginBottom: '8px' }}>{t(translations.competition_unit_list_page.race_configurations_pair_classes_to_courses)}</PageDescription>
                        </PageInfoContainer>
                    </PageHeaderContainerSimple>
                    <CompetitionUnitList />
                </TabPane>
            </StyledTabs>            
        </>
    )
}

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