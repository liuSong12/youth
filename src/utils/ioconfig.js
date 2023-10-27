import GlobalConfig from "../GlobalConfig.js";
import {io} from "./socketIo.js"
const socket = io(`${GlobalConfig.SOCKETIO}?token=${localStorage.getItem("token")}`);
function ioWatch(event,cb){
	socket.on(event, (msg)=>{
		cb(msg)
	});
}

export default ioWatch