import { LOAD_DATA, LoadDataSuccess } from "../actions/customerActions";
import { put, takeLatest, call } from "redux-saga/effects";
import * as ServiceApi from '../service/api';
import { getAgGridRowData } from '../util/Helpers';

export function* loadData(action) {
	const data = yield call(ServiceApi.loadData);
	yield put(LoadDataSuccess(getAgGridRowData(data)));
}

export function* watchCustomer() {
  yield takeLatest(LOAD_DATA, loadData);
}