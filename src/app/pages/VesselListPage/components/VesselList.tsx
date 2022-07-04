import React from 'react';
import { Table, Space, Spin, Tooltip } from 'antd';
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
import { checkIfLastFilterAndSortValueDifferentToCurrent, getFilterTypeBaseOnColumn, handleOnTableStateChanged, parseFilterParamBaseOnFilterType, renderEmptyValue, truncateName, usePrevious } from 'utils/helpers';
import { TIME_FORMAT } from 'utils/constants';
import { Vessel } from 'types/Vessel';
import { TableSorting } from 'types/TableSorting';
import { TableFiltering } from 'types/TableFiltering';
import { getColumnSearchProps, getColumnTimeProps } from 'app/components/TableFilter';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import { FaTrash } from 'react-icons/fa';
import { EditFilled } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { StyleConstants } from 'styles/StyleConstants';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const VesselList = () => {

    const { t } = useTranslation();

    const [sorter, setSorter] = React.useState<Partial<TableSorting>>({});

    const [filter, setFilter] = React.useState<TableFiltering[]>([]);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: any,
    ) => {
        let param: any = selectedKeys[0];
        const filterType = getFilterTypeBaseOnColumn(dataIndex, ['approximateStartTime', 'createdAt']);
        param = parseFilterParamBaseOnFilterType(param, filterType);
        confirm();
        setFilter([...filter.filter(f => f.key !== dataIndex), ...[{ key: dataIndex, value: param, type: filterType }]]);
    };

    const handleReset = (clearFilters: () => void, columnToReset: string) => {
        clearFilters();
        setFilter([...filter.filter(f => f.key !== columnToReset)]);
    };

    const columns: any = [
        {
            title: t(translations.general.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
            sorter: true,
            ...getColumnSearchProps('publicName', handleSearch, handleReset, 'publicName'),
            fixed: !isMobile ? 'left' : false,
            render: (text, record) => {
                return <Tooltip title={text}>
                    <Link to={`/boats/${record.id}/update`}>{truncateName(text)}</Link>
                </Tooltip>;
            },
        },
        {
            title: t(translations.vessel_list_page.length_in_meters),
            dataIndex: 'lengthInMeters',
            key: 'lengthInMeters',
            sorter: true,
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.vessel_create_update_page.sail_number),
            dataIndex: 'sailNumber',
            key: 'sailNumber',
            ...getColumnSearchProps('sailNumber', handleSearch, handleReset, 'sailNumber'),
            sorter: true,
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.vessel_create_update_page.model),
            dataIndex: 'model',
            key: 'model',
            sorter: true,
            ...getColumnSearchProps('model', handleSearch, handleReset, 'model'),
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.vessel_list_page.role),
            dataIndex: 'isOwner',
            key: 'isOwner',
            render: (value, record) => record?.isOwner ? t(translations.vessel_list_page.owner) : t(translations.vessel_list_page.admin),
        },
        {
            title: t(translations.vessel_list_page.is_default_boat),
            dataIndex: 'isDefaultVessel',
            key: 'isDefaultVessel',
            sorter: true,
            render: (value, record) => String(value),
        },
        {
            title: t(translations.general.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            ...getColumnTimeProps('createdAt', handleSearch, handleReset, 'createdAt'),
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.general.action),
            key: 'action',
            fixed: !isMobile ? 'right' : false,
            render: (text, record) => {
                return <Space size="small">
                    <Tooltip title={t(translations.tip.update_this_boat)}>
                        <BorderedButton icon={<EditFilled />} onClick={() => {
                            history.push(`/boats/${record.id}/update`);
                        }} type="primary" />
                    </Tooltip>
                    <Tooltip title={t(translations.tip.delete_boat)}>
                        <BorderedButton danger icon={<FaTrash />} onClick={() => showDeleteVesselModal(record)} />
                    </Tooltip>
                </Space>;
            },
            width: '20%',
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        pageSize: 10
    });

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [vessel, setVessel] = React.useState<Partial<Vessel>>({});

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    const previousValue = usePrevious<{ sorter: Partial<TableSorting> }>({ sorter });

    React.useEffect(() => {
        if (checkIfLastFilterAndSortValueDifferentToCurrent(undefined, previousValue?.sorter, undefined, sorter)) {
            getAll(pagination.page, pagination.size);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorter]);

    React.useEffect(() => {
        getAll(pagination.page, pagination.size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page, size) => {
        setIsChangingPage(true);
        const response = await getMany(page, size, filter, sorter);
        setIsChangingPage(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data.rows,
                page: page,
                total: response.data.count,
                pageSize: response.data.size
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
                <Tooltip title={t(translations.tip.create_a_new_boat)}>
                    <CreateButton
                        onClick={() => history.push("/boats/create")} icon={<AiFillPlusCircle
                            style={{ marginRight: '5px' }}
                            size={18} />}>
                        {t(translations.vessel_list_page.create_a_new_vessel)}
                    </CreateButton>
                </Tooltip>
            </PageHeaderContainerResponsive>
            <Spin spinning={isChangingPage}>
                <TableWrapper>
                    <Table scroll={{ x: "max-content", y: StyleConstants.TABLE_MAX_SCROLL_HEIGHT }}
                        onChange={(_1, _2, sorter) => handleOnTableStateChanged(sorter, setSorter)}
                        columns={columns}
                        locale={{
                            emptyText: (<LottieWrapper>
                                <Lottie
                                    options={defaultOptions}
                                    height={400}
                                    width={400} />
                                <LottieMessage>{t(translations.vessel_list_page.you_dont_have_any_vessels)}</LottieMessage>
                            </LottieWrapper>)
                        }}
                        dataSource={pagination.rows} pagination={{
                            defaultPageSize: 10,
                            current: pagination.page,
                            total: pagination.total,
                            pageSize: pagination.pageSize,
                            onChange: onPaginationChanged,
                        }} />
                </TableWrapper>
            </Spin>

        </>
    )
}