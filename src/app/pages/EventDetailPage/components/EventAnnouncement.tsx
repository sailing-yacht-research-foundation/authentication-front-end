import { Avatar, List, Skeleton } from 'antd';
import { PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEventMessages } from 'services/live-data-server/event-calendars';
import { TIME_FORMAT } from 'utils/constants';

export const EventAnnouncement = React.forwardRef<any, any>((props, ref) => {

    const { event } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const [announcement, setAnnouncement] = React.useState<any[]>([]);

    const getEventAnnoucement = async () => {
        setIsLoading(true);
        const response = await getEventMessages(event.id!);
        setIsLoading(false);

        if (response.success) {
            console.log(response.data?.data);
            setAnnouncement(response.data?.data || []);
        }
    }

    React.useImperativeHandle(ref, () => ({
        getEventAnnoucement() {
            getEventAnnoucement();
        }
    }));

    React.useEffect(() => {
        getEventAnnoucement();
    }, []);

    return (<>
        <PageHeaderContainer>
            <PageHeaderTextSmall>{t(translations.event_detail_page.announcement)}</PageHeaderTextSmall>
        </PageHeaderContainer>
        <List
            style={{ maxHeight: '500px', overflowY: 'auto' }}
            loading={isLoading}
            itemLayout="vertical"
            dataSource={announcement}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar >Admin</Avatar>}
                        description={moment(item.sentAt).format(TIME_FORMAT.date_text_with_time)}
                    />
                    <div>{item.messageContent}</div>
                </List.Item>)
            } />
    </>
    )
});