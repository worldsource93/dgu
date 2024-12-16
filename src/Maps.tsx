import { Map, View } from 'ol';
import './App.css';
import { useEffect, useState } from 'react';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import { XYZ, Vector as VectorSource } from 'ol/source';
import * as olProj from 'ol/proj';
import {FullScreen, defaults as defaultControls} from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
import Select from 'ol/interaction/Select.js';

function Maps() {

	const [map, setMap] = useState(null);
	const [selectMapOpen, setSelectMapOpen] = useState(false);
	const [selectMap, setSelectMap] = useState('base');
	// const [selectFeature, setSelectFeature] = useState(null);

	const selected = new Style({
		image: new CircleStyle({
			radius: 7,
			fill: new Fill({
				color: 'rgba(255, 255, 255, 0.8)',
			}),
			stroke: new Stroke({
				color: '#ff0066',
				width: 2,
			}),
		}),
	});

	const selectSingleClick = new Select({style: selected});

	const handleChangeMap = (value: string) => {
		setSelectMap(value);
		if(map) {
			const layers = ((map as Map).getLayers().getArray()[0] as LayerGroup).getLayers().getArray();
			if(value === 'base') {
				layers[0].setVisible(true);
				layers[1].setVisible(false);
			} else {
				layers[0].setVisible(false); 
				layers[1].setVisible(true);
			}
		}
	}
	
	useEffect(() => {
		
		if(!map) {
			const view = new View({
        center: olProj.transform([126.996047, 37.5595654], 'EPSG:4326', 'EPSG:3857'),
        projection: 'EPSG:3857',
        zoom: 16,
        enableRotation: false,
      });

			const pointSource = new VectorSource({
				url: 'geojson/point.geojson',
				format: new GeoJSON({ dataProjection: 'EPSG:4326' }),
			});

			const lineSource = new VectorSource({
				url: 'geojson/road.geojson',
				format: new GeoJSON({ dataProjection: 'EPSG:4326' }),
			});

			const _map = new Map({
				target: 'map',
				view,
				layers: [
          new LayerGroup({
            layers: [
							new TileLayer({
								// title: 'base',
								visible: true,
                source: new XYZ({
									url: 'https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png',
									attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토��통부',
                }),
              }),
							new TileLayer({
								// title: 'satellite',
								visible: false,
								source: new XYZ({
									url: 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg',
									attributions: '공간정보오픈플랫폼 VWORLD 2019 | 국토교통부',
								}),
							}),
            ]
          }),
          new LayerGroup({
            layers: [
							new VectorLayer({
								// title: 'line',
								visible: true,
								source: lineSource,
								style: new Style({
									stroke: new Stroke({
										color: '#4cac61',
										width: 2,
									}),
								}),
							}),
              new VectorLayer({
								// title: 'point',
								visible: true,
								source: pointSource,
								style: new Style({
									image: new CircleStyle({
										radius: 7,
										fill: new Fill({ color: '#0066ff' }),
									}),
								}),
              }),
            ]
          })
        ],
				controls: defaultControls().extend([new FullScreen()]),
			});

			_map.addInteraction(selectSingleClick);
			selectSingleClick.on('select', (event) => {
				console.log(event);
			});

			if(!_map) {
				setMap(_map);
			}
		}

	}, []);

	return (
		<div id='map'>
			<div className="btn-box">
				<div className={`btn ${selectMapOpen ? 'active' : ''}`} onClick={() => setSelectMapOpen(!selectMapOpen)}>
					<img src="/dgu/images/icMap.svg" alt="map icon" />
					<p>Map</p>
				</div>
				{
					selectMapOpen && (
						<div className="map-box">
							<div className={selectMap === 'base' ? 'image-box active' : 'image-box'} onClick={() => handleChangeMap('base')}>
								<img src="/dgu/images/base.png" alt="base" />
								<div className="map-name">Base</div>
							</div>
							<div className={selectMap === 'satellite' ? 'image-box active' : 'image-box'} onClick={() => handleChangeMap('satellite')}>
								<img src="/dgu/images/satellite.png" alt="satellite" />
								<div className="map-name">Satellite</div>
							</div>
						</div>
					)
				}
			</div>
		</div>
	);
}

export default Maps;
