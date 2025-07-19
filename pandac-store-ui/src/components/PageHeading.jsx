import PageTitle from "./PageTitle.jsx";

const PageHeading = ({title, children}) => {
    return (
        <div className="page-heading-container">
            <PageTitle title={title} />
            <p className="page-heading-paragraph">
                {children}
            </p>
        </div>
    );
}

export default PageHeading;