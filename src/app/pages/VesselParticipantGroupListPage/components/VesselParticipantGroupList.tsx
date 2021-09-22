import React from 'react';
import { Table, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { BorderedButton, LottieMessage, LottieWrapper, PageHeaderContainer, PageHeaderText, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import moment from 'moment';
import { DeleteVesselParticipantGroupModal } from './DeleteVesselParticipantGroupModal';
import { getAllVesselParticipantGroups } from 'services/live-data-server/vessel-participant-group';
import { Link } from 'react-router-dom';
import { TIME_FORMAT } from 'utils/constants';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const userId = localStorage.getItem('user_id');
const uuid = localStorage.getItem('uuid');

export const VesselParticipantGroupList = () => {

    const { t } = useTranslation();

    const raceColors = React.useRef({});

    const columns = [
        {
            title: t(translations.vessel_participant_group_list_page.group_id),
            dataIndex: 'vesselParticipantGroupId',
            key: 'vesselParticipantGroupId',
            render: (value) => value
        },
        {
            title: t(translations.vessel_participant_group_list_page.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.vessel_participant_group_list_page.action),
            key: 'action',
            width: '20%',
            render: (text, record) => {
                if ((userId && userId === record.createdById) || (uuid === record.createdById))
                    return <Space size="middle">
                        <BorderedButton onClick={() => {
                            history.push(`/events/${record.calendarEventId}/races/${record.id}/update`);
                        }} type="primary">{t(translations.vessel_participant_group_list_page.update)}</BorderedButton>
                        <BorderedButton danger onClick={() => showDeleteRaceModal(record)}>{t(translations.vessel_participant_group_list_page.delete)}</BorderedButton>
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

    const [competitionUnit, setCompetitionUnit] = React.useState<any>({});

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page) => {
        setIsChangingPage(true);
        const response = await getAllVesselParticipantGroups(pagination.page);
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

    const onPaginationChanged = (page) => {
        getAll(page);
    }

    const showDeleteRaceModal = (competitionUnit) => {
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
            <DeleteVesselParticipantGroupModal
                competitionUnit={competitionUnit}
                onCompetitionUnitDeleted={onCompetitionUnitDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainer>
                <PageHeaderText>{t(translations.vessel_participant_group_list_page.vessel_participant_groups)}</PageHeaderText>
            </PageHeaderContainer>
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
                    <LottieMessage>{t(translations.vessel_participant_group_list_page.you_dont_have_any_vessel_participant_group)}</LottieMessage>
                </LottieWrapper>)}
        </>
    )
}