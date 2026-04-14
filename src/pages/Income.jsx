import Dashboard from "../components/Dashboard.jsx";
import {useUser} from "../hooks/useUser.jsx";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import axiosConfig from "../util/axiosConfig.jsx";
import {API_ENDPOINTS} from "../util/apiEndpoints.js";
import IncomeList from "../components/IncomeList.jsx";
import Modal from "../components/Modal.jsx";
import AddIncomeForm from "../components/AddIncomeForm.jsx";
import DeleteAlert from "../components/DeleteAlert.jsx";
import Overview from "../components/Overview.jsx";

const TRANSACTION_TYPE = "income";

const Income = () => {
    const incomeMessage = "Track your earnings over time and analyze your income trends.";
    useUser();
    const [incomeData, setIncomeData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openEditIncomeModal, setOpenEditIncomeModal] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState(null);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    })
    const handleEditIncome = async (income) => {
        setSelectedIncome(income);
        setOpenEditIncomeModal(true);
    }

    const fetchIncomeDetails = async () => {
        if (loading)
            return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_TRANSACTIONS(TRANSACTION_TYPE));
            if (response.status === 200)
                setIncomeData(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load income details");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE(TRANSACTION_TYPE));

            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch income categories");
        }
    }

    const handleUpdateIncome = async (income) => {
        setLoading(true);
        const {id, name, amount, date, icon, categoryId} = income;

        if (!name.trim()) {
            toast.error("Please enter a name");
            setLoading(false);
            return;
        }
        if (!amount || isNaN(amount) || Number(amount)<=0) {
            toast.error("Amount should be a valid number");
            setLoading(false);
            return;
        }
        if (!date) {
            toast.error("Date is required");
            setLoading(false);
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error("Date cannot be in the future");
            setLoading(false);
            return;
        }
        if (!categoryId) {
            toast.error("Category is required");
            setLoading(false);
            return;
        }
        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_TRANSACTION(id), {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId,
                type: TRANSACTION_TYPE
            });
            setOpenEditIncomeModal(false);
            setSelectedIncome(null);
            toast.success("Income updated successfully");
            await fetchIncomeDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update income");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleAddIncome = async (income) => {
        setLoading(true);
        const {name, amount, date, icon, categoryId} = income;

        if (!name.trim()) {
            toast.error("Please enter a name");
            setLoading(false);
            return;
        }
        if (!amount || isNaN(amount) || Number(amount)<=0) {
            toast.error("Amount should be a valid number");
            setLoading(false);
            return;
        }
        if (!date) {
            toast.error("Date is required");
            setLoading(false);
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            toast.error("Date cannot be in the future");
            setLoading(false);
            return;
        }
        if (!categoryId) {
            toast.error("Category is required");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_TRANSACTION, {
                type: TRANSACTION_TYPE,
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            });

            if (response.status === 201) {
                setOpenAddIncomeModal(false);
                toast.success("Income added successfully");
                fetchIncomeDetails();
                fetchIncomeCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add income");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const deleteIncome = async (id) => {
        try {
            await axiosConfig.delete(API_ENDPOINTS.DELETE_TRANSACTION(id));
            setOpenDeleteAlert({show: false, data: null});
            toast.success("Income deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete income");
        }
    }

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.TRANSACTION_EXCEL_DOWNLOAD(TRANSACTION_TYPE), {responseType: "blob"});
            let fileName = "income_details.xlsx";
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Income details downloaded successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to download income details");
        }
    }
    const handleEmailIncomeDetails = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_TRANSACTION(TRANSACTION_TYPE));
            if (response.status === 200)
                toast.success("Income details emailed successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to email the income details");
        }
    }

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, []);

    return (
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        {/* overview */}
                        <Overview
                            transactions={incomeData}
                            message={incomeMessage}
                            onAdd={() => setOpenAddIncomeModal(true)} />
                    </div>
                    <IncomeList transactions={incomeData}
                                onDownload={handleDownloadIncomeDetails}
                                onEmail={handleEmailIncomeDetails}
                                onEditIncome={handleEditIncome}
                                onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                    />

                    {/* Add Income Modal */}
                    <Modal
                        isOpen={openAddIncomeModal}
                        onClose={() => setOpenAddIncomeModal(false)}
                        title="Add Income"
                        >
                        <AddIncomeForm onAddIncome={(income) => handleAddIncome(income)} categories={categories} />
                    </Modal>

                    {/* edit income modal */}
                    <Modal
                        isOpen={openEditIncomeModal}
                        onClose={() => {setOpenEditIncomeModal(false)
                            setSelectedIncome(null)}}
                        title="Edit Income"
                    >
                        <AddIncomeForm
                            initialIncomeData={selectedIncome}
                            onAddIncome={handleUpdateIncome}
                            categories={categories}
                            isEditing={true}
                        />
                    </Modal>

                    {/* Delete income modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title="Delete Income"
                    >
                        <DeleteAlert
                            content="Are you sure you want to delete the income?"
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income;
