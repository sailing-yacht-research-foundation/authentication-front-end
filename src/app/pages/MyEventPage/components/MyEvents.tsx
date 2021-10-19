import React from 'react';
import { Table, Space, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsChangingPage, selectResults } from '../slice/selectors';
import { selectPage, selectTotal } from 'app/pages/MyEventPage/slice/selectors';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BorderedButton, CreateButton, LottieMessage, LottieWrapper, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import { useMyEventListSlice } from '../slice';
import moment from 'moment';
import { DeleteRaceModal } from './DeleteEventModal';
import { Link } from 'react-router-dom';
import { renderEmptyValue, renderTimezoneInUTCOffset } from 'utils/helpers';
import { TIME_FORMAT } from 'utils/constants';
import ReactTooltip from 'react-tooltip';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const uuid = localStorage.getItem('uuid');

export const MyEvents = () => {

    const { t } = useTranslation();

    const columns = [
        {
            title: t(translations.my_event_list_page.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Link data-tip={t(translations.tip.view_event_detail)} to={`/events/${record.id}`}>{text}</Link>;
            },
        },
        {
            title: t(translations.my_event_list_page.city),
            dataIndex: 'locationName',
            key: 'location',
            render: (text) => renderEmptyValue(text),
        },
        {
            title: t(translations.my_event_list_page.country),
            dataIndex: 'locationName',
            key: 'location',
            render: (text) => renderEmptyValue(text),
        },
        {
            title: t(translations.my_event_list_page.start_date),
            dataIndex: 'approximateStartTime',
            key: 'start_date',
            render: (value, record) => moment(value).format(TIME_FORMAT.date_text_with_time)
                + ' ' + record.approximateStartTime_zone + ' '
                + renderTimezoneInUTCOffset(record.approximateStartTime_zone),
        },
        {
            title: t(translations.my_event_list_page.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                const userId = localStorage.getItem('user_id');
                if ((userId && record.createdById === userId) || (uuid === record.createdById))
                    return <Space size="middle">
                        <BorderedButton data-tip={t(translations.tip.update_this_event)} onClick={() => {
                            history.push(`/events/${record.id}/update`)
                        }} type="primary">{t(translations.my_event_list_page.update)}</BorderedButton>
                        <BorderedButton data-tip={t(translations.tip.delete_event)} danger onClick={() => showDeleteRaceModal(record)}>{t(translations.my_event_list_page.delete)}</BorderedButton>
                        <ReactTooltip/>
                    </Space>;

                return <></>;
            }
        },
    ];

    const results = useSelector(selectResults);

    const page = useSelector(selectPage);

    const total = useSelector(selectTotal);

    const history = useHistory();

    const dispatch = useDispatch();

    const { actions } = useMyEventListSlice();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [race, setRace] = React.useState<any>({});

    const isChangingPage = useSelector(selectIsChangingPage);

    React.useEffect(() => {
        dispatch(actions.getEvents(1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPaginationChanged = (page) => {
        dispatch(actions.getEvents(page));
    }

    const showDeleteRaceModal = (race) => {
        setShowDeleteModal(true);
        setRace(race);
    }

    const onRaceDeleted = () => {
        dispatch(actions.getEvents(page));
    }

    return (
        <>
            <DeleteRaceModal
                race={race}
                onRaceDeleted={onRaceDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoContainer>
                    <PageHeading>{t(translations.my_event_list_page.my_events)}</PageHeading>
                    <PageDescription>{t(translations.my_event_list_page.events_are_regattas)}</PageDescription>
                </PageInfoContainer>
                <CreateButton data-tip={t(translations.tip.host_a_new_event_with_races)} onClick={() => history.push("/events/create")} icon={<AiFillPlusCircle
                    style={{ marginRight: '5px' }}
                    size={18} />}>{t(translations.my_event_list_page.create_a_new_event)}</CreateButton>
            </PageHeaderContainerResponsive>
            {results.length > 0 ? (
                <Spin spinning={isChangingPage}>
                    <TableWrapper>
                        <Table scroll={{ x: "max-content" }} columns={columns}
                            dataSource={results} pagination={{
                                defaultPageSize: 10,
                                current: page,
                                total: total,
                                onChange: onPaginationChanged
                            }} />
                    </TableWrapper>
                </Spin>
            )
                : (<LottieWrapper>
                    <Lottie
                        options={defaultOptions}
                        height={400}
                        width={400} />
                    <CreateButton icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />} onClick={() => history.push("/events/create")}>{t(translations.my_event_list_page.create)}</CreateButton>
                    <LottieMessage>{t(translations.my_event_list_page.you_dont_have_any_event)}</LottieMessage>
                </LottieWrapper>)}
            <ReactTooltip />
        </>
    )
}