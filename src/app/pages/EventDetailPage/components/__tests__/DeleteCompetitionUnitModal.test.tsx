import * as React from 'react';
import { DeleteCompetitionUnitModal } from '../DeleteCompetitionUnitModal';
import * as DeleteCompetitionUnitModalModule from '../DeleteCompetitionUnitModal';
import { createRenderer } from 'react-test-renderer/shallow';
import { i18n } from 'locales/i18n';
import { translations } from 'locales/translations';
import { act, fireEvent, render, } from '@testing-library/react';
import * as CompetitionUnitModule from 'services/live-data-server/competition-units';
import * as Helpers from 'utils/helpers';

const shallowRenderer = createRenderer();

const modalShowComponent = (
    <DeleteCompetitionUnitModal competitionUnit={{}}
        showDeleteModal={true}
        setShowDeleteModal={jest.fn}
        onCompetitionUnitDeleted={jest.fn} />
);

describe('DeleteCompetitionUnitModal', () => {
    it('should render and match snapshot', () => {
        shallowRenderer.render(modalShowComponent);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });

    // Use 'it' to test a single attribute of a target
    it('Hide if show modal flag is false', () => {

        shallowRenderer.render(<DeleteCompetitionUnitModal competitionUnit={{}}
            showDeleteModal={false}
            setShowDeleteModal={jest.fn}
            onCompetitionUnitDeleted={jest.fn} />);

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

        expect(t(shallowRenderer.getRenderOutput().props.title)).toBe(t(translations.delete_competition_unit_modal.are_you_sure_you_want_to_delete));
        expect(t(shallowRenderer.getRenderOutput().props.children.props.children)).toBe(t(translations.delete_competition_unit_modal.you_will_delete));
    });

    it("It should have been rendered with correct received props", () => {
        const deleteCompetitionUnitSpy = jest.spyOn(DeleteCompetitionUnitModalModule, 'DeleteCompetitionUnitModal');

        render(<DeleteCompetitionUnitModal event={{}} showModal={true} setShowModal={jest.fn} reloadParent={jest.fn} />);

        expect(deleteCompetitionUnitSpy).toHaveBeenCalledWith({
            event: {},
            showModal: true,
            setShowModal: jest.fn,
            reloadParent: jest.fn,
        }, {});
    });

    it("It should call setShowModal when pressing cancel text", async () => {
        const setShowModalMock = jest.fn();

        const { getByText } = render(<DeleteCompetitionUnitModal competitionUnit={{}}
            showDeleteModal={true}
            setShowDeleteModal={setShowModalMock}
            onCompetitionUnitDeleted={jest.fn} />);

        act(() => {
            fireEvent.click(getByText('Cancel'));
        });

        expect(setShowModalMock).toHaveBeenCalledWith(false);
    });

    it("It should call deleteCompetitionUnit when pressing ok text", async () => {
        let competitionUnitModuleMock;
        const onCompetitionUnitDeletedMock = jest.fn();
        competitionUnitModuleMock =  jest.spyOn(CompetitionUnitModule, 'deleteCompetitionUnit').mockImplementation(() => {
            return Promise.resolve({
                success: true
            })
        }); 
        
        const { getByText } = render(<DeleteCompetitionUnitModal competitionUnit={{}}
            showDeleteModal={true}
            setShowDeleteModal={jest.fn}
            onCompetitionUnitDeleted={onCompetitionUnitDeletedMock} />);

        act(() => {
            fireEvent.click(getByText('OK'));
        });

        expect(competitionUnitModuleMock).toHaveBeenCalled();
        await act(() => Promise.resolve()); // wait for deleteCompetitionUnit call.
        expect(onCompetitionUnitDeletedMock).toHaveBeenCalled();
    });

    it("It should call showToastOnServerResponseError when pressing ok text with failed request", async () => {
        const competitionUnitModuleMock =  jest.spyOn(CompetitionUnitModule, 'deleteCompetitionUnit').mockImplementation(() => {
            return Promise.resolve({
                success: false
            })
        });
        const showToastMessageOnRequestErrorSpy = jest.spyOn(Helpers, 'showToastMessageOnRequestError'); 
        
        const { getByText } = render(<DeleteCompetitionUnitModal competitionUnit={{}}
            showDeleteModal={true}
            setShowDeleteModal={jest.fn}
            onCompetitionUnitDeleted={jest.fn} />);

        act(() => {
            fireEvent.click(getByText('OK'));
        });

        expect(competitionUnitModuleMock).toHaveBeenCalled();
        await act(() => Promise.resolve()); // wait for deleteCompetitionUnit call.
        expect(showToastMessageOnRequestErrorSpy).toHaveBeenCalled();
    });
});