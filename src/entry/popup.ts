import { createApp } from 'vue';
import packageJson from '../../package.json';
import popup from '../components/popup.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
	faBan,
	faGear,
	faSave,
	faToggleOff,
	faUndo,
	faMagnifyingGlass,
	faList,
	faLocationCrosshairs,
	faGrip,
	faAngleUp,
	faAngleDown,
} from '@fortawesome/free-solid-svg-icons';

library.add(faBan, faGear, faSave, faToggleOff, faUndo, faMagnifyingGlass, faList, faLocationCrosshairs, faGrip, faAngleUp, faAngleDown);

const snapp = createApp(popup, { version: packageJson.version });
snapp.component('font-awesome-icon', FontAwesomeIcon);
snapp.mount('#app');

/*

	NEXT UP:
	* styling cleanup

	* can we prevent intercepts when extension should be disabled using "click to enable"
		+ if possible don't intercept when "disabled" 
		+ add overlay/modal when intercepting
*/
