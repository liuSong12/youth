import { useEffect } from 'react'
import './App.css'
import {HashRouter, useNavigate} from "react-router-dom"
import IndexRouter from "./indexrouter/IndexRouter.js"
import Tabbar from "./components/tabbar/Tabbar"
import {connect} from "react-redux"
import {remove} from "./utils/setLocal.js"
import ioWatch from './utils/ioconfig'

function App(props) {
	useEffect(()=>{
		
		ioWatch("newStoreOrder",(msg)=>{
			if(props.storeInfo && props.storeInfo.responsePhone==msg.phone){
				props.changeStoreNum(msg.num)
			}
		})
		ioWatch("newPackage",(msg)=>{
			props.changePackageNum(msg)
		})
		return ()=>{
			remove("store-nav")
			remove("package-nav")
			remove("super-nav")
		}
	},[])
	document.addEventListener('plusready', function () {
	    let time = null;
		var webview = window.plus.webview.currentWebview();
	    window.plus.key.addEventListener('backbutton', function () {
	        webview.canBack(function (e) {
	            if (!time) {
	                time = new Date().getTime();
	            	plus.nativeUI.toast("再按一次退出应用", {
	            	   duration: 'short'
	            	});
	                setTimeout(function () {
	                    time = null;
	                }, 1000);
	            } else {
	                if (new Date().getTime() - time < 1000) {
	                    window.plus.runtime.quit();
	            		webview.close()
	                }
	            }
	        })
	    });
	})
	
  return (
    <HashRouter>
		<IndexRouter></IndexRouter>
		{props.isShow && <Tabbar></Tabbar>}
	</HashRouter>
  )
}

const mapStateToProps = (state)=>{
	return {
		isShow:state.TabbarReducer.isShow,
		storeInfo:state.GlobalStoreReducer.storeInfo,
		workerInfo:state.GlobalStoreReducer.workerInfo
	}
}

const mapDispathToProps = {
	changeStoreNum(payload){
		return {
			type:"change-storenum",
			payload
		}
	},
	changePackageNum(payload){
		return {
			type:"change-packageNum",
			payload
		}
	}
}
export default connect(mapStateToProps,mapDispathToProps)(App)