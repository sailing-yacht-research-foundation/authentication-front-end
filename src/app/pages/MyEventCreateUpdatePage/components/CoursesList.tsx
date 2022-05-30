import React from 'react';
import { useHistory } from 'react-router';
import { Space, Spin, Table, Tooltip } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getByEventId } from 'services/live-data-server/courses';
import { CourseDeleteModal } from 'app/pages/CourseCreateUpdatePage/components/CourseDeleteModal';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { Course } from 'types/Course';
import { truncateName } from 'utils/helpers';

export const CoursesList = (props) => {

    const { t } = useTranslation();

    const { eventId } = props;

    const [showCourseDeleteModal, setShowCourseDeleteModal] = React.useState<boolean>(false);

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        pageSize: 10
    });

    const columns = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (value) => <Tooltip title={value}>
                {truncateName(value, 50)}
            </Tooltip>,
        },
        {
            title: t(translations.general.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.general.action),
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/events/${eventId}/courses/${record.id}/update`)
                    }} type="primary">{t(translations.general.update)}</BorderedButton>
                    <BorderedButton danger onClick={() => showDeleteModal(record)}>{t(translations.general.delete)}</BorderedButton>
                </Space>
            ),
            width: '20%',
        },
    ];

    const [course, setCourse] = React.useState<Partial<Course>>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const onPaginationChanged = (page, size): void => {
        getCourseUsingCalendarEventId(page, size);
    }

    const showDeleteModal = (course: Course) => {
        setShowCourseDeleteModal(true);
        setCourse(course);
    }

    const onCourseDeleted = () => {
        getCourseUsingCalendarEventId(pagination.page, pagination.pageSize);
    }

    const getCourseUsingCalendarEventId = async (page, size) => {
        setIsLoading(true);
        const response = await getByEventId(eventId, {
            page,
            size
        });
        setIsLoading(false);

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

    React.useEffect(() => {
        getCourseUsingCalendarEventId(pagination.page, pagination.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <CourseDeleteModal
                showDeleteModal={showCourseDeleteModal}
                setShowDeleteModal={setShowCourseDeleteModal}
                onCourseDeleted={onCourseDeleted}
                course={course}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.course_list.course)}</PageHeaderTextSmall>
                    <CreateButton onClick={() => history.push(`/events/${eventId}/courses/create`)} icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.general.create)}</CreateButton>
                </PageHeaderContainer>
                <TableWrapper>
                    <Table columns={columns}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            defaultPageSize: 10,
                            current: pagination.page,
                            total: pagination.total,
                            onChange: onPaginationChanged
                        }}
                        dataSource={pagination.rows} />
                </TableWrapper>
            </Spin>
        </>
    );
}