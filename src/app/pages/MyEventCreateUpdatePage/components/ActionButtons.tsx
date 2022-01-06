import React from 'react';
import { Spin, Dropdown, Menu, Button, Space } from 'antd';
import { EventState, MODE } from 'utils/constants';
import { useTranslation } from 'react-i18next';
import { cancelCalendarEvent, closeCalendarEvent, toggleOpenForRegistration } from 'services/live-data-server/event-calendars';
import { translations } from 'locales/translations';
import { toast } from 'react-toastify';
import { GrGroup } from 'react-icons/gr';
import { HiLockClosed } from 'react-icons/hi';
import { GiArchiveRegister } from 'react-icons/gi';
import { GoChecklist } from 'react-icons/go';
import { BiImport, BiTrash } from 'react-icons/bi';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { MdFreeCancellation } from 'react-icons/md';
import styled from 'styled-components';
import { media } from 'styles/media';
import { DeleteButton } from 'app/components/SyrfGeneral';

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

    const closeEvent = async () => {
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

    const cancelEvent = async () => {
        setIsChangingStatus(true);
        const response = await cancelCalendarEvent(eventId);
        setIsChangingStatus(false);

        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_canceled_this_event));
            setEvent({
                ...event,
                status: EventState.CANCELED
            })
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
            handler: () => setShowImportEventModal(true),
            isDelete: false,
        },
        {
            name: t(translations.my_event_create_update_page.assign_admins),
            show: true,
            icon: <GrGroup />,
            spinning: false,
            handler: () => showAssignEventAsGroupAdminModal(),
            isDelete: false,
        },
        {
            name: t(translations.my_event_create_update_page.cancel_event),
            show: event.status === EventState.SCHEDULED,
            icon: <MdFreeCancellation />,
            spinning: isChangingStatus,
            handler: () => cancelEvent(),
            isDelete: false,
        },
        {
            name: t(translations.my_event_create_update_page.open_registration),
            show: event.isOpen && event.allowRegistration === false && ![EventState.CANCELED, EventState.COMPLETED].includes(event.status),
            handler: () => toggleRegistration(true),
            icon: <GiArchiveRegister />,
            spinning: isOpeningClosingRegistration,
            isDelete: false,
        },
        {
            name: t(translations.my_event_create_update_page.close_registration),
            show: event.isOpen && event.allowRegistration === true && ![EventState.CANCELED, EventState.COMPLETED].includes(event.status),
            handler: () => toggleRegistration(false),
            icon: <HiLockClosed />,
            spinning: isOpeningClosingRegistration,
            isDelete: false,
        },
        {
            name: t(translations.my_event_create_update_page.close_event),
            handler: () => closeEvent(),
            show: event.status === EventState.ON_GOING,
            icon: <GoChecklist />,
            spinning: isChangingStatus,
            isDelete: false,
        },
        {
            name: t(translations.my_event_create_update_page.delete),
            show: event.status === EventState.DRAFT,
            handler: () => setShowDeleteModal(true),
            icon: <BiTrash />,
            spinning: false,
            isDelete: true
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
                mode === MODE.UPDATE &&
                <>
                    <MobileButtonsWrapper>
                        <Dropdown.Button overlay={menu} placement="bottomCenter">
                            {t(translations.my_event_create_update_page.event_options)}
                        </Dropdown.Button>
                    </MobileButtonsWrapper>
                    <DesktopButtonsWrapper>
                        <Space size={10} wrap style={{ justifyContent: 'flex-end' }}>
                            {menus.map((item, index) => {
                                return item.show && <Spin key={index} spinning={item.spinning}>
                                    {!item.isDelete ? <Button onClick={item.handler} icon={<IconWrapper>{item.icon}</IconWrapper>}>{item.name}</Button> :
                                        <DeleteButton onClick={item.handler} icon={<IconWrapper>{item.icon}</IconWrapper>}>{item.name}</DeleteButton>}
                                </Spin>
                            })}
                        </Space>
                    </DesktopButtonsWrapper>
                </>
            }
        </>
    )
}

const DesktopButtonsWrapper = styled.div`
    display: none;
    ${media.medium`
        display: block;
    `}
`;

const MobileButtonsWrapper = styled.div`
    display: block;
    ${media.medium`
        display: none;
    `}
`;

const IconWrapper = styled.span`
    margin-right: 5px;
`;