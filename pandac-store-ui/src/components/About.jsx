import PageTitle from "./home/PageTitle.jsx";
import {Link} from "react-router-dom";

const About = () => {
    const features = [
        {
            icon: "🌿",
            title: "Premium Quality",
            description: "We ensure every plant is healthy, well-rooted, and grown with care by trusted local growers who share our passion for greenery."
        },
        {
            icon: "💡",
            title: "Product Innovation",
            description: "Our plant collection includes self-watering pots, low-maintenance varieties, and eco-friendly packaging to support modern, sustainable living."
        },
        {
            icon: "⭐",
            title: "Excellent Service",
            description: "From plant care tips to safe delivery, our team is here to support you at every step of your plant parenthood journey."
        },
        {
            icon: "🎨",
            title: "Designs You'll Love",
            description: "Explore a variety of indoor and outdoor plants, each selected for its unique character—whether you're looking for elegance, charm, or a tropical vibe."
        }
    ];

    return (
        <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-12 font-primary">
            <PageTitle title="About Us" />

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-12 border border-green-100 dark:border-gray-700">
                <div className="flex items-center justify-center mb-6">
                    <div className="text-6xl">🌱</div>
                </div>
                <p className="text-lg leading-8 text-center text-gray-700 dark:text-lighter max-w-4xl mx-auto">
                    <span className="text-2xl font-bold text-primary dark:text-light block mb-2">
                        PandaC Store
                    </span>
                    An initiative by{" "}
                    <span className="font-semibold text-primary dark:text-light">
                        Designs by <span className={"hover:underline"}><a href={"https://pandac.in"}>PandaC.in</a></span>
                    </span>
                    , dedicated to bringing you handpicked plants that brighten your spaces and improve your well-being.
                </p>
            </div>

            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary dark:text-light mb-4">
                    Why Choose Us?
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-primary dark:text-light mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-lighter leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Plant Journey?</h3>
                <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                    Join thousands of happy plant parents who trust PandaC Store for their green companions.
                </p>
                <Link to={"/home"} className="bg-white text-green-600 font-semibold px-8 py-3 rounded-lg hover:bg-green-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
                    Explore Our Collection
                </Link>
            </div>
        </div>
    );
};

export default About;