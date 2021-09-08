import React from 'react';
import { Table, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BorderedButton, CreateButton, LottieMessage, LottieWrapper, PageHeaderContainer, PageHeaderText, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
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

    const { t } = useTranslation();

    const columns = [
        {
            title: t(translations.competition_unit_list_page.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link to={`/my-races/${record.calendarEventId}/competition-units/${record.id}/update`}>{text}</Link>,
            width: '20%',
        },
        {
            title: t(translations.competition_unit_list_page.start_time),
            dataIndex: 'startTime',
            key: 'startTime',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: t(translations.competition_unit_list_page.approximate_start),
            dataIndex: 'approximateStart',
            key: 'approximateStart',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: t(translations.competition_unit_list_page.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: t(translations.competition_unit_list_page.action),
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/my-races/${record.calendarEventId}/competition-units/${record.id}/update`);
                    }} type="primary">{t(translations.competition_unit_list_page.update)}</BorderedButton>
                    <BorderedButton danger onClick={() => showDeleteRaceModal(record)}>{t(translations.competition_unit_list_page.delete)}</BorderedButton>
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
                <PageHeaderText>{t(translations.competition_unit_list_page.competition_units)}</PageHeaderText>
                <CreateButton onClick={() => history.push("/competition-units/create")} icon={<AiFillPlusCircle
                    style={{ marginRight: '5px' }}
                    size={18} />}>{t(translations.competition_unit_list_page.create)}</CreateButton>
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
                    <LottieMessage>{t(translations.competition_unit_list_page.you_dont_have_any_competition_unit)}</LottieMessage>
                </LottieWrapper>)}
        </>
    )
}