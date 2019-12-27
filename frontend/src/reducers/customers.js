import { LOAD_DATA_SUCCESS } from "../actions/customerActions";

const initialState = {
	customers: []
};

export const counterReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_DATA_SUCCESS:
			return {
				...state,
				customers: action.data
			};

		default:
			return state;
	}
};