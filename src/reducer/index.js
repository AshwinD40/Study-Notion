import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/store/auth.slice"
import cartReducer from "../features/cart/store/cart.slice";
import courseReducer from "../features/courses/store/course.slice";
import viewCourseReducer from "../features/learning/store/learning.slice";

const rootReducer = combineReducers({
    auth: authReducer,
    cart:cartReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
})

export default rootReducer
