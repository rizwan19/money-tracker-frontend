export const BASE_URL = "https://money-tracker-3nbw.onrender.com/api/v1";
const CLOUDINARY_CLOUD_NAME = "dj1tayyvn";

export const API_ENDPOINTS = {
    ACTIVATE: "/activate",
    LOGIN: "/login",
    REGISTER: "/register",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    GET_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_TRANSACTION: "/transactions",
    UPDATE_TRANSACTION: (transactionId) => `/transactions/${transactionId}`,
    DELETE_TRANSACTION: (transactionId) => `/transactions/${transactionId}`,
    GET_TRANSACTIONS: (type) => `/transactions?type=${type}`,
    TRANSACTION_EXCEL_DOWNLOAD: (type) => `/transactions/download/excel?type=${type}`,
    EMAIL_TRANSACTION: (type) => `/transactions/email?type=${type}`,
    APPLY_FILTERS: "/filter",
    DASHBOARD_DATA: "/dashboard"
}
