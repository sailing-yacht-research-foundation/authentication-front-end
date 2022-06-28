import React from 'react';
import { Table, Spin, Space, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import styled from 'styled-components';
import { translations } from 'locales/translations';
import moment from 'moment';
import { AiOutlineMinus } from 'react-icons/all'

import { downloadTrack, getAllTracks } from 'services/live-data-server/my-tracks';
import NoResult from '../assets/no-results.json';
import { LottieMessage, LottieWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import { Link } from 'react-router-dom';
import { TableFilteringType, TIME_FORMAT } from 'utils/constants';
import { timeMillisToHours } from 'utils/time';
import KMLIcon from '../assets/kml.png';
import GPXIcon from '../assets/gpx.png';
import { BiTrash } from 'react-icons/bi';
import { Track } from 'types/Track';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { toast } from 'react-toastify';
import { handleOnTableStateChanged, renderEmptyValue, showToastMessageOnRequestError, truncateName } from 'utils/helpers';
import { deleteEvent } from 'services/live-data-server/event-calendars';
import { TableSorting } from 'types/TableSorting';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const MyTrackList = React.forwardRef<any, any>((props, ref) => {

    const { t } = useTranslation();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [track, setTrack] = React.useState<Partial<Track>>({});

    const [isDeletingTrack, setIsDeletingTrack] = React.useState<boolean>(false);

    const [sorter, setSorter] = React.useState<Partial<TableSorting>>({});

    const columns: any = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
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
            dataIndex: 'type',
            key: 'type',
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
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.my_tracks_page.city),
            dataIndex: 'competitionUnit',
            key: 'competitionUnit.City',
            render: (value, source) => source.competitionUnit?.city || '-'
        },
        {
            title: t(translations.my_tracks_page.country),
            dataIndex: 'competitionUnit',
            key: 'competitionUnit.Country',
            render: (_value, source) => source.competitionUnit?.country || '-'
        },
        {
            title: t(translations.my_tracks_page.phone_model),
            dataIndex: 'phoneModel',
            sorter: true,
            key: 'phoneModel',
            render: (value,) => renderEmptyValue(value),
        },
        {
            title: t(translations.my_tracks_page.phone_os),
            dataIndex: 'phoneOS',
            sorter: true,
            key: 'phoneOS',
            render: (value,) => renderEmptyValue(value),
        },
        {
            title: t(translations.my_tracks_page.location_update_count),
            dataIndex: 'trackJson',
            key: 'trackJson.locationUpdateCount',
            render: (_value, source) => {
                return renderEmptyValue(source.trackJson?.locationUpdateCount)
            }
        },
        {
            title: t(translations.my_tracks_page.traveled_overground_distance),
            dataIndex: 'trackJson',
            key: 'trackJson.totalTraveledDistance',
            render: (_value, source) => {
                const totalTraveledDistance = source.trackJson?.totalTraveledDistance;
                return totalTraveledDistance ? `${totalTraveledDistance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NMi` : '-';
            }
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
            title: t(translations.general.action),
            key: 'action',
            fixed: 'right',
            render: (text, record) => {
                return <Space size={10}>
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

    React.useImperativeHandle(ref, () => ({
        reload() {
            getAll(pagination.page, pagination.size);
        }
    }));

    const showTrackDeleteModal = (track) => {
        setTrack(track);
        setShowDeleteModal(true);
    }

    const performDownloadTrack = (e, track, type) => {
        e.preventDefault();
        downloadTrack(track, type);
    }
    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        size: 10
    });

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        getAll(pagination.page, pagination.size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorter]);

    const getAll = async (page, size) => {
        setIsChangingPage(true);
        const response = await getAllTracks(page, size, [], sorter);
        setIsChangingPage(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page,
                total: response.data?.count,
                size: response.data?.size
            });
        }
    }

    const onPaginationChanged = (page, size) => {
        getAll(page, size);
    }

    const onTrackDeleted = () => {
        getAll(pagination.page, pagination.size);
    }

    const performDeleteTrack = async () => {
        setIsDeletingTrack(true);
        const response = await deleteEvent(track?.event?.id!);
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
            <Spin spinning={isChangingPage}>
                <TableWrapper>
                    <Table locale={{
                        emptyText: (<LottieWrapper>
                            <Lottie
                                options={defaultOptions}
                                height={400}
                                width={400} />
                            <LottieMessage>{t(translations.my_tracks_page.you_dont_have_any_tracks)}</LottieMessage>
                        </LottieWrapper>)
                    }} scroll={{ x: "max-content" }}
                        onChange={(_1, _2, sorter)=> handleOnTableStateChanged(sorter, setSorter)}
                        columns={columns}
                        dataSource={pagination.rows} pagination={{
                            defaultPageSize: 10,
                            current: pagination.page,
                            total: pagination.total,
                            onChange: onPaginationChanged
                        }} />
                </TableWrapper>
            </Spin>
        </>
    )
});

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