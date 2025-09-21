import React, { useState, useEffect } from 'react';

const DataModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    editingItem = null,
    isUploading = false,
    isSaving = false,
    config
}) => {
    const [formData, setFormData] = useState({});
    const [files, setFiles] = useState({});
    const [previews, setPreviews] = useState({});

    // Initialize form data based on config
    useEffect(() => {
        if (isOpen) {
            const initialData = {};
            
            config.fields.forEach(field => {
                if (editingItem) {
                    initialData[field.key] = editingItem[field.key] || field.defaultValue || '';
                } else {
                    initialData[field.key] = field.defaultValue || '';
                }
            });

            setFormData(initialData);

            // Set existing file previews for editing
            if (editingItem && config.fileFields) {
                const initialPreviews = {};
                config.fileFields.forEach(fieldKey => {
                    if (editingItem[fieldKey]) {
                        initialPreviews[fieldKey] = editingItem[fieldKey];
                    }
                });
                setPreviews(initialPreviews);
            } else {
                setPreviews({});
            }
            
            setFiles({});
        }
    }, [isOpen, editingItem, config]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e, fieldKey) => {
        const file = e.target.files[0];
        if (file) {
            // Store the original file object
            setFiles({
                ...files,
                [fieldKey]: file
            });
            
            // Create preview URL separately
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews({
                    ...previews,
                    [fieldKey]: reader.result
                });
                // Don't overwrite the original file - keep it as-is
            };
            reader.readAsDataURL(file);
        } else {
            const newFiles = { ...files };
            const newPreviews = { ...previews };
            delete newFiles[fieldKey];
            delete newPreviews[fieldKey];
            setFiles(newFiles);
            setPreviews(newPreviews);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = config.fields.filter(field => field.required);
        for (const field of requiredFields) {
            if (!formData[field.key] || formData[field.key].toString().trim() === '') {
                alert(`${field.label} is required`);
                return;
            }
        }

        onSubmit({
            formData,
            files
        });
    };

    const handleClose = () => {
        setFormData({});
        setFiles({});
        setPreviews({});
        onClose();
    };

    const renderField = (field) => {
        const commonClasses = "w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded text-sm box-border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:shadow-[0_0_0_2px_rgba(0,123,255,0.25)] dark:focus:shadow-[0_0_0_2px_rgba(59,130,246,0.25)] transition-all duration-200";

        switch (field.type) {
            case 'text':
            case 'email':
            case 'url':
                return (
                    <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={commonClasses}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        placeholder={field.placeholder}
                        className={commonClasses}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        placeholder={field.placeholder}
                        rows={field.rows || 3}
                        className={`${commonClasses} resize-y`}
                        style={{ height: field.height || 'auto' }}
                    />
                );

            case 'select':
                return (
                    <select
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        className={commonClasses}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name={field.key}
                            checked={formData[field.key] || false}
                            onChange={handleInputChange}
                            className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{field.checkboxLabel || 'Enable'}</span>
                    </label>
                );

            case 'file':
                return (
                    <div>
                        <input
                            type="file"
                            accept={field.accept || "*/*"}
                            onChange={(e) => handleFileChange(e, field.key)}
                            className={commonClasses}
                        />
                        {previews[field.key] && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                                <div className="relative">
                                    {field.accept?.includes('image') ? (
                                        <img 
                                            src={previews[field.key]} 
                                            alt="Preview" 
                                            className="w-32 h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                        />
                                    ) : (
                                        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                File selected: {files[field.key]?.name || 'Current file'}
                                            </span>
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                            <div className="text-white text-xs">Uploading...</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'date':
                return (
                    <input
                        type="date"
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        className={commonClasses}
                    />
                );

            case 'datetime-local':
                return (
                    <input
                        type="datetime-local"
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        className={commonClasses}
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        name={field.key}
                        value={formData[field.key] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        placeholder={field.placeholder}
                        className={commonClasses}
                    />
                );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex justify-center items-center z-[1000] transition-all duration-300">
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg p-0 w-[500px] max-w-[90vw] max-h-[90vh] overflow-y-auto shadow-xl dark:shadow-gray-900/50 border dark:border-gray-700 modal-scrollbar"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#9CA3AF #F3F4F6'
                }}
            >
                <style>{`
                    .modal-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .modal-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .modal-scrollbar::-webkit-scrollbar-thumb {
                        background: #D1D5DB;
                        border-radius: 3px;
                    }
                    .modal-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #9CA3AF;
                    }
                    .dark .modal-scrollbar::-webkit-scrollbar-thumb {
                        background: #4B5563;
                    }
                    .dark .modal-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #6B7280;
                    }
                `}</style>
                
                <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="m-0 text-gray-800 dark:text-gray-100 text-lg font-semibold">
                        {editingItem ? 
                            (config.modal?.editTitle || `Edit ${config.entityName}`) : 
                            (config.modal?.createTitle || `Add New ${config.entityName}`)
                        }
                    </h3>
                    <button 
                        className="bg-transparent border-none text-2xl cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200" 
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                    {config.fields.map((field, index) => (
                        <div key={index} className="mb-5">
                            <label className="block mb-1.5 font-medium text-gray-600 dark:text-gray-300">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderField(field)}
                            {field.helpText && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {field.helpText}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end mt-7">
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            disabled={isSaving}
                            className="bg-gray-600 dark:bg-gray-700 text-white border-none py-2.5 px-5 rounded cursor-pointer mr-2.5 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {config.modal?.cancelLabel || 'Cancel'}
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSaving || isUploading}
                            className="bg-blue-600 dark:bg-blue-700 text-white border-none py-2.5 px-5 rounded cursor-pointer text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {(isSaving || isUploading) && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {isUploading ? (config.modal?.uploadingLabel || 'Uploading...') : 
                             isSaving ? (config.modal?.savingLabel || 'Saving...') : 
                             editingItem ? 
                                (config.modal?.updateLabel || `Update ${config.entityName}`) : 
                                (config.modal?.createLabel || `Add ${config.entityName}`)
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DataModal;
