import {createStore,combineReducers} from "redux"
import GlobalStoreReducer from "./globalreducer/GobalReducer"
import TabbarReducer from "./tabbarreducer/TabbarReducer"
import DetailReducer from "./detailreducer/DetailReducer"

const reducer = combineReducers({
	GlobalStoreReducer,TabbarReducer,DetailReducer
})

const store = createStore(reducer)
export default store