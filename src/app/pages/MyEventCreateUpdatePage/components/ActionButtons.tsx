import React from 'react';
import { Spin, Dropdown, Menu } from 'antd';
import { EventState, MODE } from 'utils/constants';
import { useTranslation } from 'react-i18next';
import { closeCalendarEvent, scheduleCalendarEvent, toggleOpenForRegistration } from 'services/live-data-server/event-calendars';
import { translations } from 'locales/translations';
import { toast } from 'react-toastify';
import { GrGroup } from 'react-icons/gr';
import { ScheduleOutlined } from '@ant-design/icons';
import { HiLockClosed } from 'react-icons/hi';
import { GiArchiveRegister } from 'react-icons/gi';
import { GoChecklist } from 'react-icons/go';
import { BiImport, BiTrash } from 'react-icons/bi';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const ActionButtons = ({
    mode,
    showAssignEventAsGroupAdminModal,
    event,
    setShowDeleteModal,
    setEvent,
    eventId,
    setShowImportEventModal
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
                status: EventState.SCHEDULED
            })
        } else {
            showToastMessageOnRequestError(response.error);
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
            showToastMessageOnRequestError(response.error);
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
            showToastMessageOnRequestError(response.error);
        }
    }

    const menus = [
        {
            name: t(translations.my_event_create_update_page.import_external_data),
            show: [EventState.DRAFT, EventState.ON_GOING, EventState.SCHEDULED].includes(event.status),
            icon: <BiImport />,
            spinning: false,
            handler: () => setShowImportEventModal(true)
        },
        {
            name: t(translations.my_event_create_update_page.assign_admins),
            show: true,
            icon: <GrGroup />,
            spinning: false,
            handler: () => showAssignEventAsGroupAdminModal()
        },
        {
            name: t(translations.my_event_create_update_page.schedule_event),
            show: event.status === EventState.DRAFT,
            icon: <ScheduleOutlined />,
            spinning: isChangingStatus,
            handler: () => scheduleEvent()
        },
        {
            name: t(translations.my_event_create_update_page.open_registration),
            show: event.isOpen && event.allowRegistration === false,
            handler: () => toggleRegistration(true),
            icon: <GiArchiveRegister />,
            spinning: isOpeningClosingRegistration
        },
        {
            name: t(translations.my_event_create_update_page.close_registration),
            show: event.isOpen && event.allowRegistration === true,
            handler: () => toggleRegistration(false),
            icon: <HiLockClosed />,
            spinning: isOpeningClosingRegistration
        },
        {
            name: t(translations.my_event_create_update_page.close_event),
            handler: () => closeRace(),
            show: event.status === EventState.ON_GOING,
            icon: <GoChecklist />,
            spinning: isChangingStatus
        },
        {
            name: t(translations.my_event_create_update_page.delete),
            show: event.status === EventState.DRAFT,
            handler: () => setShowDeleteModal(true),
            icon: <BiTrash />,
            spinning: false
        }
    ];

    const menu = (
        <Menu>
            {menus.map((menu, index) => menu.show && <Spin spinning={menu.spinning}>
                <Menu.Item key={index} onClick={menu.handler} icon={menu.icon}>
                    {menu.name}
                </Menu.Item>
            </Spin>)}
        </Menu>
    );

    return (
        <>
            {
                mode === MODE.UPDATE && <Dropdown.Button overlay={menu} placement="bottomCenter">
                    {t(translations.my_event_create_update_page.event_options)}
                </Dropdown.Button>
            }
        </>
    )
}