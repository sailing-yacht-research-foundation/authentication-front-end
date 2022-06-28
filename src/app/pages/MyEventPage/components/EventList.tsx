import React from 'react';
import styled from 'styled-components';
import { Table, Space, Spin, Tag, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter, selectIsChangingPage, selectPageSize, selectResults, selectSorter } from '../slice/selectors';
import { selectPage, selectTotal } from 'app/pages/MyEventPage/slice/selectors';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { BorderedButton, DownloadButton, IconWrapper, LottieMessage, LottieWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import { useMyEventListSlice } from '../slice';
import moment from 'moment';
import { DeleteEventModal } from './DeleteEventModal';
import { Link } from 'react-router-dom';
import { getFilterTypeBaseOnColumn, parseFilterParamBaseOnFilterType, renderEmptyValue, renderTimezoneInUTCOffset, showToastMessageOnRequestError, truncateName } from 'utils/helpers';
import { EventState, TableFilteringType, TIME_FORMAT } from 'utils/constants';
import { downloadIcalendarFile } from 'services/live-data-server/event-calendars';
import { AiOutlineCalendar } from 'react-icons/ai';
import { RaceList } from './RaceList';
import { EventAdmins } from 'app/pages/EventDetailPage/components/EventAdmins';
import { CalendarEvent } from 'types/CalendarEvent';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { deleteParticipant } from 'services/live-data-server/participants';
import { toast } from 'react-toastify';
import { getColumnSearchProps, getColumnTimeProps } from 'app/components/TableFilter';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
    const filterType = getFilterTypeBaseOnColumn(dataIndex, ['approximateStartTime', 'createdAt']);
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
      fixed: 'left',
      render: (text, record) => {
        return <Tooltip title={text}>
          <Link to={`/events/${record.id}`}>{truncateName(text)}</Link>
        </Tooltip>;
      },
      ...getColumnSearchProps('name', handleSearch, handleReset, 'name')
    },
    {
      title: 'Status',
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
      ...getColumnSearchProps('city', handleSearch, handleReset, 'city')
    },
    {
      title: t(translations.my_event_list_page.country),
      dataIndex: 'country',
      key: 'country',
      sorter: true,
      render: (text) => renderEmptyValue(text),
      ...getColumnSearchProps('country', handleSearch, handleReset, 'country')
    },
    {
      title: t(translations.my_event_list_page.start_date),
      dataIndex: 'approximateStartTime',
      key: 'start_date',
      sorter: true,
      ...getColumnTimeProps('approximateStartTime', handleSearch, handleReset, 'approximateStartTime'),
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
      title: t(translations.my_event_list_page.state),
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (value) => value,
    },
    {
      title: t(translations.my_event_list_page.created_date),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      ...getColumnTimeProps('createdAt', handleSearch, handleReset, 'createdAt'),
      render: (value) => moment(value).format(TIME_FORMAT.date_text),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (text, record) => {
        return (
          <Space size="middle">
            <Tooltip title={t(translations.tip.download_icalendar_file)}>
              <DownloadButton icon={<AiOutlineCalendar />} onClick={() => {
                downloadIcalendarFile(record);
              }} type="primary" />
            </Tooltip>
            {canEditEvent(record) && <>
              <Tooltip title={t(translations.general.update)}>
                <BorderedButton icon={<FaEdit />} onClick={() => {
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
            {canLeaveEvent(record) && <BorderedButton onClick={() => showLeaveEventModal(record)} danger>{t(translations.my_event_list_page.leave_event_button)}</BorderedButton>}
          </Space >
        );
      }
    },
  ];

  const canEditEvent = (record) => {
    return record.isEditor && ![EventState.COMPLETED, EventState.CANCELED].includes(record.status);
  }

  const canDeleteEvent = (record) => {
    return record.status === EventState.DRAFT
      && record.ownerId === localStorage.getItem('user_id');
  }

  const canLeaveEvent = (record) => {
    return record.isParticipant && record.participantId && [EventState.ON_GOING, EventState.SCHEDULED].includes(record.status);
  }

  React.useEffect(() => {
    const resultsWithKey = results.map((result) => ({ ...result, key: result.id }))
    setMappedResults(resultsWithKey);
  }, [results]);

  React.useEffect(() => {
    dispatch(actions.getEvents({ filter: filter, page: page, size: size, sorter }));
  }, [filter, sorter]);

  const onPaginationChanged = (page, size) => {
    dispatch(actions.getEvents({ page, size, filter, sorter }));
  }

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

  const onTableStateChanged = (_1, _2, sorter) => {
    if (sorter.column) {
      dispatch(actions.setSorter({ key: sorter.column?.dataIndex, order: sorter.order === 'ascend' ? 'asc' : 'desc' }));
    } else {
      dispatch(actions.setSorter({}));
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
            scroll={{ x: "max-content" }}
            columns={columns}
            dataSource={mappedResults}
            onChange={onTableStateChanged}
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
              onChange: onPaginationChanged,
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