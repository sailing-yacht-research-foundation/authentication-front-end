import React from 'react';
import { Table, Space, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BorderedButton, CreateButton, LottieMessage, LottieWrapper, PageHeaderContainer, PageHeaderText, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import { useMyRaceListSlice } from '../slice';
import moment from 'moment';
import { DeleteCompetitionUnitModal } from './DeleteCompetitionUnitModal';
import { getAllCompetitionUnits } from 'services/live-data-server/competition-units';
import { Link } from 'react-router-dom';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const CompetitionUnitList = () => {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link to={`/my-races/${record.calendarEventId}/competition-units/${record.id}/update`}>{text}</Link>,
            width: '20%',
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: 'Approximate Start',
            dataIndex: 'approximateStart',
            key: 'approximateStart',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: 'Created Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/my-races/${record.calendarEventId}/competition-units/${record.id}/update`);
                    }} type="primary">Update</BorderedButton>
                    <BorderedButton danger onClick={() => showDeleteRaceModal(record)}>Delete</BorderedButton>
                </Space>
            ),
            width: '20%',
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const { t } = useTranslation();

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [competitionUnit, setCompetitionUnit] = React.useState<any>({});

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        getAll(1);
    }, []);

    const getAll = async (page) => {
        setIsChangingPage(true);
        const response = await getAllCompetitionUnits(pagination.page);
        setIsChangingPage(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page
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

    return (
        <>
            <DeleteCompetitionUnitModal
                competitionUnit={competitionUnit}
                onCompetitionUnitDeleted={onCompetitionUnitDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainer>
                <PageHeaderText>Competition Units</PageHeaderText>
                <CreateButton onClick={() => history.push("/competition-units/create")} icon={<AiFillPlusCircle
                    style={{ marginRight: '5px' }}
                    size={18} />}>Create a competition unit</CreateButton>
            </PageHeaderContainer>
            {pagination.rows.length > 0 ? (
                <Spin spinning={isChangingPage}>
                    <TableWrapper>
                        <Table scroll={{ x: "max-content" }} columns={columns}
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
                    <CreateButton icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />} onClick={() => history.push("/competition-units/create")}>Create</CreateButton>
                    <LottieMessage>{t(translations.my_race_list_page.you_dont_have_any_race)}</LottieMessage>
                </LottieWrapper>)}
        </>
    )
}