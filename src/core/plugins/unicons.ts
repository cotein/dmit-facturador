import app from '../../config/configApp';
import Unicon from 'vue-unicons';
import * as unicons from 'vue-unicons/src/icons';
console.log('🚀 ~ unicons:', unicons);

const icons: any[] = [];
Object.values(unicons).map((icon: any) => {
	console.log('🚀 ~ Object.values ~ icon:', icon);
	icons.push(icon);
});

Unicon.add(icons);

app.use(Unicon);
