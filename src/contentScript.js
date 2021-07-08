import { storage } from "./utils/const";
import { isBlockWebsite } from "./utils/helper";
import InjectTimer from "./views/Timer/InjectTimer";

storage.get(storage => {
    isBlockWebsite(window.location.origin, storage, result => {
        if (result) {
            InjectTimer();
        }
    })
})