import React from 'react';
import { Space, Button, Spin } from 'antd';
import { EventState, MODE } from 'utils/constants';
import { useTranslation } from 'react-i18next';
import { DeleteButton } from 'app/components/SyrfGeneral';
import { closeCalendarEvent, scheduleCalendarEvent, toggleOpenForRegistration } from 'services/live-data-server/event-calendars';
import { translations } from 'locales/translations';
import { toast } from 'react-toastify';
import { GrGroup } from 'react-icons/gr';
import { ScheduleOutlined } from '@ant-design/icons';
import { HiLockClosed } from 'react-icons/hi';
import { GiArchiveRegister } from 'react-icons/gi';
import { GoChecklist } from 'react-icons/go';
import { BiTrash } from 'react-icons/bi';
import ReactTooltip from 'react-tooltip';

export const ActionButtons = ({
    mode,
    showAssignEventAsGroupAdminModal,
    event,
    setShowDeleteModal,
    setEvent,
    eventId
}) => {

    const { t } = useTranslation();

    const [isChangingStatus, setIsChangingStatus] = React.useState<boolean>(false);

    const [isOpeningClosingRegistration, setIsOpeningClosingRegistration] = React.useState<boolean>(false);


    const scheduleEvent = async () => {
        setIsChangingStatus(true);
        const response = await scheduleCalendarEvent(eventId);
        setIsChangingStatus(false);

        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_scheduled_this_event));
            setEvent({
                ...event,
                status: EventState.SHEDULED
            })
        } else {
            toast.error(t(translations.app.an_error_happened_when_performing_your_request));
        }
    }

    const toggleRegistration = async (allowRegistration: boolean) => {
        setIsOpeningClosingRegistration(true);
        const response = await toggleOpenForRegistration(eventId, allowRegistration);
        setIsOpeningClosingRegistration(false);

        if (response.success) {
            setEvent({
                ...event,
                allowRegistration: allowRegistration
            })
            if (allowRegistration) {
                toast.info(t(translations.my_event_create_update_page.event_is_opened_for_registration));
            } else {
                toast.info(t(translations.my_event_create_update_page.event_is_closed_for_registration));
            }
        } else {
            toast.error(t(translations.app.an_error_happened_when_performing_your_request));
        }
    }

    const closeRace = async () => {
        const response = await closeCalendarEvent(eventId);

        if (response.success) {
            setEvent({
                ...event,
                status: EventState.COMPLETED
            });
            toast.success(t(translations.my_event_create_update_page.successfully_closed_this_event));
        } else {
            toast.error(t(translations.app.an_error_happened_when_performing_your_request));
        }
    }

    return (
        <Space size={10}>
            {mode === MODE.UPDATE && <>
                <Button onClick={() => showAssignEventAsGroupAdminModal()} data-tip={t(translations.tip.set_this_event_as_group_admin)} icon={<GrGroup style={{ marginRight: '5px' }} />}>{t(translations.my_event_create_update_page.assign_admins)}</Button>
                {
                    event.status === EventState.DRAFT && <>
                        <Spin spinning={isChangingStatus}><Button onClick={scheduleEvent} data-tip={t(translations.tip.schedule_event)} icon={<ScheduleOutlined style={{ marginRight: '5px' }} />}>{t(translations.my_event_create_update_page.schedule_event)}</Button></Spin>
                        <DeleteButton data-tip={t(translations.tip.delete_event)} onClick={() => setShowDeleteModal(true)} danger icon={<BiTrash
                            style={{ marginRight: '5px' }}
                            size={18} />}></DeleteButton>
                    </>
                }
                {
                    event.isOpen && <Spin spinning={isOpeningClosingRegistration}>
                        {event.allowRegistration ? (<Button data-tip={t(translations.tip.click_to_make_this_event_close_for_registration)} onClick={() => toggleRegistration(false)} icon={<HiLockClosed style={{ marginRight: '5px' }} />}>{t(translations.my_event_create_update_page.close_registration)}</Button>)
                            : (<Button onClick={() => toggleRegistration(true)} data-tip={t(translations.tip.click_to_make_this_event_open_for_registration)} icon={< GiArchiveRegister style={{ marginRight: '5px' }} />}>{t(translations.my_event_create_update_page.open_registration)}</Button>)}
                    </Spin>
                }
                {
                    event.status === EventState.ON_GOING &&
                    <Spin spinning={isChangingStatus}><Button onClick={closeRace} data-tip={t(translations.tip.click_to_close_this_event_and_make_it_completed)} icon={< GoChecklist style={{ marginRight: '5px' }} />}></Button>{t(translations.my_event_create_update_page.close_event)}</Spin>
                }
            </>}
        </Space>
    )
}