import React from 'react';
import { Table, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { BorderedButton, LottieMessage, LottieWrapper, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import moment from 'moment';
import { DeleteCompetitionUnitModal } from './DeleteCompetitionUnitModal';
import { getAllCompetitionUnits } from 'services/live-data-server/competition-units';
import { Link } from 'react-router-dom';
import { TIME_FORMAT } from 'utils/constants';
import ReactTooltip from 'react-tooltip';
import { CompetitionUnit } from 'types/CompetitionUnit';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const uuid = localStorage.getItem('uuid');

export const CompetitionUnitList = () => {

    const { t } = useTranslation();

    const raceColors = React.useRef({});

    const columns = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Link data-tip={t(translations.tip.view_this_race_in_the_playback)} to={`/playback/?raceId=${record.id}`}>{text}</Link>;
            }
        },
        {
            title: t(translations.general.event_name),
            dataIndex: 'eventName',
            key: 'eventName',
            render: (text, record) => <Link data-tip={t(translations.tip.view_this_race_event)} to={`/events/${record.calendarEvent?.id}`}>{record.calendarEvent?.name}</Link>,
        },
        {
            title: t(translations.general.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.general.action),
            key: 'action',
            width: '20%',
            render: (text, record) => {
                const userId = localStorage.getItem('user_id');
                if ((userId && userId === record.createdById) || (uuid === record.createdById))
                    return <Space size="middle">
                        <BorderedButton data-tip={t(translations.tip.update_race)} onClick={() => {
                            history.push(`/events/${record.calendarEventId}/races/${record.id}/update`);
                        }} type="primary">{t(translations.general.update)}</BorderedButton>
                        <BorderedButton data-tip={t(translations.tip.delete_race)} danger onClick={() => showDeleteRaceModal(record)}>{t(translations.general.delete)}</BorderedButton>
                        <ReactTooltip />
                    </Space>;

                return <></>;
            }
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [competitionUnit, setCompetitionUnit] = React.useState<Partial<CompetitionUnit>>({});

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page: number) => {
        setIsChangingPage(true);
        const response = await getAllCompetitionUnits(page);
        setIsChangingPage(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page,
                total: response.data?.count
            });
        }
    }

    const onPaginationChanged = (page: number) => {
        getAll(page);
    }

    const showDeleteRaceModal = (competitionUnit: CompetitionUnit) => {
        setShowDeleteModal(true);
        setCompetitionUnit(competitionUnit);
    }

    const onCompetitionUnitDeleted = () => {
        getAll(pagination.page);
    }


    const groupRowColorByEventName = () => {
        pagination.rows.forEach(row => {
            if (!raceColors.current[`${row.calendarEventId}`])
                raceColors.current[`${row.calendarEventId}`] = `volcano-${Math.floor(Math.random() * (5 - 1 + 1) + 1)}`;
        });
    }

    React.useEffect(() => {
        groupRowColorByEventName();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.rows]);

    return (
        <>
            <DeleteCompetitionUnitModal
                competitionUnit={competitionUnit}
                onCompetitionUnitDeleted={onCompetitionUnitDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />

            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <PageInfoContainer>
                        <PageHeading>{t(translations.competition_unit_list_page.competition_units)}</PageHeading>
                        <PageDescription>{t(translations.competition_unit_list_page.race_configurations_pair_classes_to_courses)}</PageDescription>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
            </PageHeaderContainerResponsive>
            {pagination.rows.length > 0 ? (
                <Spin spinning={isChangingPage}>
                    <TableWrapper>
                        <Table scroll={{ x: "max-content" }} columns={columns}
                            rowClassName={(record) => raceColors.current[`${record.calendarEventId}`]}
                            dataSource={pagination.rows} pagination={{
                                defaultPageSize: 10,
                                current: pagination.page,
                                total: pagination.total,
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
                    <LottieMessage>{t(translations.competition_unit_list_page.you_dont_have_any_competition_unit)}</LottieMessage>
                </LottieWrapper>)}
            <ReactTooltip />
        </>
    )
}