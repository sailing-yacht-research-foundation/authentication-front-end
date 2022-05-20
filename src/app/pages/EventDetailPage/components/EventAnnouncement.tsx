import { Avatar, List, Skeleton } from 'antd';
import { PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEventMessages } from 'services/live-data-server/event-calendars';
import { StyleConstants } from 'styles/StyleConstants';
import { TIME_FORMAT } from 'utils/constants';

export const EventAnnouncement = React.forwardRef<any, any>((props, ref) => {

    const { event } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const [announcements, setAnnouncements] = React.useState<any[]>([]);

    const getEventAnnoucements = async () => {
        setIsLoading(true);
        const response = await getEventMessages(event.id!);
        setIsLoading(false);

        if (response.success) {
            console.log(response.data?.data);
            setAnnouncements(response.data?.data || []);
        }
    }

    React.useImperativeHandle(ref, () => ({
        getEventAnnoucements() {
            getEventAnnoucements();
        }
    }));

    React.useEffect(() => {
        getEventAnnoucements();
    }, []);

    return (<>
        <PageHeaderContainer>
            <PageHeaderTextSmall>{t(translations.event_detail_page.announcements)}</PageHeaderTextSmall>
        </PageHeaderContainer>
        <List
            style={{ maxHeight: '500px', overflowY: 'auto' }}
            loading={isLoading}
            itemLayout="vertical"
            dataSource={announcements}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar style={{ backgroundColor: StyleConstants.SECONDARY_COLOR }} size="large">Admin</Avatar>}
                        description={moment(item.sentAt).format(TIME_FORMAT.date_text_with_time)}
                    />
                    <div>{item.messageContent}</div>
                </List.Item>)
            } />
    </>
    )
});