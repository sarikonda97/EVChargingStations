import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import RESTCaller from './helpers';
import './site.css';
import './MapView.css';

const { ACCESS_KEY } = process.env;
mapboxgl.accessToken = ACCESS_KEY;

const loader = (
    <div className="loader-wrapper">
        <span className="loader"><span className="loader-inner" /></span>
    </div>
);

const MapView = () => {
    const [isLoaderVisible, setLoaderVisible] = useState(true);
    const mapContainer = useRef(null);

    // function to add the charging station pins to the map
    const addStationPinsToMap = (pinData, map) => {
        pinData.forEach((station) => {
            const addressTitle = station.AddressInfo.Title;
            const accessComments = station.AddressInfo.AccessComments != null ? station.AddressInfo.AccessComments : '';
            new mapboxgl
                .Marker({ color: 'green' })
                .setLngLat([
                    station.AddressInfo.Longitude,
                    station.AddressInfo.Latitude])
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(`<span><h3>${addressTitle}</h3><p>${accessComments}</p></span>`))
                .addTo(map);
        });

        setLoaderVisible(false);
    };

    // function that gets the map bounds and calls addStationsPinsToMap
    const getChargingStationsByMapBounds = async (bounds, map) => {
        const LatLong1 = `(${bounds._ne.lat}, ${bounds._ne.lng})`;
        const LatLong2 = `(${bounds._sw.lat}, ${bounds._sw.lng})`;
        const chargeMapUrl = `https://api.openchargemap.io/v3/poi/?output=json&boundingbox=${LatLong1},${LatLong2}`;
        const headers = { 'X-API-Key': mapboxgl.accessToken };

        const data = await RESTCaller(chargeMapUrl, headers);
        addStationPinsToMap(data, map);
    };

    // initialize map when component mounts
    useEffect(() => {
        // Initializing map
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 12,
            center: [-113.5065, 53.5344], // Map defaults to Edmonton as starting location
        });
        new mapboxgl
            .Marker({
                color: 'red',
            })
            .setLngLat([-113.5065, 53.5344])
            .addTo(map);
        map.on('load', () => {
            getChargingStationsByMapBounds(map.getBounds(), map);
        });
        map.on('moveend', () => getChargingStationsByMapBounds(map.getBounds(), map));

        // Add navigation control (zoom-in/ zoom-out / rotate) to the map
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        // Add location search box
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            marker: {
                color: 'red',
            },
            mapboxgl,
        });
        map.addControl(geocoder);

        // On successful fly to the searched location. Drop charging station pins on map
        geocoder.on('result', () => {
            map.on('moveend', () => {
                setLoaderVisible(true);
                getChargingStationsByMapBounds(map.getBounds(), map);
            });
        });

        // Adding location control to select current user location
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            trackUserLocation: true,
        });
        map.addControl(geolocate);

        // On successful geolocation. Drop charging station pins on map
        geolocate.on('geolocate', () => {
            map.on('moveend', () => {
                setLoaderVisible(true);
                getChargingStationsByMapBounds(map.getBounds(), map);
            });
        });
    }, []);

    return (
        <div>
            { isLoaderVisible ? loader : null }
            <div className="map-container" ref={mapContainer} />
        </div>
    );
};

export default MapView;
