import React from "react";
import PageTitle from "./PageTitle.jsx";
import styles from "./PageHeading.module.css";

export default function PageHeading({ title, children }) {
    return (
        <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-50/30 to-transparent dark:via-gray-800/20"></div>
            <div className={`relative text-center max-w-4xl mx-auto px-6 py-16 ${styles.slideUp}`}>
                <div className="space-y-6">
                    <div className={styles.fadeInDelay1}>
                        <PageTitle title={title} />
                    </div>
                    <div className={styles.fadeInDelay2}>
                        <div className="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-400 mx-auto mb-6 rounded-full"></div>
                        <p className="font-primary text-lg leading-8 text-gray-600 dark:text-lighter max-w-2xl mx-auto">
                            {children}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}