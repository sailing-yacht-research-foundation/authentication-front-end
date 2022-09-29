import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Spin, Modal, Space, Tooltip, Button } from 'antd';
import { downloadGrib, getSlicedGribs } from 'services/live-data-server/competition-units';
import { BorderedButton, TableWrapper } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import styled from 'styled-components';
import { media } from 'styles/media';
import moment from 'moment';
import { TIME_FORMAT } from 'utils/constants';

export const Grib = ({ competitionUnitId }: { competitionUnitId: string }) => {

    const { t } = useTranslation();

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const columns = [
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            render: (text) => {
                return text;
            }
        },
        {
            title: 'Model Name',
            dataIndex: 'modelName',
            key: 'model',
            render: (text) => {
                return text;
            }
        },
        {
            title: t(translations.general.start_time),
            dataIndex: 'startTime',
            key: 'startTime',
            render: (value) => {
                return moment(value).format(TIME_FORMAT.date_text_with_time);
            }
        },
        {
            title: t(translations.my_event_create_update_page.end_time),
            dataIndex: 'endTime',
            key: 'endTime',
            render: (value) => {
                return moment(value).format(TIME_FORMAT.date_text_with_time);
            }
        },
        {
            title: t(translations.playback_page.levels),
            dataIndex: 'levels',
            key: 'levels',
            render: (value) => {
                return value?.join(', ');
            }
        },
        {
            title: 'Variables',
            dataIndex: 'variables',
            key: 'variables',
            render: (value, record) => {
                return value?.join(', ');
            }
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


    React.useEffect(() => {
        if (showModal)
            getAll(1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    const performDownloadGrib = (grib) => {
        downloadGrib(competitionUnitId, grib.id);
    }

    const getAll = async (page: number, size: number) => {
        setIsChangingPage(true);
        const response = await getSlicedGribs(competitionUnitId, page, size);
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

    const onPaginationChanged = (page: number, size) => {
        getAll(page, size);
    }

    return (
        <>
            <Tooltip title={t(translations.tip.show_grib_files)}>
                <Button onClick={() => setShowModal(true)} type='primary'>{t(translations.playback_page.gribs)}</Button>
            </Tooltip>
            <StyledModal width={800} title={'Grib Files'} visible={showModal}>
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


