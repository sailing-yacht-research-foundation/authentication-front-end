import React from 'react';
import styled from 'styled-components';
import { Table, Space, Spin, Tag, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsChangingPage, selectResults } from '../slice/selectors';
import { selectPage, selectTotal } from 'app/pages/MyEventPage/slice/selectors';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { BorderedButton, LottieMessage, LottieWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import { useMyEventListSlice } from '../slice';
import moment from 'moment';
import { DeleteEventModal } from './DeleteEventModal';
import { Link } from 'react-router-dom';
import { renderEmptyValue, renderTimezoneInUTCOffset } from 'utils/helpers';
import { TIME_FORMAT } from 'utils/constants';
import { downloadIcalendarFile } from 'services/live-data-server/event-calendars';
import ReactTooltip from 'react-tooltip';
import { AiOutlineCalendar } from 'react-icons/ai';
import { RaceList } from './RaceList';
import { GrGroup } from 'react-icons/gr';
import { AssignEventAsGroupAdminModal } from './AssignEventAsGroupAdminModal';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: NoResult,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const uuid = localStorage.getItem('uuid');

export const EventList = () => {

  const { t } = useTranslation();

  const translate = {
    status_open_regis: t(translations.my_event_list_page.status_openregistration),
    status_public: t(translations.my_event_list_page.status_publicevent),
    status_private: t(translations.my_event_list_page.status_privateevent),
    anyone_canregist: t(translations.tip.anyone_can_register_event_and_tracking),
    anyone_canview: t(translations.tip.anyone_can_search_view_event),
    only_owner_canview: t(translations.tip.only_owner_cansearch_view_event)
  }

  const columns = [
    {
      title: t(translations.my_event_list_page.name),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return <Link to={`/events/${record.id}`}>{text}</Link>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'isOpen',
      key: 'isOpen',
      render: (isOpen, record) => {
        return (
          <StatusContainer>
            {record?.isOpen && <StyledTag data-tip={translate.anyone_canregist} color="blue">{translate.status_open_regis}</StyledTag>}
            {record?.isOpen && <StyledTag data-tip={translate.anyone_canview} color="purple">{translate.status_public}</StyledTag>}
            {!record?.isOpen && <StyledTag data-tip={translate.only_owner_canview}>{translate.status_private}</StyledTag>}
          </StatusContainer>
        );
      }
    },
    {
      title: t(translations.my_event_list_page.city),
      dataIndex: 'city',
      key: 'city',
      render: (text) => renderEmptyValue(text),
    },
    {
      title: t(translations.my_event_list_page.country),
      dataIndex: 'country',
      key: 'country',
      render: (text) => renderEmptyValue(text),
    },
    {
      title: t(translations.my_event_list_page.start_date),
      dataIndex: 'approximateStartTime',
      key: 'start_date',
      render: (value, record) => moment(value).format(TIME_FORMAT.date_text_with_time)
        + ' ' + record.approximateStartTime_zone + ' '
        + renderTimezoneInUTCOffset(record.approximateStartTime_zone),
    },
    {
      title: t(translations.my_event_list_page.created_date),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => moment(value).format(TIME_FORMAT.date_text),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        const userId = localStorage.getItem('user_id');
        if ((userId && record.createdById === userId) || (uuid === record.createdById))
          return <Space size="middle">
            <Button onClick={() => showAssignEventAsGroupAdminModal(record)} data-tip="Set this event as a group admin" icon={<GrGroup style={{ marginRight: '5px' }} />}></Button>
            <DownloadButton data-tip={t(translations.tip.download_icalendar_file)} onClick={() => {
              downloadIcalendarFile(record);
            }} type="primary">
              <AiOutlineCalendar />
            </DownloadButton>
            <BorderedButton onClick={() => {
              history.push(`/events/${record.id}/update`)
            }} type="primary">{t(translations.my_event_list_page.update)}</BorderedButton>
            <BorderedButton danger onClick={() => showDeleteRaceModal(record)}>{t(translations.my_event_list_page.delete)}</BorderedButton>
            <ReactTooltip />
          </Space>;

        return <></>;
      }
    },
  ];

  const results = useSelector(selectResults);

  const page = useSelector(selectPage);

  const total = useSelector(selectTotal);

  const history = useHistory();

  const dispatch = useDispatch();

  const { actions } = useMyEventListSlice();

  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const [event, setEvent] = React.useState<any>({});

  const [mappedResults, setMappedResults] = React.useState<any[]>([]);

  const isChangingPage = useSelector(selectIsChangingPage);

  const [showAssignModal, setShowAssignModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(actions.getEvents(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const resultsWithKey = results.map((result) => ({ ...result, key: result.id }))
    setMappedResults(resultsWithKey);
  }, [results]);

  const onPaginationChanged = (page) => {
    dispatch(actions.getEvents(page));
  }

  const showDeleteRaceModal = (event) => {
    setShowDeleteModal(true);
    setEvent(event);
  }

  const onRaceDeleted = () => {
    dispatch(actions.getEvents(page));
  }

  const showAssignEventAsGroupAdminModal = (event) => {
    setShowAssignModal(true);
    setEvent(event);
  } 

  const renderExpandedRowRender = (record) => {
    return (
      <div>
        <RaceList event={record} />
      </div>
    );
  }

  return (
    <>
      <DeleteEventModal
        event={event}
        onRaceDeleted={onRaceDeleted}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
      <AssignEventAsGroupAdminModal showModal={showAssignModal} event={event} setShowModal={setShowAssignModal}/>
      {mappedResults.length > 0 ? (
        <Spin spinning={isChangingPage}>
          <TableWrapper>
            <Table
              scroll={{ x: "max-content" }}
              columns={columns}
              dataSource={mappedResults}
              pagination={{
                defaultPageSize: 10,
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
      ) : (
        <LottieWrapper>
          <Lottie options={defaultOptions} height={400} width={400} />
          <LottieMessage>{t(translations.my_event_list_page.you_dont_have_any_event)}</LottieMessage>
        </LottieWrapper>
      )}
    </>
  );
};

const DownloadButton = styled(BorderedButton)`
    background: #DC6E1E;
    border: 1px solid #fff;
    font-size: 20px;
    
    display: flex;
    align-items: center;
    justify-content: center;

    :hover, :focus {
        background: #DC6E1E;
        border: 1px solid #fff;
    }
`;

const StatusContainer = styled.div`
    max-width: 250px;
`;

const StyledTag = styled(Tag)`
    margin-top: 4px;
    margin-bottom: 4px;
`;