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
import ReactTooltip from 'react-tooltip';
import { Vessel } from 'types/Vessel';

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
                return <Link data-tip={t(translations.tip.update_this_boat)} to={`/boats/${record.id}/update`}>{text}</Link>;
            },
        },
        {
            title: t(translations.vessel_list_page.length_in_meters),
            dataIndex: 'lengthInMeters',
            key: 'lengthInMeters',
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.vessel_list_page.role),
            dataIndex: 'role',
            key: 'role',
            render: (value, record) => record?.isOwner ? t(translations.vessel_list_page.owner) : t(translations.vessel_list_page.admin),
        },
        {
            title: t(translations.vessel_list_page.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.vessel_list_page.action),
            key: 'action',
            render: (text, record) => {
                    return <Space size="middle">
                        <BorderedButton data-tip={t(translations.tip.update_this_boat)} onClick={() => {
                            history.push(`/boats/${record.id}/update`);
                        }} type="primary">{t(translations.vessel_list_page.update)}</BorderedButton>
                        <BorderedButton data-tip={t(translations.tip.delete_boat)} danger onClick={() => showDeleteVesselModal(record)}>{t(translations.vessel_list_page.delete)}</BorderedButton>
                        <ReactTooltip />
                    </Space>;
            },
            width: '20%',
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        size: 10
    });

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [vessel, setVessel] = React.useState<Partial<Vessel>>({});

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        getAll(1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page, size) => {
        setIsChangingPage(true);
        const response = await getMany(page, size);
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

    const onPaginationChanged = (page, size) => {
        getAll(page, size);
    }

    const showDeleteVesselModal = (vessel) => {
        setShowDeleteModal(true);
        setVessel(vessel);
    }

    const onVesselDeleted = () => {
        getAll(pagination.page, pagination.size);
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
                <CreateButton
                    data-tip={t(translations.tip.create_a_new_boat)}
                    onClick={() => history.push("/boats/create")} icon={<AiFillPlusCircle
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
                    <LottieMessage>{t(translations.vessel_list_page.you_dont_have_any_vessels)}</LottieMessage>
                </LottieWrapper>)}
            <ReactTooltip />
        </>
    )
}