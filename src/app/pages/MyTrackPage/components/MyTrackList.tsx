import React from 'react';
import { Table, Spin, Space, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import styled from 'styled-components';
import { translations } from 'locales/translations';
import moment from 'moment';
import { AiOutlineMinus } from 'react-icons/all'

import { downloadTrack } from 'services/live-data-server/my-tracks';
import NoResult from '../assets/no-results.json';
import { LottieMessage, LottieWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import { Link } from 'react-router-dom';
import { TIME_FORMAT } from 'utils/constants';
import { timeMillisToHours } from 'utils/time';
import KMLIcon from '../assets/kml.png';
import GPXIcon from '../assets/gpx.png';
import { BiTrash } from 'react-icons/bi';
import { Track } from 'types/Track';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { toast } from 'react-toastify';
import { checkIfLastFilterAndSortValueDifferentToCurrent, getFilterTypeBaseOnColumn, handleOnTableStateChanged, parseFilterParamBaseOnFilterType, renderEmptyValue, showToastMessageOnRequestError, truncateName, usePrevious } from 'utils/helpers';
import { deleteEvent } from 'services/live-data-server/event-calendars';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import { getColumnSearchProps, getColumnTimeProps } from 'app/components/TableFilter';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter, selectIsLoading, selectPagination, selectSorter } from '../slice/selectors';
import { useMyTracksSlice } from '../slice';
import { TableFiltering } from 'types/TableFiltering';
import { TableSorting } from 'types/TableSorting';
import { isMobile } from 'react-device-detect';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const MyTrackList = () => {

    const { t } = useTranslation();

    const sorter = useSelector(selectSorter);

    const filter = useSelector(selectFilter);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [track, setTrack] = React.useState<Partial<Track>>({});

    const [isDeletingTrack, setIsDeletingTrack] = React.useState<boolean>(false);

    const pagination = useSelector(selectPagination);

    const dispatch = useDispatch();

    const { actions } = useMyTracksSlice();

    const isLoading = useSelector(selectIsLoading);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: any,
    ) => {
        let param: any = selectedKeys[0];
        const filterType = getFilterTypeBaseOnColumn(dataIndex, ['createdAt']);
        param = parseFilterParamBaseOnFilterType(param, filterType);
        confirm();
        dispatch(actions.setFilter({ key: dataIndex, value: param, type: filterType }));
    };

    const handleReset = (clearFilters: () => void, columnToReset: string) => {
        clearFilters();
        dispatch(actions.clearFilter(columnToReset));
    };

    const columns: any = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name', handleSearch, handleReset),
            sorter: true,
            fixed: !isMobile ? 'left' : false,
            render: (text, record) => {
                const trackName = !record.event?.isPrivate ? [record.event.name, record.competitionUnit.name].filter(Boolean).join(' - ') : record.event?.name
                if (record.competitionUnit)
                    return (
                        <FlexWrapper>
                            {record.competitionUnit?.openGraphImage ?
                                <OpenGraphImage src={record.competitionUnit.openGraphImage} alt={record.event.name} /> :
                                <NoImageContainer>
                                    <AiOutlineMinus style={{ color: '#FFFFFF', fontSize: '20px' }} />
                                </NoImageContainer>
                            }
                            <Tooltip title={t(translations.my_tracks_page.watch_this_track, { trackName: trackName })}>
                                <Link to={() => renderTrackParamIfExists(record)}>{truncateName(trackName, 50)}</Link>
                            </Tooltip>
                        </FlexWrapper>
                    );
                return (
                    <FlexWrapper>
                        <NoImageContainer>
                            <AiOutlineMinus style={{ color: '#FFFFFF', fontSize: '20px' }} />
                        </NoImageContainer>
                        <div>{truncateName(record.event?.name, 50)}</div>
                    </FlexWrapper>
                );
            }
        },
        {
            title: t(translations.my_tracks_page.type),
            dataIndex: 'event.isPrivate',
            key: 'event.isPrivate',
            sorter: true,
            render: (text, record) => {
                return record.event?.isPrivate ? t(translations.my_tracks_page.track_now) : t(translations.my_tracks_page.event_track)
            }
        },
        {
            title: t(translations.general.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            ...getColumnTimeProps('createdAt', handleSearch, handleReset),
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.my_tracks_page.city),
            dataIndex: 'competitionUnit.city',
            key: 'competitionUnit.city',
            sorter: true,
            ...getColumnSearchProps('competitionUnit.city', handleSearch, handleReset),
            render: (value, source) => source.competitionUnit?.city || '-'
        },
        {
            title: t(translations.my_tracks_page.country),
            dataIndex: 'competitionUnit.country',
            key: 'competitionUnit.country',
            sorter: true,
            ...getColumnSearchProps('competitionUnit.country', handleSearch, handleReset),
            render: (_value, source) => source.competitionUnit?.country || '-',
            width: '110px'
        },
        {
            title: t(translations.my_tracks_page.phone_model),
            dataIndex: 'phoneModel',
            sorter: true,
            key: 'phoneModel',
            ...getColumnSearchProps('phoneModel', handleSearch, handleReset),
            render: (value,) => renderEmptyValue(value),
        },
        {
            title: t(translations.my_tracks_page.phone_os),
            dataIndex: 'phoneOS',
            sorter: true,
            key: 'phoneOS',
            ...getColumnSearchProps('phoneOS', handleSearch, handleReset),
            render: (value,) => renderEmptyValue(value),
        },
        {
            title: t(translations.my_tracks_page.location_update_count),
            dataIndex: 'trackJson.locationUpdateCount',
            sorter: true,
            key: 'trackJson.locationUpdateCount',
            render: (_value, source) => {
                return renderEmptyValue(source.trackJson?.locationUpdateCount)
            }
        },
        {
            title: t(translations.my_tracks_page.traveled_overground_distance),
            dataIndex: 'trackJson.totalTraveledDistance',
            sorter: true,
            key: 'trackJson.totalTraveledDistance',
            render: (_value, source) => {
                const totalTraveledDistance = source.trackJson?.totalTraveledDistance;
                return totalTraveledDistance ? `${totalTraveledDistance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NMi` : '-';
            },
            width: '100px'
        },
        {
            title: t(translations.my_tracks_page.elapsed_time),
            dataIndex: 'competitionUnit',
            key: 'competitionUnit.elapsedTime',
            render: (_value, source) => {
                if (source.trackJson?.startTime && source.trackJson?.endTime) {
                    return moment(moment(source.trackJson.endTime).diff(moment(source.trackJson.startTime,))).utc().format(TIME_FORMAT.time)
                }

                if (!source.competitionUnit?.isCompleted) return 'in progress';

                const startTime = new Date(source.competitionUnit?.startTime).getTime();
                const endTime = new Date(source.competitionUnit?.endTime).getTime();

                return timeMillisToHours(endTime - startTime);
            }
        },
        {
            title: t(translations.my_tracks_page.source),
            dataIndex: 'source',
            key: 'source',
            render: (_value, record) => record.event?.source
        },
        {
            title: t(translations.general.action),
            key: 'action',
            fixed: !isMobile ? 'right' : false,
            render: (text, record) => {
                return <Space size="small">
                    <Tooltip title={t(translations.my_tracks_page.download_as_kml)}>
                        <DownloadButton onClick={(e) => performDownloadTrack(e, record, 'kml')} src={KMLIcon} />
                    </Tooltip>
                    <Tooltip title={t(translations.my_tracks_page.download_as_gpx)}>
                        <DownloadButton onClick={(e) => performDownloadTrack(e, record, 'gpx')} src={GPXIcon} />
                    </Tooltip>
                    {record?.event?.isPrivate && <Tooltip title={t(translations.tip.delete_this_track)}>
                        <BiTrash onClick={() => showTrackDeleteModal(record)} style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }} />
                    </Tooltip>}
                </Space>;
            }
        },
    ];

    const renderTrackParamIfExists = (record) => {
        let url = `/playback/?raceId=${record.competitionUnit?.id}`;

        if (record.trackJson?.id) {
            url += `&trackId=${record.trackJson.id}`;
        }
        if (record?.trackJson?.endTime && record?.trackJson?.startTime) {
            url += `&startTime=${record.trackJson.startTime}&endTime=${record.trackJson.endTime}`;
        }

        return url;
    }

    const showTrackDeleteModal = (track) => {
        setTrack(track);
        setShowDeleteModal(true);
    }

    const performDownloadTrack = (e, track, type) => {
        e.preventDefault();
        downloadTrack(track, type);
    }

    const previousValue = usePrevious<{ sorter: Partial<TableSorting>, filter: TableFiltering[] }>({ sorter, filter });

    React.useEffect(() => {
        if (checkIfLastFilterAndSortValueDifferentToCurrent(previousValue?.filter!, previousValue?.sorter!, filter, sorter)) {
            dispatch(actions.getTracks({ page: 1, size: pagination.size, filter, sorter }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, sorter]);

    React.useEffect(() => {
        dispatch(actions.getTracks({ page: pagination.page, size: pagination.size }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onTrackDeleted = () => {
        dispatch(actions.getTracks({ page: pagination.page, size: pagination.size, filter, sorter }));
    }

    const performDeleteTrack = async () => {
        setIsDeletingTrack(true);
        const response = await deleteEvent(track.event?.id!);
        setIsDeletingTrack(false);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_track_modal.successfully_deleted, { name: track?.event?.name }));
            onTrackDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <>
            <ConfirmModal
                loading={isDeletingTrack}
                title={t(translations.delete_track_modal.are_you_sure_you_want_to_delete)}
                content={t(translations.delete_track_modal.you_will_delete)}
                showModal={showDeleteModal}
                onOk={performDeleteTrack}
                onCancel={() => setShowDeleteModal(false)}
            />
            <Spin spinning={isLoading}>
                <TableWrapper>
                    <Table locale={{
                        emptyText: (<LottieWrapper>
                            <Lottie
                                options={defaultOptions}
                                height={400}
                                width={400} />
                            <LottieMessage>{t(translations.my_tracks_page.you_dont_have_any_tracks)}</LottieMessage>
                        </LottieWrapper>)
                    }} scroll={{ x: "max-content", y: isMobile ? undefined : 'calc(100vh - 390px)' }}
                        onChange={(antdPagination, antdFilters, antSorter) =>
                            handleOnTableStateChanged(antdPagination,
                                antdFilters,
                                antSorter,
                                (param) => dispatch(actions.setSorter(param))
                                , pagination.page, pagination.size,
                                () => dispatch(actions.getTracks({ page: antdPagination.current, size: antdPagination.pageSize, filter: filter, sorter: sorter })
                                )
                            )
                        }
                        columns={columns}
                        dataSource={pagination.rows} pagination={{
                            current: pagination.page,
                            total: pagination.total,
                            pageSize: pagination.size,
                        }} />
                </TableWrapper>
            </Spin>
        </>
    )
}

const FlexWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const OpenGraphImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background-color: #999999;
    margin-right: 8px;
`;

const NoImageContainer = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    background-color: #999999;
    margin-right: 8px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
`;

const DownloadButton = styled.img`
    width: 25px;
    height: 25px;
    cursor: pointer;
`;
