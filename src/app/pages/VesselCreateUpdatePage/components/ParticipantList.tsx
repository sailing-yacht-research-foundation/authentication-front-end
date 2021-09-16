import React from 'react';
import { useHistory } from 'react-router';
import { Space, Spin, Table } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getByCompetitionUnit } from 'services/live-data-server/courses';
import { CourseDeleteModal } from 'app/pages/CourseCreateUpdatePage/components/CourseDeleteModal';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const ParticipantList = (props) => {

    const { t } = useTranslation();

    const { competitionUnitId } = props;

    const [showCourseDeleteModal, setShowCourseDeleteModal] = React.useState<boolean>(false);

    const columns = [
        {
            title: t(translations.course_list.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format('MMM. D, YYYY'),
        },
        {
            title: t(translations.course_list.has_geometry),
            render: (value, record) => record.courseSequencedGeometries && record.courseSequencedGeometries.length > 0 ? 'Yes' : 'No',
        },
        {
            title: t(translations.course_list.action),
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/my-races/${record.competitionUnitId}/courses/${record.id}/update`)
                    }} type="primary">{t(translations.course_list.update)}</BorderedButton>
                    <BorderedButton danger onClick={() => setShowCourseDeleteModal(true)}>{t(translations.course_list.delete)}</BorderedButton>
                </Space>
            ),
            width: '20%',
        },
    ];

    const [course, setCourse] = React.useState<any>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const onCourseDeleted = () => {
        getCourseUsingCompetitionUnitId();
    }

    const getCourseUsingCompetitionUnitId = async () => {
        setIsLoading(true);
        const response = await getByCompetitionUnit(competitionUnitId);
        setIsLoading(false);

        if (response.success) {
            setCourse(response.data);
        } else {
            setCourse({});
        }
    }

    React.useEffect(() => {
        getCourseUsingCompetitionUnitId();
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
                    {
                        !course.id && <CreateButton onClick={() => history.push(`/my-races/${competitionUnitId}/courses/create`)} icon={<AiFillPlusCircle
                            style={{ marginRight: '5px' }}
                            size={18} />}>{t(translations.course_list.create)}</CreateButton>
                    }
                </PageHeaderContainer>
                <TableWrapper>
                    <Table columns={columns}
                        scroll={{ x: "max-content" }}
                        dataSource={course.id ? [course] : []} pagination={false} />
                </TableWrapper>
            </Spin>
        </>
    );
}