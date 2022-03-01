import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { deleteCourse } from 'services/live-data-server/courses';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { Course } from 'types/Course';

interface CourseDeleteModal {
    course: Partial<Course>,
    showDeleteModal: boolean,
    setShowDeleteModal: Function,
    onCourseDeleted: Function
}

export const CourseDeleteModal = (props: CourseDeleteModal) => {

    const { t } = useTranslation();

    const {
        course,
        showDeleteModal,
        setShowDeleteModal,
        onCourseDeleted
    } = props;

    const performDeleteCourse = async () => {
        const response = await deleteCourse(course.id!);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_course_modal.successfully_deleted));
            onCourseDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            title={t(translations.delete_course_modal.are_you_sure_you_want_to_delete)}
            visible={showDeleteModal}
            onOk={() => {
                performDeleteCourse();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>{t(translations.delete_course_modal.you_will_delete)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;