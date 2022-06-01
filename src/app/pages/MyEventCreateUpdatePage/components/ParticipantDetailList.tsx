import React from 'react';
import { Image, Spin, Table } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { renderEmptyValue } from 'utils/helpers';
import { getDetailedEventParticipantInfoById, getPrivateImages } from 'services/live-data-server/event-calendars';

export const ParticipantDetailList = (props) => {

    const { t } = useTranslation();

    const waiverKey = {
        noticeOfRacePDF: t(translations.my_event_create_update_page.notice_of_race),
        mediaWaiverPDF: t(translations.my_event_create_update_page.media_waiver),
        disclaimerPDF: t(translations.my_event_create_update_page.disclaimer)
    }

    const { eventId, participant } = props;

    const [participantData, setParticipantData] = React.useState({});

    const [privateImage, setPrivateImage] = React.useState({
        covidVaccinationCard: '',
        passportPhoto: ''
    })

    const waiverKeyToText = (key) => {
        return waiverKey[key] || key;
    }

    const renderAgreedWaivers = (value) => {
        return Array.isArray(value) ? value.map(waiver => waiverKeyToText(waiver.waiverType)).join(', ') : ''
    }

    const columns = [
        {
            title: t(translations.participant_list.agreed_to_waivers),
            dataIndex: 'waiverAgreements',
            key: 'waiverAgreements',
            render: (value, record) => renderEmptyValue(renderAgreedWaivers(value)),
        },
        {
            title: t(translations.participant_list.agreed_to_documents),
            dataIndex: 'documentAgreements',
            key: 'documentAgreements',
            render: (value, record) => renderEmptyValue(record.documentAgreements?.map(doc => doc.documentName)?.join(', ')),
        },
        {
            title: t(translations.participant_list.email),
            dataIndex: 'email',
            key: 'email',
            render: (value, record) => renderEmptyValue(value),
        },
        {
            title: t(translations.participant_list.birth_date),
            dataIndex: 'birthdate',
            key: 'birthdate',
            render: (value, record) => {
                if (value && moment(value).isValid())
                    return moment(value).format(TIME_FORMAT.date_text);
                return renderEmptyValue(null);
            },
        },
        {
            title: t(translations.participant_list.address),
            dataIndex: 'address',
            key: 'address',
            render: (value, record) => renderEmptyValue(value),
        },
        {
            title: t(translations.participant_list.allow_to_share_information),
            dataIndex: 'allowShareInformation',
            key: 'allowShareInformation',
            render: (value) => {
                if (typeof value === 'boolean') {
                    return String(value);
                }
                return renderEmptyValue(value);
            },
        },
        {
            title: t(translations.participant_list.has_covid_vaccination_card),
            dataIndex: 'hasCovidVaccinationCard',
            key: 'hasCovidVaccinationCard',
            render: (value, record) => {
                if (!record.allowShareInformation) {
                    return t(translations.participant_list.not_shared);
                } else if (typeof value === 'boolean') {
                    return String(value);
                }
                return renderEmptyValue(null);
            },
        },
        {
            title: t(translations.participant_list.passportNumber),
            dataIndex: 'immigrationInformation.passportNumber',
            key: 'immigrationInformation.passportNumber',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.immigrationInformation?.passportNumber)),
        },
        {
            title: t(translations.participant_list.passport_issued_date),
            dataIndex: 'immigrationInformation.issueDate',
            key: 'immigrationInformation.issueDate',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.immigrationInformation?.issueDate)),
        },
        {
            title: t(translations.participant_list.passport_expiration_date),
            dataIndex: 'immigrationInformation.expirationDate',
            key: 'immigrationInformation.expirationDate',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.immigrationInformation?.expirationDate)),
        },
        {
            title: t(translations.participant_list.passport_issued_country),
            dataIndex: 'immigrationInformation.issueCountry',
            key: 'immigrationInformation.issueCountry',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.immigrationInformation?.issueCountry)),
        },

        {
            title: t(translations.participant_list.covid_card),
            dataIndex: 'covidCard',
            key: 'covidCard',
            render: (value, record) => renderPrivateImageIfExists(record, privateImage.covidVaccinationCard),
        },
        {
            title: t(translations.participant_list.passport_photo),
            dataIndex: 'passportImage',
            key: 'passportImage',
            render: (value, record) => renderPrivateImageIfExists(record, privateImage.passportPhoto),
        },
        {
            title: t(translations.participant_list.emergency_contact_name),
            dataIndex: 'emergencyContact.name',
            key: 'emergencyContact.name',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.emergencyContact?.name)),
        },
        {
            title: t(translations.participant_list.emergency_contact_relationship),
            dataIndex: 'emergencyContact.relationship',
            key: 'emergencyContact.relationship',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.emergencyContact?.relationship)),
        },
        {
            title: t(translations.participant_list.emergency_contact_phone),
            dataIndex: 'emergencyContact.phone',
            key: 'emergencyContact.phone',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.emergencyContact?.phone)),
        },
        {
            title: t(translations.participant_list.emergency_contact_email),
            dataIndex: 'emergencyContact.email',
            key: 'emergencyContact.email',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.emergencyContact?.email)),
        },
        {
            title: t(translations.participant_list.food_allergies),
            dataIndex: 'foodAllergies',
            key: 'foodAllergies',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(record.foodAllergies?.join(', '))),
        },
        {
            title: t(translations.participant_list.medical_problems),
            dataIndex: 'medicalProblems',
            key: 'medicalProblems',
            render: (value, record) => renderParticipantPropertyValue(record, renderEmptyValue(value)),
        },
    ];

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const getDetailedParticipantInfoById = async () => {
        setIsLoading(true);
        const response = await getDetailedEventParticipantInfoById(eventId, participant.id);
        setIsLoading(false);

        console.log(response.data?.data);

        if (response.success) {
            setParticipantData(response.data?.data || {});
            getParticipantPrivateImages();
        }
    }

    const renderParticipantPropertyValue = (record, finalValue) => {
        if (!record.allowShareInformation) {
            return t(translations.participant_list.not_shared);
        }

        return finalValue;
    }

    const getParticipantPrivateImages = async () => {
        const response = await getPrivateImages(eventId, participant.id);

        if (response.success) {
            setPrivateImage({
                covidVaccinationCard: response.data?.covidVaccinationCard || '',
                passportPhoto: response.data?.passportPhoto || ''
            })
        }
    }

    const renderPrivateImageIfExists = (record, imageSource) => {
        return imageSource
            ? <Image width={100} height={100} src={`data:image/jpeg;base64,${imageSource}`} />
            : !record.allowShareInformation ? t(translations.participant_list.not_shared) : t(translations.misc.not_available)
    }

    React.useEffect(() => {
        getDetailedParticipantInfoById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Spin spinning={isLoading}>
                <Table columns={columns}
                    size="small"
                    scroll={{ x: "max-content" }}
                    dataSource={[participantData]} pagination={false} />
            </Spin>
        </>
    )
}