import React from 'react';
import { Avatar, Card } from 'antd';
import { IoLinkOutline } from 'react-icons/io5';
import Meta from 'antd/lib/card/Meta';
import { PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { CalendarEvent } from 'types/CalendarEvent';
import { DEFAULT_GROUP_AVATAR } from 'utils/constants';
import { Link } from 'react-router-dom';

export const OrganizationGroup = ({ event }: { event: Partial<CalendarEvent>}) => {

    const { t } = useTranslation();

    const organization = event.organizerGroupDetail;

    return (<>
        <PageHeaderContainer>
            <PageHeaderTextSmall>{t(translations.event_detail_page.planning_organization)}</PageHeaderTextSmall>
        </PageHeaderContainer>
        <Card
            style={{ width: 300 }}
            actions={[
                <Link to={`/groups/${event.organizerGroupId}`}><IoLinkOutline key="view" /> {t(translations.event_detail_page.view_organiztion)}</Link>,
            ]}
        >
            <Meta
                avatar={<Avatar src={organization?.groupImage || DEFAULT_GROUP_AVATAR} />}
                title={organization?.groupName}
            />
        </Card>
    </>);
}
