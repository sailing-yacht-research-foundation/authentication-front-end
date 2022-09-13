import * as React from 'react';
import { AnnouncementModal } from '../AnnouncementModal';
import * as AnnouncementModalModule from '../AnnouncementModal';
import { createRenderer } from 'react-test-renderer/shallow';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';
import { act, fireEvent, render, } from '@testing-library/react';

const shallowRenderer = createRenderer();

const modalShowComponent = (
    <AnnouncementModal event={{}} showModal={true} setShowModal={jest.fn} reloadParent={jest.fn} />
);

describe('AnnouncementModal', () => {
    it('should render and match snapshot', () => {
        shallowRenderer.render(modalShowComponent);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    // Use 'it' to test a single attribute of a target
    it('Hide if show modal flag is false', () => {

        shallowRenderer.render(<AnnouncementModal event={{}} showModal={false} setShowModal={jest.fn} reloadParent={jest.fn} />);

        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput.props.visible).not.toBeTruthy();
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

    it("It should have been rendered with correct received props", () => {
        const announcementModalSpy = jest.spyOn(AnnouncementModalModule, 'AnnouncementModal');

        render(<AnnouncementModal event={{}} showModal={true} setShowModal={jest.fn} reloadParent={jest.fn} />);

        expect(announcementModalSpy).toHaveBeenCalledWith({
            event: {},
            showModal: true,
            setShowModal: jest.fn,
            reloadParent: jest.fn,
        }, {});
    });

    it("It should call setShowModal when pressing cancel text", () => {
        const setShowModalMock = jest.fn();

        const { getByText } = render(<AnnouncementModal event={{}} showModal={true} setShowModal={setShowModalMock} reloadParent={jest.fn} />);

        act(() => {
            fireEvent.click(getByText('Cancel'));
        });

        expect(setShowModalMock).toHaveBeenCalledWith(false);
    });
});