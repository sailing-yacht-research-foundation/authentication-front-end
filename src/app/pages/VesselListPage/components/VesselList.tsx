import React from 'react';
import { Table, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { AiFillPlusCircle } from 'react-icons/ai';
import {
    BorderedButton,
    CreateButton,
    LottieMessage,
    LottieWrapper,
    PageInfoContainer,
    PageHeaderContainerResponsive,
    TableWrapper,
    PageHeading,
    PageDescription
} from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import moment from 'moment';
import { DeleteVesselModal } from './DeleteVesselModal';
import { getMany } from 'services/live-data-server/vessels';
import { Link } from 'react-router-dom';
import { renderEmptyValue } from 'utils/helpers';
import { TIME_FORMAT } from 'utils/constants';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const uuid = localStorage.getItem('uuid');

export const VesselList = () => {

    const { t } = useTranslation();

    const columns = [
        {
            title: t(translations.vessel_list_page.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
            render: (text, record) => {
                const userId = localStorage.getItem('user_id');
                if ((userId && userId === record.createdById) || (uuid === record.createdById))
                    return <Link to={`/boats/${record.id}/update`}>{text}</Link>;
                return text;
            },
        },
        {
            title: t(translations.vessel_list_page.length_in_meters),
            dataIndex: 'lengthInMeters',
            key: 'lengthInMeters',
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.vessel_list_page.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.competition_unit_list_page.action),
            key: 'action',
            render: (text, record) => {
                const userId = localStorage.getItem('user_id');
                if ((userId && userId === record.createdById) || (uuid === record.createdById))
                    return <Space size="middle">
                        <BorderedButton onClick={() => {
                            history.push(`/boats/${record.id}/update`);
                        }} type="primary">{t(translations.vessel_list_page.update)}</BorderedButton>
                        <BorderedButton danger onClick={() => showDeleteRaceModal(record)}>{t(translations.vessel_list_page.delete)}</BorderedButton>
                    </Space>;

                return <></>;
            },
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

    const [vessel, setVessel] = React.useState<any>({});

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page) => {
        setIsChangingPage(true);
        const response = await getMany(pagination.page);
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
        setVessel(competitionUnit);
    }

    const onVesselDeleted = () => {
        getAll(pagination.page);
    }

    return (
        <>
            <DeleteVesselModal
                vessel={vessel}
                onVesselDeleted={onVesselDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoContainer>
                    <PageHeading>{t(translations.vessel_list_page.vessels)}</PageHeading>
                    <PageDescription>{t(translations.vessel_list_page.vessel_are_yatchs)}</PageDescription>
                </PageInfoContainer>
                <CreateButton onClick={() => history.push("/boats/create")} icon={<AiFillPlusCircle
                    style={{ marginRight: '5px' }}
                    size={18} />}>{t(translations.vessel_list_page.create_a_new_vessel)}</CreateButton>
            </PageHeaderContainerResponsive>
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
                        size={18} />} onClick={() => history.push("/boats/create")}>{t(translations.vessel_list_page.create)}</CreateButton>
                    <LottieMessage>{t(translations.vessel_list_page.you_dont_have_any_vessels)}</LottieMessage>
                </LottieWrapper>)}
        </>
    )
}