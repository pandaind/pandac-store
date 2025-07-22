import apiClient from "../api/apiClient.js";
import {toast} from "react-toastify";

export const contactAction = async ({request}) => {
    const data = await request.formData();

    const contactData = {
        name: data.get("name"),
        email: data.get("email"),
        mobileNumber: data.get("mobileNumber"),
        message: data.get("message"),
    };

    try {
        await apiClient.post("/contacts", contactData);
        // Returning an object is great for useActionData
        return {success: true};
    } catch (error) {
        const errorMessage =
            error.response?.data?.message ||
            "Failed to submit your message. Please try again.";

        // Displaying the error here is fine, but throwing a Response
        // is the standard way to trigger the route's errorElement.
        toast.error(errorMessage);

        // Throwing a response will be caught by the nearest errorElement.
        throw new Response(errorMessage, {
            status: error.response?.status || 500,
        });
    }
};