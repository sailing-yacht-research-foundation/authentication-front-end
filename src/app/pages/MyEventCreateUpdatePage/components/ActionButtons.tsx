import React from 'react';
import { Spin, Dropdown, Menu, Button, Space } from 'antd';
import { EventState, MODE } from 'utils/constants';
import { useTranslation } from 'react-i18next';
import { cancelCalendarEvent, closeCalendarEvent } from 'services/live-data-server/event-calendars';
import { translations } from 'locales/translations';
import { toast } from 'react-toastify';
import { GoChecklist } from 'react-icons/go';
import { BiImport, BiTrash } from 'react-icons/bi';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { MdFreeCancellation } from 'react-icons/md';
import styled from 'styled-components';
import { media } from 'styles/media';
import { DeleteButton, IconWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router-dom';
import { ConfirmModal } from 'app/components/ConfirmModal';

export const ActionButtons = ({
    mode,
    event,
    setShowDeleteModal,
    setEvent,
    eventId,
    setShowImportEventModal
}) => {

    const { t } = useTranslation();

    const history = useHistory();

    const [isChangingStatus, setIsChangingStatus] = React.useState<boolean>(false);

    const [showConfirmingCancelEvent, setShowConfirmingCancelEvent] = React.useState<boolean>(false);

    const [showConfirmingCloseEvent, setShowConfirmingCloseEvent] = React.useState<boolean>(false);

    const closeEvent = async () => {
        const response = await closeCalendarEvent(eventId);

        if (response.success) {
            setEvent({
                ...event,
                status: EventState.COMPLETED
            });
            toast.success(t(translations.my_event_create_update_page.successfully_closed_this_event));
            if (event.isSimulation) {
                history.push('/events');
            }
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowConfirmingCloseEvent(false);
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
            });
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowConfirmingCancelEvent(false);
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
            name: t(translations.my_event_create_update_page.cancel_event),
            show: event.status === EventState.SCHEDULED,
            icon: <MdFreeCancellation />,
            spinning: isChangingStatus,
            handler: () => setShowConfirmingCancelEvent(true),
            isDelete: false,
        },
        {
            name: t(translations.my_event_create_update_page.close_event),
            handler: () => setShowConfirmingCloseEvent(true),
            show: event.status === EventState.ON_GOING,
            icon: <GoChecklist />,
            spinning: isChangingStatus,
            isDelete: false,
        },
        {
            name: t(translations.general.delete),
            show: event.status === EventState.DRAFT,
            handler: () => setShowDeleteModal(true),
            icon: <BiTrash />,
            spinning: false,
            isDelete: true
        }
    ];

    const menu = (
        <Menu>
            {menus.map((menu, index) => menu.show && <Spin spinning={menu.spinning} key={index}>
                <Menu.Item onClick={menu.handler} icon={menu.icon}>
                    {menu.name}
                </Menu.Item>
            </Spin>)}
        </Menu>
    );

    if (mode === MODE.UPDATE)
        return (
            <>
                <ConfirmModal
                    showModal={showConfirmingCancelEvent}
                    onOk={cancelEvent}
                    loading={isChangingStatus}
                    onCancel={() => setShowConfirmingCancelEvent(false)}
                    title={t(translations.my_event_create_update_page.cancel_this_event)}
                    content={t(translations.my_event_create_update_page.you_are_canceling_this_event)} />
                <ConfirmModal
                    showModal={showConfirmingCloseEvent}
                    onOk={closeEvent}
                    loading={isChangingStatus}
                    onCancel={() => setShowConfirmingCloseEvent(false)}
                    title={t(translations.my_event_create_update_page.close_this_event)}
                    content={t(translations.my_event_create_update_page.you_are_closing_this_event)} />
                <MobileButtonsWrapper>
                    <Dropdown.Button trigger={['click']} overlay={menu} placement="bottomCenter">
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
        )

    return <></>;
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
