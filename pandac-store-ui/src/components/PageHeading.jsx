import PageTitle from "./PageTitle.jsx";

const PageHeading = ({title, children}) => {
    return (
        <div className="text-center max-w-[576px] mx-auto px-4 py-6">
            <PageTitle title={title} />
            <p className="font-primary leading-6 text-gray-600">
                {children}
            </p>
        </div>
    );
}

export default PageHeading;