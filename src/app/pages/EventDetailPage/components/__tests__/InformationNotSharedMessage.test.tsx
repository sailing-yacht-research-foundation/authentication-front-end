import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import Provider from 'app/components/Provider/index';
import { InformationNotShared } from '../InformationNotSharedMessage';
import { fireEvent, render } from '@testing-library/react';
import { CalendarEvent } from 'types/CalendarEvent';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';
import { act } from 'react-test-renderer';

const shallowRenderer = createRenderer();

describe('InformationNotSharedMessage', () => {
    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <Provider>
                <InformationNotShared event={{}} reloadParent={jest.fn} />
            </Provider>);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('should render the message if the conditional state matches', async () => {
        const event: Partial<CalendarEvent> = {
            participantDetail: {
                allowShareInformation: false,
            },
            isParticipant: true,
            requireEmergencyContact: true,
            requireCovidCertificate: true,
            requireMedicalProblems: true,
            requireFoodAllergies: true,
            requireImmigrationInfo: true
        }
        const { getByText } = render(<Provider>
            <InformationNotShared event={event} reloadParent={jest.fn} />
        </Provider>);
        const t = await i18n;

        expect(getByText(String(t(translations.event_detail_page.this_event_requires_some_of_your_profile_information_click_share_now_if_you_want_to_share_them_with_the_organizer)))).toBeTruthy();
    });

    it('should render nothing if the user allowed to share information', async () => {
        const event: Partial<CalendarEvent> = {
            participantDetail: {
                allowShareInformation: true,
            },
            isParticipant: true,
            requireEmergencyContact: true,
            requireCovidCertificate: true,
            requireMedicalProblems: true,
            requireFoodAllergies: true,
            requireImmigrationInfo: true
        }
        const { container } = render(<Provider>
            <InformationNotShared event={event} reloadParent={jest.fn} />
        </Provider>);

        expect(container.firstChild).toBeNull();
    });

    it('should show ConfirmSharingInformationModal if the the user clicks share now', async () => {
        const event: Partial<CalendarEvent> = {
            participantDetail: {
                allowShareInformation: false,
            },
            isParticipant: true,
            requireEmergencyContact: true,
            requireCovidCertificate: true,
            requireMedicalProblems: true,
            requireFoodAllergies: true,
            requireImmigrationInfo: true
        }

        const { getByText } = render(<Provider>
            <InformationNotShared event={event} reloadParent={jest.fn} />
        </Provider>);
        const t = await i18n;

        act(() => {
            fireEvent.click(getByText(String(t(translations.event_detail_page.share_now))))
        });

        expect(getByText(String(t(translations.event_detail_page.share_information_to_the_organizers)))).toBeInTheDocument();
    });
});
