import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Spin, Modal, Space, Tooltip, Button } from 'antd';
import { downloadGrib, getSlicedGribs } from 'services/live-data-server/competition-units';
import { BorderedButton, TableWrapper } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import styled from 'styled-components';
import { media } from 'styles/media';
import moment from 'moment';
import { gribModels, TIME_FORMAT } from 'utils/constants';
import { TableFiltering } from 'types/TableFiltering';
import { TableSorting } from 'types/TableSorting';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import { getFilterTypeBaseOnColumn, parseFilterParamBaseOnFilterType, usePrevious, checkIfLastFilterAndSortValueDifferentToCurrent, handleOnTableStateChanged } from 'utils/helpers';
import { getColumnCheckboxProps, getColumnTimeProps } from 'app/components/TableFilter';

export const Grib = ({ competitionUnitId }: { competitionUnitId: string }) => {

    const { t } = useTranslation();

    const [filter, setFilter] = React.useState<TableFiltering[]>([]);

    const [sorter, setSorter] = React.useState<Partial<TableSorting>>({});

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: any,
    ) => {
        let param: any = selectedKeys[0];
        const filterType = getFilterTypeBaseOnColumn(dataIndex, ['startTime', 'endTime'], ['model']);
        param = parseFilterParamBaseOnFilterType(param, filterType);
        confirm();
        setFilter([...filter.filter(f => f.key !== dataIndex), ...[{ key: dataIndex, value: param, type: filterType }]]);
    };

    const handleReset = (clearFilters: () => void, columnToReset: string) => {
        clearFilters();
        setFilter([...filter.filter(f => f.key !== columnToReset)]);
    };

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const columns = [
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            render: (text) => {
                return text;
            },
            ...getColumnCheckboxProps('model', gribModels, handleSearch, handleReset),
            sorter: true,
        },
        {
            title: 'Model Name',
            dataIndex: 'modelName',
            key: 'modelName',
            render: (text) => {
                return text;
            },
        },
        {
            title: t(translations.general.start_time),
            dataIndex: 'startTime',
            key: 'startTime',
            render: (value) => {
                return moment(value).format(TIME_FORMAT.date_text_with_time);
            },
            ...getColumnTimeProps('startTime', handleSearch, handleReset),
            sorter: true,
        },
        {
            title: t(translations.my_event_create_update_page.end_time),
            dataIndex: 'endTime',
            key: 'endTime',
            render: (value) => {
                return moment(value).format(TIME_FORMAT.date_text_with_time);
            },
            ...getColumnTimeProps('endTime', handleSearch, handleReset),
            sorter: true,
        },
        {
            title: t(translations.playback_page.levels),
            dataIndex: 'levels',
            key: 'levels',
            render: (value) => {
                return value?.join(', ');
            },
            sorter: true,
        },
        {
            title: 'Variables',
            dataIndex: 'variables',
            key: 'variables',
            render: (value, record) => {
                return value?.join(', ');
            },
            sorter: true,
        },
        {
            title: t(translations.general.action),
            key: 'action',
            render: (text, record) => {
                return <Space size="small">
                    <Tooltip title={t(translations.general.download)}>
                        <BorderedButton onClick={() => performDownloadGrib(record)}>{t(translations.general.download)}</BorderedButton>
                    </Tooltip>
                </Space>;
            }
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        size: 10
    });

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    const previousValue = usePrevious<{ sorter: Partial<TableSorting>, filter: TableFiltering[] }>({ filter, sorter });

    React.useEffect(() => {
        if (showModal)
            getAll(1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    React.useEffect(() => {
        if (checkIfLastFilterAndSortValueDifferentToCurrent(previousValue?.filter, previousValue?.sorter, filter, sorter)) {
            getAll(pagination.page, pagination.size);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, sorter]);

    const performDownloadGrib = (grib) => {
        downloadGrib(competitionUnitId, grib.id, String(grib.fileType).toLowerCase());
    }

    const getAll = async (page, size) => {
        setIsChangingPage(true);
        const response = await getSlicedGribs(competitionUnitId, page, size, filter, sorter);
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

    return (
        <>
            <Tooltip title={t(translations.tip.show_grib_files)}>
                <Button onClick={() => setShowModal(true)} type='primary'>{t(translations.playback_page.gribs)}</Button>
            </Tooltip>
            <StyledModal
             cancelButtonProps={{ style: { display: 'none' } }}
             okButtonProps={{ style: { display: 'none' } }}
             onCancel={() => setShowModal(false)}
             title={'Grib Files'} visible={showModal}>
                <Spin spinning={isChangingPage}>
                    <TableWrapper>
                        <Table scroll={{ x: "max-content" }} columns={columns}
                            dataSource={pagination.rows} pagination={{
                                defaultPageSize: 10,
                                current: pagination.page,
                                total: pagination.total,

                            }}
                            onChange={(antdPagination, antdFilters, antSorter) =>
                                handleOnTableStateChanged(antdPagination,
                                    antdFilters,
                                    antSorter,
                                    (param) => setSorter(param)
                                    , pagination.page, pagination.size,
                                    () => getAll(antdPagination.current, antdPagination.pageSize)
                                )
                            } />

                    </TableWrapper>
                </Spin>
            </StyledModal>
        </>
    );
}

const StyledModal = styled(Modal)`
    width: 100% !important;

    .ant-modal-content {
        width: 100%;
    }

    ${media.medium`
        width: 1000px !important;

        .ant-modal-content {
            width: 1000px;
        }
    `}
`;


