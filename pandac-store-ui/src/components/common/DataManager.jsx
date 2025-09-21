import React, { useState } from 'react';
import { useLoaderData } from "react-router-dom";
import { toast } from 'react-toastify';
import DataModal from './DataModal';

const DataManager = ({ config }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(config.pagination?.itemsPerPage || 10);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const loadedData = useLoaderData();
    const [data, setData] = useState(loadedData || []);

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = data.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Generate page numbers array
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) pageNumbers.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const handleModalSubmit = async (modalData) => {
        const { formData, files } = modalData;
        setIsSaving(true);

        try {
            let processedData = { ...formData };

            // Handle file uploads if configured
            if (config.fileFields && files) {
                setIsUploading(true);
                
                for (const fieldName of config.fileFields) {
                    if (files[fieldName]) {
                        // Upload file and wait for completion
                        if (config.api?.uploadFile) {
                            try {
                                const uploadResult = await config.api.uploadFile(files[fieldName], fieldName);
                                processedData[fieldName] = uploadResult.url;
                            } catch (error) {
                                console.error(`Failed to upload ${fieldName}:`, error);
                                throw new Error(`Failed to upload ${fieldName}`);
                            }
                        } else {
                            // For demo, use preview URL
                            processedData[fieldName] = files[fieldName].preview;
                        }
                    } else if (editingItem && editingItem[fieldName]) {
                        // Keep existing file if no new file selected during edit
                        processedData[fieldName] = editingItem[fieldName];
                    }
                }
                
                setIsUploading(false);
            }

            // Transform data if transformer provided
            if (config.transformers?.beforeSave) {
                processedData = config.transformers.beforeSave(processedData);
            }

            if (editingItem) {
                // Update existing item
                if (config.api?.update) {
                    const result = await config.api.update(editingItem[config.idField], processedData);
                    processedData = result;
                }

                // Update local state
                const updatedData = data.map(item => {
                    const itemMatch = item[config.idField] === editingItem[config.idField];
                    return itemMatch ? { ...item, ...processedData } : item;
                });
                setData(updatedData);
            } else {
                // Create new item
                if (config.api?.create) {
                    const result = await config.api.create(processedData);
                    processedData = result;
                } else {
                    // Generate ID for demo
                    processedData[config.idField] = Date.now();
                }

                setData([...data, processedData]);
            }

            handleCloseModal();
            toast.success(`${config.entityName} ${editingItem ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error('Error saving item:', error);
            toast.error(error.message || `Error saving ${config.entityName}. Please try again.`);
        } finally {
            setIsSaving(false);
            setIsUploading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setIsUploading(false);
        setIsSaving(false);
    };

    const handleDelete = async (itemId) => {
        if (window.confirm(`Are you sure you want to delete this ${config.entityName}?`)) {
            try {
                if (config.api?.delete) {
                    await config.api.delete(itemId);
                }

                const updatedData = data.filter(item => item[config.idField] !== itemId);
                setData(updatedData);
                
                // Reset to first page if current page becomes empty
                const newTotalPages = Math.ceil(updatedData.length / itemsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(1);
                }
                toast.success(`${config.entityName} deleted successfully!`);
            } catch (error) {
                console.error('Error deleting item:', error);
                toast.error(error.message || `Error deleting ${config.entityName}. Please try again.`);
            }
        }
    };

    const renderCellValue = (item, column) => {
        const value = item[column.key];
        
        if (column.render) {
            return column.render(value, item);
        }

        switch (column.type) {
            case 'image':
                return (
                    <img 
                        src={value} 
                        className="w-16 h-16 object-cover rounded-md" 
                        alt={column.label} 
                        onError={(e) => {
                            e.target.src = column.fallback || '/placeholder.png';
                        }}
                    />
                );
            case 'currency': {
                return `$${value ? value.toFixed(2) : '0.00'}`;
            }
            case 'discount': {
                // Display discount value with appropriate symbol based on type
                const discountType = item.type || 'FIXED';
                if (discountType === 'PERCENTAGE') {
                    return `${value || 0}%`;
                } else {
                    return `$${value ? value.toFixed(2) : '0.00'}`;
                }
            }
            case 'date': {
                return value ? new Date(value).toLocaleDateString() : '';
            }
            case 'boolean': {
                const trueLabel = column.trueLabel || 'Yes';
                const falseLabel = column.falseLabel || 'No';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        value 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                        {value ? trueLabel : falseLabel}
                    </span>
                );
            }
            case 'badge': {
                const badgeColors = column.badgeColors || {};
                const colorClass = badgeColors[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                        {value}
                    </span>
                );
            }
            case 'truncate': {
                return (
                    <span className="max-w-xs truncate block" title={value}>
                        {value}
                    </span>
                );
            }
            default:
                return value || '';
        }
    };

    return (
        <div className="p-5 max-w-6xl mx-auto bg-normalbg  dark:bg-darkbg min-h-screen transition-colors duration-300">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-gray-800 dark:text-gray-100 m-0 text-2xl font-semibold">
                    {config.title}
                </h2>
                {config.actions?.create !== false && (
                    <button
                        className="bg-blue-600 dark:bg-blue-700 text-white border-none py-2.5 px-5 rounded cursor-pointer text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                        onClick={() => handleOpenModal()}
                    >
                        {config.actions?.createLabel || `Add New ${config.entityName}`}
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20 overflow-x-auto border dark:border-gray-700">
                <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                        <tr>
                            {config.columns.map((column, index) => (
                                <th 
                                    key={index}
                                    className="py-3 px-4 text-left border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 font-semibold text-gray-600 dark:text-gray-300"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(config.actions?.edit !== false || config.actions?.delete !== false) && (
                                <th className="py-3 px-4 text-left border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 font-semibold text-gray-600 dark:text-gray-300">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item, index) => (
                            <tr key={item[config.idField] || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                {config.columns.map((column, colIndex) => (
                                    <td 
                                        key={colIndex}
                                        className="py-3 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                    >
                                        {renderCellValue(item, column)}
                                    </td>
                                ))}
                                {(config.actions?.edit !== false || config.actions?.delete !== false) && (
                                    <td className="py-3 px-4 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex gap-2">
                                            {config.actions?.edit !== false && (
                                                <button
                                                    className="bg-green-600 dark:bg-green-700 text-white border-none py-1.5 px-3 rounded cursor-pointer text-xs hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
                                                    onClick={() => handleOpenModal(item)}
                                                >
                                                    {config.actions?.editLabel || 'Edit'}
                                                </button>
                                            )}
                                            {config.actions?.delete !== false && (
                                                <button
                                                    className="bg-red-600 dark:bg-red-700 text-white border-none py-1.5 px-3 rounded cursor-pointer text-xs hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                                                    onClick={() => handleDelete(item[config.idField])}
                                                >
                                                    {config.actions?.deleteLabel || 'Delete'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {config.pagination !== false && totalPages > 1 && (
                <div className="flex justify-between items-center mt-5 px-5 flex-col md:flex-row gap-2.5 md:gap-0">
                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                        Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} {config.entityNamePlural || `${config.entityName}s`}
                    </div>
                    <div className="flex gap-1.5 items-center flex-wrap justify-center md:justify-start">
                        <button
                            className={`py-2 px-3 border rounded text-sm min-w-[40px] transition-all duration-200 font-medium ${
                                currentPage === 1 
                                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-500' 
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        {getPageNumbers().map((pageNumber, index) => (
                            <button
                                key={index}
                                className={`py-2 px-3 border rounded text-sm min-w-[40px] transition-all duration-200 font-medium ${
                                    pageNumber === currentPage 
                                        ? 'bg-blue-600 dark:bg-blue-600 text-white border-blue-600 dark:border-blue-600 shadow-md transform scale-105' 
                                        : pageNumber === '...' 
                                            ? 'cursor-default border-none bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent hover:border-none dark:hover:border-none text-gray-500 dark:text-gray-400' 
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                                }`}
                                onClick={() => pageNumber !== '...' && handlePageChange(pageNumber)}
                                disabled={pageNumber === '...'}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        <button
                            className={`py-2 px-3 border rounded text-sm min-w-[40px] transition-all duration-200 font-medium ${
                                currentPage === totalPages 
                                    ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-500' 
                                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'
                            }`}
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            <DataModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                editingItem={editingItem}
                isUploading={isUploading}
                isSaving={isSaving}
                config={config}
            />
        </div>
    );
};

export default DataManager;
