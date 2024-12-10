import { useState } from "react";
import { adminServices } from "../services/AdminServices";

const useCategories = (setErrorMessage) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);

  const fetchCategoryDetails = async () => {
    try {
      const response = await adminServices.dropdownLists('question_category');
      if (response.status === 200) {
        setCategoryOptions(response.data.map(category => ({ id: category.id, value: category.question_category_name })));
      }
    } catch (error) {
      setErrorMessage("Failed to fetch categories.");
    }
  };

  const fetchCategoryQuestionCount = async () => {
    try {
      const response = await adminServices.adminGetCategoryQuestionsCount();
      if (response.status === 200) {
        setCategoryDetails(response.data.map(category => ({
          id: category.categoryId,
          categoryName:category.categoryName,
          easyCount: category['easy'],
          mediumCount: category['medium'],
          hardCount: category['hard'],
        })));
      }
    } catch (error) {
      setErrorMessage("Failed to fetch category question counts.");
    }
  };

  return { categoryOptions, categoryDetails, fetchCategoryDetails, fetchCategoryQuestionCount };
};

export default useCategories;
