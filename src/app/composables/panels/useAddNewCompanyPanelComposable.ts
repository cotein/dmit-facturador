import { useAddNewCompanyPanelStore } from '@/app/store/panels/useAddNewCompanyPanelStore';
import { storeToRefs } from 'pinia';

const store = useAddNewCompanyPanelStore();

const { AddNewCompany, addNewCompany, EditCompanyPanel } = storeToRefs(store);

const { openAddNewCompanyPanel, closeAddNewCompanyPanel, openEditCompanyPanel, closeEditCompanyPanel } = store;

export const useAddNewCompanyPanelComposable = () => {
	return {
		addNewCompany,
		openAddNewCompanyPanel,
		closeAddNewCompanyPanel,
		openEditCompanyPanel,
		closeEditCompanyPanel,
		EditCompanyPanel,
		AddNewCompany,
	};
};
