import { h, Component } from 'preact';
import style from './style';
import { MAPS_API_KEY } from '../../config';

const theme = [
	{
		featureType: 'all',
		elementType: 'all',
		stylers: [
			{
				visibility: 'on'
			}
		]
	},
	{
		featureType: 'all',
		elementType: 'labels',
		stylers: [
			{
				visibility: 'off'
			},
			{
				saturation: '-100'
			}
		]
	},
	{
		featureType: 'all',
		elementType: 'labels.text.fill',
		stylers: [
			{
				saturation: 36
			},
			{
				color: '#000000'
			},
			{
				lightness: 40
			},
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'all',
		elementType: 'labels.text.stroke',
		stylers: [
			{
				visibility: 'off'
			},
			{
				color: '#000000'
			},
			{
				lightness: 16
			}
		]
	},
	{
		featureType: 'all',
		elementType: 'labels.icon',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'administrative',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#000000'
			},
			{
				lightness: 20
			}
		]
	},
	{
		featureType: 'administrative',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#000000'
			},
			{
				lightness: 17
			},
			{
				weight: 1.2
			}
		]
	},
	{
		featureType: 'landscape',
		elementType: 'geometry',
		stylers: [
			{
				color: '#000000'
			},
			{
				lightness: 20
			}
		]
	},
	{
		featureType: 'landscape',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#4d6059'
			}
		]
	},
	{
		featureType: 'landscape',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#4d6059'
			}
		]
	},
	{
		featureType: 'landscape.natural',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#4d6059'
			}
		]
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [
			{
				lightness: 21
			}
		]
	},
	{
		featureType: 'poi',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#4d6059'
			}
		]
	},
	{
		featureType: 'poi',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#4d6059'
			}
		]
	},
	{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [
			{
				visibility: 'on'
			},
			{
				color: '#7f8d89'
			}
		]
	},
	{
		featureType: 'road',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#7f8d89'
			}
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#7f8d89'
			},
			{
				lightness: 17
			}
		]
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#7f8d89'
			},
			{
				lightness: 29
			},
			{
				weight: 0.2
			}
		]
	},
	{
		featureType: 'road.arterial',
		elementType: 'geometry',
		stylers: [
			{
				color: '#000000'
			},
			{
				lightness: 18
			}
		]
	},
	{
		featureType: 'road.arterial',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#7f8d89'
			}
		]
	},
	{
		featureType: 'road.arterial',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#7f8d89'
			}
		]
	},
	{
		featureType: 'road.local',
		elementType: 'geometry',
		stylers: [
			{
				color: '#000000'
			},
			{
				lightness: 16
			}
		]
	},
	{
		featureType: 'road.local',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#7f8d89'
			}
		]
	},
	{
		featureType: 'road.local',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#7f8d89'
			}
		]
	},
	{
		featureType: 'transit',
		elementType: 'geometry',
		stylers: [
			{
				color: '#000000'
			},
			{
				lightness: 19
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'all',
		stylers: [
			{
				color: '#2b3638'
			},
			{
				visibility: 'on'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [
			{
				color: '#2b3638'
			},
			{
				lightness: 17
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'geometry.fill',
		stylers: [
			{
				color: '#24282b'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'geometry.stroke',
		stylers: [
			{
				color: '#24282b'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'labels',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'labels.text',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'labels.text.stroke',
		stylers: [
			{
				visibility: 'off'
			}
		]
	},
	{
		featureType: 'water',
		elementType: 'labels.icon',
		stylers: [
			{
				visibility: 'off'
			}
		]
	}
];

export default class Map extends Component {
	loadGoogleMaps = () => {
		let head = document.getElementsByTagName('head')[0];

		if (head.hasMap) {
			this.scriptLoaded();
			return;
		}

		const script = document.createElement('script');
		script.async = true;
		script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}`;
		script.onload = this.scriptLoaded;
		head.insertBefore(script, head.lastChild);
		head.hasMap = true;
	};

	scriptLoaded = () => {
		const map = new google.maps.Map(this.mapDom, {
			zoom: 14,
			center: this.props.points[0].gps,
			disableDefaultUI: true,
			disableDoubleClickZoom: true,
			scrollwheel: false,
			zoomControl: false,
			styles: theme
		});

		const path = this.props.points.map(item => item.gps);

		let flightPath = new google.maps.Polyline({
			path,
			geodesic: true,
			strokeColor: '#007aff',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		flightPath.setMap(map);
	};

	constructor() {
		super();
		this.mapDom = null;
	}

	componentDidMount() {
		this.loadGoogleMaps();
	}

	render() {
		return (
			<div ref={e => (this.mapDom = e)} class={style.map}>
				Loading...
			</div>
		);
	}
}
