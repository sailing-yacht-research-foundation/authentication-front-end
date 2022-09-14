import * as React from 'react';
import * as AnnouncementModalModule from '../AnnouncementModal';
import { createRenderer } from 'react-test-renderer/shallow';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';
import { act, fireEvent, render, } from '@testing-library/react';
import * as ParticipantServiceModule from 'services/live-data-server/participants';

const uuid = require('uuid');
const shallowRenderer = createRenderer();
const eventMock = { id: uuid.v4() }
const modalShowComponent = (
    <AnnouncementModalModule.AnnouncementModal event={eventMock} showModal={true} setShowModal={jest.fn} reloadParent={jest.fn} />
);

describe('AnnouncementModal', () => {
    it('should render and match snapshot', () => {
        // cannot use eventMock here because it will make the snap does not match.
        shallowRenderer.render(<AnnouncementModalModule.AnnouncementModal event={{}} showModal={true} setShowModal={jest.fn} reloadParent={jest.fn} />);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    it('Hide if show modal flag is false', () => {

        shallowRenderer.render(<AnnouncementModalModule.AnnouncementModal event={eventMock} showModal={false} setShowModal={jest.fn} reloadParent={jest.fn} />);

        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput.props.visible).toBeFalsy();
    });

    it('Show if show modal flag is true', async () => {
        shallowRenderer.render(modalShowComponent);

        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput.props.visible).toBeTruthy();
    });

    it('Modal title and content should match i18next translation language', async () => {
        const t = await i18n;

        shallowRenderer.render(modalShowComponent);

        expect(t(shallowRenderer.getRenderOutput().props.title)).toBe(t(translations.event_detail_page.send_announcement));
        expect(t(shallowRenderer.getRenderOutput().props.children.props.children)).toBe(t(translations.event_detail_page.please_invite_at_least_1_competitor_to_send_announcement));
    });

    it("It should call setShowModal when pressing cancel text", () => {
        const setShowModalMock = jest.fn();

        const { getByText } = render(<AnnouncementModalModule.AnnouncementModal event={eventMock} showModal={true} setShowModal={setShowModalMock} reloadParent={jest.fn} />);

        act(() => {
            fireEvent.click(getByText('Cancel'));
        });

        expect(setShowModalMock).toHaveBeenCalledWith(false);
    });

    it('should call getAcceptedAndSelfRegisteredParticipantByCalendarEventId when the componnent rendered', async () => {
        const serviceCallSpy = jest.spyOn(ParticipantServiceModule, 'getAcceptedAndSelfRegisteredParticipantByCalendarEventId');
        render(<AnnouncementModalModule.AnnouncementModal event={eventMock} showModal={true} setShowModal={jest.fn} reloadParent={jest.fn} />);
        expect(serviceCallSpy).toHaveBeenCalledWith(eventMock.id, 1, 1000);
    });
});
