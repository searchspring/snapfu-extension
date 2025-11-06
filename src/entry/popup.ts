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
	faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

library.add(faBan, faGear, faSave, faToggleOff, faUndo, faMagnifyingGlass, faList, faLocationCrosshairs, faGrip, faAngleUp, faAngleDown, faCircleInfo);

const snapp = createApp(popup, { version: packageJson.version });
snapp.component('font-awesome-icon', FontAwesomeIcon);
snapp.mount('#app');
