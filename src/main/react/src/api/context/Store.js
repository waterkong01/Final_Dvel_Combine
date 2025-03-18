import {configureStore} from "@reduxjs/toolkit";
import ModalReducer from "./ModalReducer";
import PersistentReducer from "./PersistentReducer";

const Store = configureStore({
	reducer: {
		persistent: PersistentReducer, // localStorage 연동
		modal: ModalReducer,
	},
	
});

export default Store;