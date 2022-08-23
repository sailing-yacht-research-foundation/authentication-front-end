import React from 'react';
import styled from 'styled-components';
import { Table, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter, selectIsChangingPage, selectPageSize, selectResults, selectSorter } from '../slice/selectors';
import { selectPage, selectTotal } from 'app/pages/MyEventPage/slice/selectors';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { BorderedButton, DownloadButton, LottieMessage, LottieWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import { useMyEventListSlice } from '../slice';
import moment from 'moment';
import { DeleteEventModal } from './DeleteEventModal';
import { Link } from 'react-router-dom';
import { checkIfLastFilterAndSortValueDifferentToCurrent, getFilterTypeBaseOnColumn, handleOnTableStateChanged, parseFilterParamBaseOnFilterType, renderEmptyValue, renderTimezoneInUTCOffset, showToastMessageOnRequestError, usePrevious } from 'utils/helpers';
import { EventState, TIME_FORMAT } from 'utils/constants';
import { downloadIcalendarFile } from 'services/live-data-server/event-calendars';
import { AiOutlineCalendar } from 'react-icons/ai';
import { RaceList } from './RaceList';
import { EventAdmins } from 'app/pages/EventDetailPage/components/EventAdmins';
import { CalendarEvent } from 'types/CalendarEvent';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { deleteParticipant } from 'services/live-data-server/participants';
import { toast } from 'react-toastify';
import { getColumnCheckboxProps, getColumnSearchProps, getColumnTimeProps } from 'app/components/TableFilter';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import { FaTrash } from 'react-icons/fa';
import { TableSorting } from 'types/TableSorting';
import { TableFiltering } from 'types/TableFiltering';
import { GiExitDoor } from 'react-icons/gi';
import { EditFilled } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: NoResult,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export const EventList = () => {

  const { t } = useTranslation();

  const [showLeaveEventConfirmModal, setShowLeaveEventConfirmModal] = React.useState<boolean>(false);

  const translate = {
    status_open_regis: t(translations.my_event_list_page.status_openregistration),
    status_public: t(translations.my_event_list_page.status_publicevent),
    status_private: t(translations.my_event_list_page.status_privateevent),
    anyone_canregist: t(translations.tip.anyone_can_register_event_and_tracking),
    anyone_canview: t(translations.tip.anyone_can_search_view_event),
    only_owner_canview: t(translations.tip.only_owner_cansearch_view_event)
  }

  const results = useSelector(selectResults);

  const page = useSelector(selectPage);

  const total = useSelector(selectTotal);

  const size = useSelector(selectPageSize);

  const history = useHistory();

  const dispatch = useDispatch();

  const { actions } = useMyEventListSlice();

  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const [event, setEvent] = React.useState<Partial<CalendarEvent>>({});

  const [mappedResults, setMappedResults] = React.useState<any[]>([]);

  const isChangingPage = useSelector(selectIsChangingPage);

  const [isLeavingEvent, setIsLeavingEvent] = React.useState<boolean>(false);

  const filter = useSelector(selectFilter);

  const sorter = useSelector(selectSorter);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: any,
  ) => {
    let param: any = selectedKeys[0];
    const filterType = getFilterTypeBaseOnColumn(dataIndex, ['approximateStartTime', 'createdAt'], ['status']);
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
      sorter: true,
      fixed: !isMobile ? 'left' : false,
      render: (text, record) => {
        return <>
        <Tooltip title={text}>
          <Typography.Text ellipsis={true} style={{ maxWidth: '30vw' }}>
            <Link to={`/events/${record.id}`}>{renderEmptyValue(text)}</Link>
          </Typography.Text>
        </Tooltip>
          { record.isSimulation && <><br/><span>{t(translations.general.simulation)}</span></> }
        </>;
      },
      ...getColumnSearchProps('name', handleSearch, handleReset)
    },
    {
      title: t(translations.my_event_list_page.type),
      dataIndex: 'isOpen',
      key: 'isOpen',
      sorter: true,
      render: (isOpen, record) => {
        return (
          <StatusContainer>
            {record?.isOpen ? (<Tooltip title={translate.anyone_canregist}>
              <StyledTag color="blue">{translate.status_open_regis}</StyledTag>
            </Tooltip>) : (<Tooltip title={translate.only_owner_canview}>
              <StyledTag >{translate.status_private}</StyledTag>
            </Tooltip>)}
          </StatusContainer>
        );
      }
    },
    {
      title: t(translations.my_event_list_page.city),
      dataIndex: 'city',
      key: 'city',
      render: (text) => renderEmptyValue(text),
      sorter: true,
      ...getColumnSearchProps('city', handleSearch, handleReset)
    },
    {
      title: t(translations.my_event_list_page.country),
      dataIndex: 'country',
      key: 'country',
      sorter: true,
      render: (text) => renderEmptyValue(text),
      ...getColumnSearchProps('country', handleSearch, handleReset),
      width: '110px'
    },
    {
      title: t(translations.my_event_list_page.start_date),
      dataIndex: 'approximateStartTime',
      key: 'start_date',
      sorter: true,
      ...getColumnTimeProps('approximateStartTime', handleSearch, handleReset),
      render: (value, record) => moment(value).format(TIME_FORMAT.date_text_with_time)
        + ' ' + record.approximateStartTime_zone + ' '
        + renderTimezoneInUTCOffset(record.approximateStartTime_zone),
    },
    {
      title: t(translations.my_event_list_page.admins),
      dataIndex: 'admin',
      key: 'admin',
      render: (_, record) => <EventAdmins headless editors={record.editors || []} groups={record.groupEditors || []} event={record} />
    },
    {
      title: t(translations.my_event_list_page.status),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      ...getColumnCheckboxProps('status', Object.values(EventState), handleSearch, handleReset),
      render: (value) => value,
    },
    {
      title: t(translations.my_event_list_page.created_date),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      ...getColumnTimeProps('createdAt', handleSearch, handleReset),
      render: (value) => moment(value).format(TIME_FORMAT.date_text),
      width: '110px'
    },
    {
      title: 'Action',
      key: 'action',
      fixed: !isMobile ? 'right' : false,
      render: (text, record) => {
        return (
          <Space size="small">
            <Tooltip title={t(translations.tip.download_icalendar_file)}>
              <DownloadButton icon={<AiOutlineCalendar />} onClick={() => {
                downloadIcalendarFile(record);
              }} type="primary" />
            </Tooltip>
            {canEditEvent(record) && <>
              <Tooltip title={t(translations.general.update)}>
                <BorderedButton icon={<EditFilled />} onClick={() => {
                  history.push(`/events/${record.id}/update`)
                }} type="primary"></BorderedButton>
              </Tooltip>
              {canDeleteEvent(record) && <Tooltip title={t(translations.general.delete)}>
                <BorderedButton
                  danger
                  icon={<FaTrash />}
                  onClick={() => showDeleteRaceModal(record)} />
              </Tooltip>}
            </>}
            {canLeaveEvent(record) && <Tooltip title={t(translations.my_event_list_page.leave_event_button)}>
              <BorderedButton icon={<GiExitDoor />} onClick={() => showLeaveEventModal(record)} danger />
            </Tooltip>}
          </Space >
        );
      },
      width: '2%'
    },
  ];

  const canEditEvent = (record) => {
    return record.isEditor && ![EventState.COMPLETED, EventState.CANCELED].includes(record.status);
  }

  const canDeleteEvent = (record) => {
    return record.status === EventState.DRAFT;
  }

  const canLeaveEvent = (record) => {
    return record.isParticipant && record.participantId && [EventState.ON_GOING, EventState.SCHEDULED].includes(record.status);
  }

  React.useEffect(() => {
    const resultsWithKey = results.map((result) => ({ ...result, key: result.id }))
    setMappedResults(resultsWithKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const previousValue = usePrevious<{ sorter: Partial<TableSorting>, filter: TableFiltering[] }>({ sorter, filter });

  React.useEffect(() => {
    if (checkIfLastFilterAndSortValueDifferentToCurrent(previousValue?.filter!, previousValue?.sorter!, filter, sorter)) {
      dispatch(actions.getEvents({ filter: filter, page: 1, size: size, sorter }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sorter]);

  React.useEffect(() => {
    dispatch(actions.getEvents({ page: page, size: size }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showDeleteRaceModal = (event) => {
    setShowDeleteModal(true);
    setEvent(event);
  }

  const onRaceDeleted = () => {
    dispatch(actions.getEvents({ page, size, filter, sorter }));
  }

  const renderExpandedRowRender = (record) => {
    return (
      <div>
        <RaceList event={record} />
      </div>
    );
  }

  const showLeaveEventModal = (event) => {
    setEvent(event);
    setShowLeaveEventConfirmModal(true);
  }

  const leaveEvent = async () => {
    setIsLeavingEvent(true);
    const response = await deleteParticipant(event.participantId!);
    setIsLeavingEvent(false);

    if (response.success) {
      toast.success(t(translations.my_event_list_page.successfully_left_the_event));
      setShowLeaveEventConfirmModal(false);
      dispatch(actions.getEvents({ filter, page, size, sorter }));
    } else {
      showToastMessageOnRequestError(response.success);
    }
  }

  return (
    <>
      <DeleteEventModal
        event={event}
        onRaceDeleted={onRaceDeleted}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
      <ConfirmModal
        loading={isLeavingEvent}
        title={t(translations.my_event_list_page.leave_event, { eventName: event.name })}
        content={t(translations.my_event_list_page.you_are_about_to_leave_this_event_are_you_sure_you_want_to_continue)}
        onOk={leaveEvent}
        showModal={showLeaveEventConfirmModal}
        onCancel={() => setShowLeaveEventConfirmModal(false)}
      />
      <Spin spinning={isChangingPage}>
        <TableWrapper>
          <Table
            scroll={{ x: "max-content", y: isMobile ? undefined : "calc(100vh - 360px)" }}
            columns={columns}
            dataSource={mappedResults}
            onChange={(antdPagination, antdFilters, antSorter) =>
              handleOnTableStateChanged(antdPagination,
                antdFilters,
                antSorter,
                (param) => dispatch(actions.setSorter(param))
                , page, size,
                () => dispatch(actions.getEvents({ page: antdPagination.current, size: antdPagination.pageSize, filter: filter, sorter: sorter })
                )
              )
            }
            locale={{
              emptyText: (<LottieWrapper>
                <Lottie options={defaultOptions} height={400} width={400} />
                <LottieMessage>{t(translations.my_event_list_page.you_dont_have_any_event)}</LottieMessage>
              </LottieWrapper>)
            }}
            pagination={{
              defaultPageSize: 10,
              pageSize: size,
              current: page,
              total: total,
            }}
            expandable={{
              expandedRowRender: record => renderExpandedRowRender(record)
            }}
          />
        </TableWrapper>
      </Spin>
    </>
  );
};

const StatusContainer = styled.div`
    max-width: 250px;
`;

const StyledTag = styled(Tag)`
    margin-top: 4px;
    margin-bottom: 4px;
`;
