export const appName="RECRUIT SYSTEM";
export const sidebarColor="#243070";
export const sidebarHover="#4f5ead";
export const submitButtonColor="green";
export const clickButtonColor="#3b4891";
export const clickButtonHover="#096c09";
export const innovature="Innovaturelabs";
export const login="Login";
export const submit="RESET";
export const resetPassword="RESET PASSWORD";
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
export const contentCount=8;

export const toastTime = 3000;
export const ratingRequired="Rating is required";
export const buttonSave="Save";

export const examStatuses = [
    { id: 0, value: 'SCHEDULED' },
    { id: 1, value: 'STARTED' },
    { id: 2, value: 'COMPLETED' },
    { id: 3, value: 'CANCELLED' }
];

export const examDeleteStatus = {
    examStatus : 3 
};

export const examMapStatus = {
    0: "Registered",
    1: "started",
    2: "completed",
    3: "ongoing",
  };

export const linkSharedStatus = {
    false: "Not shared",
    true: "Shared"
}

export const ratingValues = [
    { id: 1, value: "Very Poor" },
    { id: 2, value: "Poor" },
    { id: 3, value: "Good" },
    { id: 4, value: "Very Good" },
    { id: 5, value: "Excellent" }
];
export const iconSize="28px";

export const questionLevel = [
    { id: 3, value: "Hard", color: "red.500" },
    { id: 2, value: "Medium", color: "orange.400" },
    { id: 1, value: "Easy", color: "green.500" }
];


export const questionnaire = [
    {id: 1, value: "Paper 1"},
    {id: 2, value: "Paper 2"},
    {id: 3, value: "Paper 3"},

]

export const courses = [
    {id:1, value: "Bachelor of Technology in Computer Science and Engineering"},
    {id:2, value: "Bachelor of Technology in Information Technology"},
    {id:3, value: "Bachelor of Engineering in Computer Science and Engineering"},
    {id:4, value: "Bachelor of Engineering in Information Technology"},
    {id:5, value: "Bachelor of Computer Applications"},
    {id:6, value: "Master of Computer Applications"},
    {id:7, value: "Master of Computer Science"},
    {id:8, value: "Bachelor of Science in Computer Science"},
    {id:9, value: "Bachelor of Engineering in Artificial Intelligence and Data Science"},

]
export const validateCategories = (data, categoryDetails, setErrorMessage) => {
    let isValid = true;
    let index = 0;
    setErrorMessage('');

    while (data[`category_${index}`]) {
        const selectedCategoryId = parseInt(data[`category_${index}`], 10);
        const enteredEasyQuestions = parseInt(data[`level_${index}_1`], 10) || 0;
        const enteredMediumQuestions = parseInt(data[`level_${index}_2`], 10) || 0;
        const enteredHardQuestions = parseInt(data[`level_${index}_3`], 10) || 0;
        const category = categoryDetails.find(cat => cat.id === selectedCategoryId);
        
        if (!category) {
            setErrorMessage(`Category not found for category ID: ${selectedCategoryId}`);
            isValid = false;
            break;
        }
        if (enteredEasyQuestions > category.easyCount) {
            setErrorMessage(
                `Number of easy questions entered for ${category.categoryName} exceeds the available count of ${category.easyCount}.`
            );
            isValid = false;
            break;
        }
        if (enteredMediumQuestions > category.mediumCount) {
            setErrorMessage(
                `Number of medium questions entered for ${category.categoryName} exceeds the available count of ${category.mediumCount}.`
            );
            isValid = false;
            break;
        }
        if (enteredHardQuestions > category.hardCount) {
            setErrorMessage(
                `Number of hard questions entered for ${category.categoryName} exceeds the available count of ${category.hardCount}.`
            );
            isValid = false;
            break;
        }

        index++;
    }

    return isValid;
};
