import getCategories from "@/src/features/categories/server/categories.action";
import Our_chatbot from "../components/Our-chatbot";
import Footer_home from "../components/Footer-home";
import Our_Products from "../components/Our-Products";
import Pharmacy_info from "../components/Pharmacy-info";
import FeturesInfo from "../components/Who-we-are";
import Healthy  from "../components/Healthy";

export default async function HomeScreen() {
      const response = await getCategories();
    return (
        <>
            <Healthy />
            <FeturesInfo />
            <Our_chatbot />
            <Our_Products products={response.data} />
            <Pharmacy_info />
            <Footer_home />
           
        </>
    );
}
